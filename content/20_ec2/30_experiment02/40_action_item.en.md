---
title: "Action Item"
chapter: false
weight: 40
---

### Create and Apply Action Item
Let's find a way for faster instance scaling. 

Let's take a look at the file below. 
```
~/environment/fisworkshop/ec2/chaos-stack/lib/chaos-product-composite-stack.ts
```
The UserData, which is executed when the instance is first launched, contains many contents as follows. In this case, it may take longer for the instance to initialize.
In the demo application, to emphasize this situation a little more, we put a delay in the initialization process through the code called **sleep 180** in the middle. 
```
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
```

### Group Discussion

Write an improvement plan and expected results (Writing for 5 mins / Discussion for 10 mins)
