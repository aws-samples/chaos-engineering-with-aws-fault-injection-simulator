---
title: "장애주입"
chapter: false
weight: 20
---

### 공격대상 서비스 선택 및 장애주입

실험을 위해 cloud9에서 `~/environment/fisworkshop/ec2/chaos-stack/files/jmeter-template.jmx` 파일을 열어 부하를 주는 Jmeter 스레드의 개수를 증가시킵니다.

파일에서 `ThreadGroup.num_threads` 의 값을 아래와 같이 1000에서 1500으로 변경합니다.

수정전
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

수정후
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

그리고 아래의 명령어를 실행하여 변경된 파일을 반영하고 jmeter를 재기동합니다.
```bash
cd ~/environment/fisworkshop/ec2/
./chaos-04-redeploy-load-generator.sh 
```