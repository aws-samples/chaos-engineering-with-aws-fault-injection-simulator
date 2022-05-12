---
title: "실제 결과 확인"
chapter: false
weight: 30
---

### 실제 결과 확인

이제 Amazon CloudWatch에 만들어졌던 Dashboards를 통해서 모니터링 해보겠습니다. 부하가 늘어나자 product-composite 서비스에 지연이 발생합니다.
![image](/images/20_ec2/experiment04_01.png)

지연이 계속되자 시스템이 정상상태(p90 1초 이내의 상품정보 API 응답처리시간)를 벗어나서 CloudWatch 알람이 발생하였습니다.
![image](/images/20_ec2/experiment04_02.png)

cloud9에서 `~/environment/fisworkshop/ec2/chaos-stack/files/jmeter-template.jmx` 파일을 열어 부하를 주는 Jmeter 스레드의 개수를 원복하겠습니다.

파일에서 `ThreadGroup.num_threads` 의 값을 아래와 같이 1500에서 1000으로 원복합니다.

수정전
```xml
...
        <stringProp name="ThreadGroup.num_threads">1500</stringProp>
        <stringProp name="ThreadGroup.ramp_time">30</stringProp>
        <boolProp name="ThreadGroup.scheduler">false</boolProp>
        <stringProp name="ThreadGroup.duration">300</stringProp>
        <stringProp name="ThreadGroup.delay"></stringProp>
        <boolProp name="ThreadGroup.same_user_on_next_iteration">false</boolProp>
      </ThreadGroup>
...
```

수정후
```xml
...
        <stringProp name="ThreadGroup.num_threads">1000</stringProp>
        <stringProp name="ThreadGroup.ramp_time">30</stringProp>
        <boolProp name="ThreadGroup.scheduler">false</boolProp>
        <stringProp name="ThreadGroup.duration">300</stringProp>
        <stringProp name="ThreadGroup.delay"></stringProp>
        <boolProp name="ThreadGroup.same_user_on_next_iteration">false</boolProp>
      </ThreadGroup>
...
```

그리고 아래의 명령어를 실행하여 변경된 파일을 반영하고 jmeter를 재기동합니다.
```bash
cd ~/environment/fisworkshop/ec2/
./chaos-04-redeploy-load-generator.sh 
```

1,2분 정도 기다리면 부하가 줄어들고 서비스는 다시 정상화 되었습니다.
![image](/images/20_ec2/experiment04_03.png)
