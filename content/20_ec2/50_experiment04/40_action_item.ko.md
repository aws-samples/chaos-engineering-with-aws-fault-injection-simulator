---
title: "Action Item 도출"
chapter: false
weight: 40
---

### Action Item 도출 및 적용
원인을 찾아보겠습니다. 아래 CloudWatch 대시보드에서 CPU 사용량을 보면, 부하가 발생해도 각 서비스의 CPU 사용량이 증가하지 않는 것을 볼 수 있습니다.

서비스 어딘가에 병목이 있다고 생각해 볼 수 있습니다.
![image](/images/20_ec2/experiment04_04.png)

각 서비스의 인스턴스 타입을 살펴보겠습니다. 콘솔에서 EC2 서비스로 이동하여 좌측의 Instances 메뉴를 클릭합니다.

loadGenerator를 제외한 나머지 인스턴스는 성능 순간 확장 가능 인스턴스 타입인 t3.micro 입니다.
![image](/images/20_ec2/experiment04_05.png)

성능 순간 확장 가능 인스턴스는 Credit 모드에 따라서 Unlimited와 Standard로 나뉘어집니다.

Standard 모드의 경우 누적된 Credit이 없는 경우, 스로틀링에 걸리게 됩니다. 이러한 인스턴스가 없는지 확인해보겠습니다.


그러면 아래와 같이 **ChaosProductCompositeStack/productCompositeAsg** EC2 인스턴스 하나를 클릭하고, 상세화면을 살펴보겠습니다.
![image](/images/20_ec2/experiment04_06.png)

상세화면의 하단을 살펴보면 **Credit specification** 이라는 부분이 보이고, 아래에 **unlimited**라고 표시되어 있습니다.
![image](/images/20_ec2/experiment04_07.png)

이번에는 **ChaosProductStack/productAsg** EC2 인스턴스 하나를 클릭하고, 상세화면을 살펴보겠습니다.

상세화면의 하단을 살펴보면 **Credit specification** 이라는 부분이 보이고, 아래에 **standard**라고 표시되어 있습니다.
![image](/images/20_ec2/experiment04_08.png)

잔여 크레딧이 있는지 모니터링 탭을 살펴보겠습니다. 아래와 같이 Monitoring 탭을 클릭하고 하단의 **CPU credit usage**, **CPU credit balance** 메트릭을 살펴보겠습니다.

잔여크레딧이 남아있지 않습니다. 이러한 경우 성능 순간 확장 가능 인스턴스는 세대와 타입에 따른 기준에 따라 스로틀링에 걸리게 됩니다.
데모 어플리케이션에서 사용된 t3.micro의 경우 CPU 사용률 10프로에서 스로틀링이 걸리게 됩니다.

![image](/images/20_ec2/experiment04_09.png)
![image](/images/20_ec2/experiment04_10.png)

### 그룹토론

개선 계획과 예상 결과를 작성해보기 (5분 작성 / 10분 발표 토론)