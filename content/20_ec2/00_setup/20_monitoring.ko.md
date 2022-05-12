---
title: "모니터링 환경 체크"
chapter: false
weight: 20
---

### CloudWatch
모니터링은 Amazon CloudWatch를 이용합니다. 정상상태를 확인하기 위해 product-composite의 ALB TargetResponseTime 메트릭을 모니터링합니다.

AWS 콘솔에서 CloudWatch 서비스로 이동한 후, Dashboards 메뉴를 선택하고, 실습환경 생성 과정을 통해서 만들어진 chaosMonitoringDashBoard로 들어갑니다.
![image](/images/20_ec2/monitoring_01.png)

Dashboard 에서 product-composite 서비스와 관련된 메트릭 정보를 확인합니다.
![image](/images/20_ec2/monitoring_02.png)

**product-composite/TargetResponse/p90** 메트릭의 경우 0.2~0.4초 내외의 응답시간을 보여주고 있습니다.
![image](/images/20_ec2/monitoring_03.png)
