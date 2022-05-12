---
title: "Action Item 도출"
chapter: false
weight: 40
---

### Action Item 도출 및 적용
좀 더 빠른 인스턴스 확장을 위한 방법을 생각해보겠습니다.

아래 파일을 한 번 살펴보겠습니다.
```
~/environment/fisworkshop/ec2/chaos-stack/lib/chaos-product-composite-stack.ts
```
인스턴스가 최초 기동할 때 실행되는 UserData 항목에 아래와 같이 많은 내용들이 담겨 있습니다. 이러한 경우 인스턴스가 초기화되는데 보다 많은 시간이 소요될 수 있습니다.
데모 어플리케이션에서는 이런 상황을 좀 더 강조하기 위해 중간에 **sleep 180** 라는 코드를 통해 좀 더 초기화 과정에서의 지연을 넣었습니다.
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


### 그룹토론

개선 계획과 예상 결과를 작성해보기 (5분 작성 / 10분 발표 토론)