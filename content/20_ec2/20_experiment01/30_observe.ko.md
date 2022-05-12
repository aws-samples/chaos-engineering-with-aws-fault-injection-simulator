---
title: "실제 결과 확인"
chapter: false
weight: 30
---

### 실제 결과 확인

이제 Amazon CloudWatch에 만들어졌던 chaosMonitoringDashboard를 살펴보겠습니다. recommendation 서비스에 네트워크 지연이 발생하자, 이를 호출하는 product-composite 서비스에 지연이 발생하고 API 응답시간에 지연이 발생합니다.
![image](/images/20_ec2/experiment01_08.png)

지연이 계속되자 시스템이 정상상태(p90 1초 이내의 상품정보 API 응답처리시간)를 벗어나서 CloudWatch 알람이 발생하였습니다.
![image](/images/20_ec2/experiment01_09.png)

FIS에 Stop conditions으로 설정된 CloudWatch 알람으로 인해 공격이 중단되었습니다.
![image](/images/20_ec2/experiment01_10.png)

공격의 중단으로 서비스는 다시 정상화 되었습니다.
작은 지연임에도 불구하고 상당히 오랜 시간동안 시스템에 영향을 준 것을 알 수 있습니다.
![image](/images/20_ec2/experiment01_11.png)
