---
title: "실제 결과 확인"
chapter: false
weight: 30
---

### 실제 결과 확인

이제 Amazon CloudWatch에 만들어졌던 chaosMonitoringDashboard를 살펴보겠습니다. review 서비스의 인스턴스에 중단이 발생하여도, 이를 호출하는 product-composite 서비스는 정상적으로 처리되고 있습니다.
![image](/images/20_ec2/experiment03_08.png)

시스템이 정상상태를 벗어나지 않았고 CloudWatch 알람은 발생하지 않았습니다.
![image](/images/20_ec2/experiment03_09.png)

FIS실험도 정상적으로 완료되었습니다.
![image](/images/20_ec2/experiment03_10.png)

... TODO