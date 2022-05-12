import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as iam from "@aws-cdk/aws-iam";
import * as asg from "@aws-cdk/aws-autoscaling";
import * as s3 from '@aws-cdk/aws-s3';

interface ChaosProductCompositeStackProps extends cdk.StackProps {
  vpc: ec2.Vpc,
  appSecurityGroup: ec2.SecurityGroup,
  albSecurityGroup: ec2.SecurityGroup,
  eurekaAlbDnsName: String,
  chaosBucket: s3.Bucket,
}

export class ChaosProductCompositeStack extends cdk.Stack {
  public readonly productCompositeAlb: elbv2.ApplicationLoadBalancer;
  public readonly productCompositeAsg: asg.AutoScalingGroup;
  public readonly productCompositeListenerTarget: elbv2.ApplicationTargetGroup;

  constructor(scope: cdk.Construct, id: string, props: ChaosProductCompositeStackProps) {
    super(scope, id, props);
    const vpc = props.vpc;

    const ec2Role = new iam.Role(this, "ec2Role", {
          assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
          managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
            iam.ManagedPolicy.fromAwsManagedPolicyName('AWSXRayDaemonWriteAccess'),
            iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchAgentServerPolicy'),
            iam.ManagedPolicy.fromAwsManagedPolicyName('AutoScalingConsoleFullAccess')
          ]
        }
    );
    props.chaosBucket.grantRead(ec2Role);

    const amznLinux = ec2.MachineImage.latestAmazonLinux({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      edition: ec2.AmazonLinuxEdition.STANDARD,
      virtualization: ec2.AmazonLinuxVirt.HVM,
      storage: ec2.AmazonLinuxStorage.GENERAL_PURPOSE,
      cpuType: ec2.AmazonLinuxCpuType.X86_64,
    });

