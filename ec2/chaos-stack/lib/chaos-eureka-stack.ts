import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as asg from '@aws-cdk/aws-autoscaling';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';

interface ChaosEurekaStackProps extends cdk.StackProps {
  vpc: ec2.Vpc,
  appSecurityGroup: ec2.SecurityGroup,
  chaosBucket: s3.Bucket,
}

export class ChaosEurekaStack extends cdk.Stack {
  public readonly eurekaAlbDnsName: String;
  public readonly eurekaAsg: asg.AutoScalingGroup;

  constructor(scope: cdk.Construct, id: string, props: ChaosEurekaStackProps) {
    super(scope, id, props);
    const vpc = props.vpc;

    const ec2Role = new iam.Role(this, "ec2Role", {
          assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
          managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
            iam.ManagedPolicy.fromAwsManagedPolicyName('AWSXRayDaemonWriteAccess'),
            iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchAgentServerPolicy')
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


    this.eurekaAsg = new asg.AutoScalingGroup(this, 'eurekaAsg', {
      vpc,
      role: ec2Role,
      instanceType: instanceType,
      machineImage: amznLinux,
      vpcSubnets: vpc.selectSubnets( {subnetType: ec2.SubnetType.PRIVATE} ),
      securityGroup: props.appSecurityGroup,
      minCapacity: 1,
      maxCapacity: 1,
      desiredCapacity: 1,
      instanceMonitoring: asg.Monitoring.DETAILED,
      userData: ec2.UserData.custom(`
        #!/bin/bash
        yum update -y
        yum install -y https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm && systemctl enable amazon-ssm-agent && systemctl start amazon-ssm-agent
        yum install java-11-amazon-corretto -y
        yum install amazon-cloudwatch-agent -y && amazon-cloudwatch-agent-ctl -a start
        yum install -y https://s3.us-east-2.amazonaws.com/aws-xray-assets.us-east-2/xray-daemon/aws-xray-daemon-3.x.rpm
        mkdir -p /root/xray/ && cd /root/xray && wget https://github.com/aws/aws-xray-java-agent/releases/latest/download/xray-agent.zip && unzip xray-agent.zip
        mkdir -p /root/log & mkdir -p /root/eureka && cd /root/eureka
        echo 'aws s3 cp s3://${props.chaosBucket.bucketName}/eureka.jar ./eureka.jar' >> start.sh
        #echo 'java -jar -javaagent:/root/xray/disco/disco-java-agent.jar=pluginPath=/root/xray/disco/disco-plugins -Dcom.amazonaws.xray.strategy.tracingName=eureka -Dspring.profiles.active=aws -Dlogging.file.path=/root/log eureka.jar &' >> start.sh
        echo 'java -jar -Dspring.profiles.active=aws -Dlogging.file.path=/root/log eureka.jar &' >> start.sh
        sh start.sh
      `),
    });

    const eurekaAlb = new elbv2.ApplicationLoadBalancer(this, 'eurekaAlb', {
      vpc,
      securityGroup: props.appSecurityGroup,
      vpcSubnets: vpc.selectSubnets({subnetType:  ec2.SubnetType.PRIVATE} ),
      internetFacing: false
    });

    const eurekaAlbListener = eurekaAlb.addListener('eurekaAlbListener', {
      port: 80,
    });

    eurekaAlbListener.addTargets('eurekaAlbTargets', {
      port: 80,
      targets: [
        this.eurekaAsg
      ]
    });

    this.eurekaAlbDnsName = eurekaAlb.loadBalancerDnsName;
    new cdk.CfnOutput(this, 'eurekaAlbDnsName', { value: eurekaAlb.loadBalancerDnsName });
  }
}
