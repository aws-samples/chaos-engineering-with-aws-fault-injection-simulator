import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from "@aws-cdk/aws-iam";
import * as asg from "@aws-cdk/aws-autoscaling";
import * as s3 from '@aws-cdk/aws-s3';

interface ChaosLoadGeneratorStackProps extends cdk.StackProps {
  productCompositeAlbDnsName: String,
  chaosBucket: s3.Bucket,
}

export class ChaosLoadGeneratorStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ChaosLoadGeneratorStackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'VPC');

    const securityGroup = new ec2.SecurityGroup(this, 'securityGroup', {
      vpc,
      description: '',
      allowAllOutbound: true   // Can be set to false
    });
    //securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(3389), 'Allow RDP from internet');
    //securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH from internet');

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

    const instanceType = ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE);

    //https://github.com/nakabonne/ali
    const loadGeneratorAsg = new asg.AutoScalingGroup(this, 'loadGeneratorAsg', {
      vpc,
      role: ec2Role,
      instanceType: instanceType,
      machineImage: amznLinux,
      vpcSubnets: vpc.selectSubnets({subnetType: ec2.SubnetType.PUBLIC}),
      securityGroup: securityGroup,
      minCapacity: 1,
      maxCapacity: 1,
      desiredCapacity: 1,
      blockDevices: [{
        deviceName: '/dev/xvda',
        volume: asg.BlockDeviceVolume.ebs(30),
      }], 
      instanceMonitoring: asg.Monitoring.DETAILED,
      userData: ec2.UserData.custom(`
        #!/bin/bash
        yum update -y
        yum install -y https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm && systemctl enable amazon-ssm-agent && systemctl start amazon-ssm-agent
        
        # jmeter install
        yum install java-11-amazon-corretto -y
        mkdir -p /root/jmeter && cd /root/jmeter
        wget https://mirror.navercorp.com/apache//jmeter/binaries/apache-jmeter-5.4.1.zip && unzip apache-jmeter-5.4.1.zip
        wget https://jmeter-plugins.org/files/packages/jpgc-functions-2.1.zip && unzip jpgc-functions-2.1.zip
        cp -rf ./lib ./apache-jmeter-5.4.1/ && rm -rf ./lib
        
        echo "export ALB_DNS_NAME=${props.productCompositeAlbDnsName}" > start-jmeter.sh
        echo 'aws s3 cp s3://${props.chaosBucket.bucketName}/jmeter-template.jmx ./jmeter-template.jmx' >> start-jmeter.sh
        echo "JVM_ARGS=\\"-Xms2048m -Xmx2048m\\"" >> start-jmeter.sh
        echo "./apache-jmeter-5.4.1/bin/jmeter -n -t ./jmeter-template.jmx -l jmeter-result.txt &" >> start-jmeter.sh && chmod 744 ./start-jmeter.sh
        ./start-jmeter.sh
        
        # wrk install
        #yum install -y jq gcc lua-devel git
        #cd /root/ && git clone https://github.com/wg/wrk.git && cd wrk && make
        #cp ./wrk /usr/local/bin/
        #echo "wrk -t 128 -c 512 -d 120h http://${props.productCompositeAlbDnsName}/product-composites/product-001 &" > start-wrk.sh && chmod 744 ./start-wrk.sh
        #./start-wrk.sh
        
        # ali install
        #mkdir -p /root/ali && cd /root/ali
        #rpm -ivh https://github.com/nakabonne/ali/releases/download/v0.7.2/ali_0.7.2_linux_amd64.rpm
        #echo "ali -r 2000 -d 0 -t 10s http://${props.productCompositeAlbDnsName}/product-composites/product-001" > start-ali.sh && chmod 744 ./start-ali.sh
        #./start-ali.sh
      `)
    });

    // const windowsImage = ec2.MachineImage.latestWindows(
    //     ec2.WindowsVersion.WINDOWS_SERVER_2019_ENGLISH_FULL_BASE
    // );

    // const jmeterAsg = new asg.AutoScalingGroup(this, 'jmeterAsg', {
    //   vpc,
    //   instanceType: instanceType,
    //   machineImage: windowsImage,
    //   vpcSubnets: vpc.selectSubnets( {subnetType: ec2.SubnetType.PUBLIC} ),
    //   keyName: 'chaos-workshop-keypair',
    //   securityGroup: securityGroup,
    //   role: ec2Role,
    //   userData: ec2.UserData.custom(`
    //   <powershell>
    //   cd ~/Documents
    //   mkdir jmeter
    //   cd jmeter
    //   wget https://mirror.navercorp.com/apache/jmeter/binaries/apache-jmeter-5.4.1.tgz -O jmeter.tgz
    //   tar -zxf jmeter.tgz
    //   cd ~/Documents/jmeter/apache-jmeter-*/bin
    //   cd ~/Documents
    //   mkdir java
    //   cd java
    //   wget https://download.java.net/java/ga/jdk11/openjdk-11_windows-x64_bin.zip -O jdk11.zip
    //   Expand-Archive jdk11.zip -DestinationPath .\
    //   </powershell>
    //   <persist>true</persist>
    //   `
    //   )
    // });
  }
}