    const instanceType = ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO);
    
    const cloudConfig = ec2.UserData.custom(`
      #cloud-config
      cloud_final_modules:
       - [scripts-user, always]
    `);
    
    const setupCommands = ec2.UserData.forLinux();
    setupCommands.addCommands(`
      if [ ! -f /root/app/start.sh ]; then
        /bin/echo 'install start' >> /root/app/bootstrap.log
        yum update -y
        yum install -y https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm && systemctl enable amazon-ssm-agent && systemctl start amazon-ssm-agent
        yum install java-11-amazon-corretto -y
        yum install amazon-cloudwatch-agent -y && amazon-cloudwatch-agent-ctl -a start
        yum install -y https://s3.us-east-2.amazonaws.com/aws-xray-assets.us-east-2/xray-daemon/aws-xray-daemon-3.x.rpm
        mkdir -p /root/xray/ && cd /root/xray && wget https://github.com/aws/aws-xray-java-agent/releases/latest/download/xray-agent.zip && unzip xray-agent.zip
        mkdir -p /root/log & mkdir -p /root/app && cd /root/app
      
        # start.sh
        echo '#!/bin/bash' >> start.sh
        echo 'set -e' >> start.sh
        echo 'aws s3 cp s3://${props.chaosBucket.bucketName}/product-composite.jar  /root/app/product-composite.jar' >> start.sh
        echo 'cd /root/app/' >> start.sh
        #echo 'java -jar -javaagent:/root/xray/disco/disco-java-agent.jar=pluginPath=/root/xray/disco/disco-plugins -Dcom.amazonaws.xray.strategy.tracingName=product-composite -Dspring.profiles.active=aws -Deureka.client.serviceUrl.defaultZone=http://${props.eurekaAlbDnsName}/eureka/ -Dlogging.file.path=/root/log product-composite.jar &' >> start.sh
        echo 'java -jar -Dspring.profiles.active=aws -Deureka.client.serviceUrl.defaultZone=http://${props.eurekaAlbDnsName}/eureka/ -Dlogging.file.path=/root/log product-composite.jar &' >> start.sh
        echo 'echo $! > ./app.pid' >> start.sh
        chmod 744 ./start.sh
        
        # stop.sh
        echo '#!/bin/bash' >> stop.sh
        echo 'set -e' >> stop.sh
        echo 'PID=\`cat /root/app/app.pid\`' >> stop.sh
        echo 'kill $PID' >> stop.sh
        chmod 744 ./stop.sh
        
        # start service
        aws s3 cp s3://${props.chaosBucket.bucketName}/app.service  ./app.service
        mv ./app.service /etc/systemd/system/
        systemctl enable app && systemctl start app
        sleep 180
        /bin/echo 'install end' >> /root/app/bootstrap.log
      fi
      
      # complete signal to asg
      /bin/echo 'complete signal to asg start' >> /root/app/bootstrap.log
      INSTANCE_ID=\`curl http://169.254.169.254/latest/meta-data/instance-id\`
      ASG_ID=\`aws autoscaling describe-auto-scaling-groups --query "AutoScalingGroups[? Tags[? (Key=='aws:cloudformation:stack-name') && Value=='ChaosProductCompositeStack']]".AutoScalingGroupName --output text --region ${process.env.CDK_DEFAULT_REGION}\`
      aws autoscaling complete-lifecycle-action --lifecycle-action-result CONTINUE \
        --instance-id $INSTANCE_ID --lifecycle-hook-name productCompositeAsgLc \
        --auto-scaling-group-name $ASG_ID \
        --region ${process.env.CDK_DEFAULT_REGION} >> /root/app/bootstrap.log
      /bin/echo 'complete signal to asg end' >> /root/app/bootstrap.log
    `);
    
    const multipartUserData = new ec2.MultipartUserData();
    multipartUserData.addPart(ec2.MultipartBody.fromUserData(cloudConfig, 'text/cloud-config; charset="us-ascii"'));
    multipartUserData.addPart(ec2.MultipartBody.fromUserData(setupCommands));

    this.productCompositeAsg = new asg.AutoScalingGroup(this, 'productCompositeAsg', {
      vpc,
      role: ec2Role,
      instanceType: instanceType,
      machineImage: amznLinux,
      vpcSubnets: vpc.selectSubnets({subnetType: ec2.SubnetType.PRIVATE}),
      securityGroup: props.appSecurityGroup,
      minCapacity: 2,
      maxCapacity: 4,
      desiredCapacity: 2,
      instanceMonitoring: asg.Monitoring.DETAILED,
      userData: multipartUserData
    });
    
    const productCompositeAsgLc = new asg.CfnLifecycleHook(this, "productCompositeAsgLc", {
      autoScalingGroupName: this.productCompositeAsg.autoScalingGroupName,
      lifecycleTransition: asg.LifecycleTransition.INSTANCE_LAUNCHING,
      defaultResult: asg.DefaultResult.ABANDON,
      lifecycleHookName: "productCompositeAsgLc",
      heartbeatTimeout: 600
    });
    
    this.productCompositeAsg.scaleOnCpuUtilization('productCompositeAsgScalingOnCpu', {
      targetUtilizationPercent: 60,
      estimatedInstanceWarmup: cdk.Duration.seconds(60)
    });

    this.productCompositeAlb = new elbv2.ApplicationLoadBalancer(this, 'productCompositeAlb', {
      vpc,
      securityGroup: props.albSecurityGroup,
      vpcSubnets: vpc.selectSubnets({subnetType:  ec2.SubnetType.PUBLIC} ),
      internetFacing: true,
    });

    const productCompositeListener = this.productCompositeAlb.addListener('productCompositeListener', {
      port: 80,
    });

    this.productCompositeListenerTarget = productCompositeListener.addTargets('productCompositeAlbTargets', {
      port: 80,
      targets: [
        this.productCompositeAsg
      ]
    });

    new cdk.CfnOutput(this, 'productCompositeAlbDnsName', { value: this.productCompositeAlb.loadBalancerDnsName });
  }
}
