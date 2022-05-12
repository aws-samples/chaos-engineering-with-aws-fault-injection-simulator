---
title: "개선사항 적용 및 검증"
chapter: false
weight: 50
---

### 개선사항 적용

그러면 이제 ChaosProductStack/productAsg 인스턴스에 설정된 credit specification을 변경하겠습니다.

**ChaosProductStack/productAsg** 인스턴스 하나를 선택하고 **Actions** 버튼을 클릭한 후에 **Instance settings > Change credit specification** 버튼을 클릭합니다.
![image](/images/20_ec2/experiment04_11.png)

**Enable unlimited mode**에 있는 체크박스를 선택하고 **Save** 버튼을 클릭합니다.
![image](/images/20_ec2/experiment04_12.png)

나머지 **ChaosProductStack/productAsg** 인스턴스에 대해서도 같은 작업을 반복합니다.

인스턴스의 상세정보를 통하여 변경이 완료되었는지 다시 확인합니다.
![image](/images/20_ec2/experiment04_13.png)

이제 CloudWatch 대시보드를 다시 한번 살펴보겠습니다. Credit 설정 변경만으로 처리량이 늘어나고 응답시간이 줄어든 것을 볼 수 있습니다.
![image](/images/20_ec2/experiment04_14.png)

### 실험 반복을 통한 개선사항 확인
이제 **장애주입** 단계로 돌아가서 다시 실험을 진행합니다.

이제 부하가 50프로 늘어나도 응답시간이 정상상태를 벗어나지 않고, 처리량이 부하에 맞도록 높아진 것을 확인할 수 있습니다.
![image](/images/20_ec2/experiment04_15.png)

알람도 발생하지 않았고, 서비스가 안정적으로 처리되고 있습니다.
![image](/images/20_ec2/experiment04_16.png)

### 포스트모텀 - 실패로부터 배우기

데모 어플리케이션은 간단한 서비스이기 때문에, 담당자의 추측만으로 또는 로그를 조회하는 등의 방식으로 추적이 가능할 수 있습니다.

하지만 서비스가 복잡해지고 서비스가 다른 서비스와의 복잡한 호출관계를 갖게 되면 여기에서 발생하는 병목은 매우 찾기가 어렵습니다.

따라서 지속적으로 어플리케이션의 가시성을 확보하는 것이 필요합니다.

이를 위해 AWS에서는 X-Ray라는 서비스를 제공하고 있으며 이를 통해 어플리케이션의 가시성을 보다 확보할 수 있습니다.