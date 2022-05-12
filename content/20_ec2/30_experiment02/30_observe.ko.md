---
title: "실제 결과 확인"
chapter: false
weight: 30
---

### 실제 결과 확인

이제 Amazon CloudWatch에 만들어졌던 chaosMonitoringDashboard를 살펴보겠습니다. product-composite 서비스에 CPU 부하가 발생하자, product-composite 서비스에 응답시간에 간헐적인 지연이 발생합니다.
![image](/images/20_ec2/experiment02_08.png)

하지만 시스템이 정상상태를 벗어나지는 않았고 CloudWatch 알람은 발생하지 않았습니다.
![image](/images/20_ec2/experiment02_09.png)

FIS 실험도 정상적으로 완료되었습니다.
![image](/images/20_ec2/experiment02_10.png)

그러면 이제 인스턴스가 정상적으로 확장되었는지, 그리고 어느정도의 시간이 걸려서 인스턴스가 확장되었는지 살펴보겠습니다.
콘솔에서 EC2 Service로 이동합니다. 좌측 하단의 **Auto Scaling Groups** 메뉴를 선택합니다.
그리고 목록에서 **ChaosProductCompositeStack-xxxx** 로 되어있는 항목을 선택합니다.
![image](/images/20_ec2/experiment02_11.png)

Activity 탭을 선택하고 하단의 Activity history를 확인합니다.
![image](/images/20_ec2/experiment02_12.png)

인스턴스가 4개까지 확장되는데 대략 5분 정도가 소요된 것을 확인할 수 있습니다.

**이후 원활한 실습을 위해 Desired Capacity를 아래와 같이 다시 2로 변경합니다.**
아래 Auto Scaling groups 설정에서 **Edit** 버튼을 클릭합니다.
![image](/images/20_ec2/experiment02_12_1.png)

팝업에서 **Desired capacity**값을 `2` 로 수정하고 **Update** 버튼을 클릭합니다.
![image](/images/20_ec2/experiment02_12_2.png)