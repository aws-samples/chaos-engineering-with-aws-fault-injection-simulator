---
title: "개선사항 적용 및 검증"
chapter: false
weight: 50
---

### 개선사항 적용
EC2의 초기화 과정에서 많은 시간이 소요되는 것을 개선하기 위해 AutoScaling에서 제공하는 Warm Pool을 적용해 보겠습니다.

먼저 콘솔에서 EC2 서비스로 이동한 뒤 좌측메뉴에서 Auto Scaling Groups를 선택하고 **ChaosProductCompositeStack-productCompositeAsgXXXX** 항목을 클릭합니다.
![image](/images/20_ec2/experiment02_13.png)

**Instance management** 탭을 선택하고 하단의 **Create warm pool** 버튼을 클릭합니다.
![image](/images/20_ec2/experiment02_14.png)

**Minimum warm pool size** `2`를 입력하고 **Create** 버튼을 클릭합니다.
![image](/images/20_ec2/experiment02_15.png)

잠시 기다리면 Warm pool instances 영역에 인스턴스가 추가된 것을 확인할 수 있습니다.
![image](/images/20_ec2/experiment02_16.png)

그리고 Activity 탭으로 넘어가면 새로운 인스턴스가 추가되는 과정을 확인할 수 있습니다.

Warm Pool에 인스턴스가 생성되기까지 대략 5분의 시간이 소요되었습니다.
![image](/images/20_ec2/experiment02_18.png)

이제 콘솔에서 EC2의 서비스로 이동한 뒤 좌측메뉴에서 Instances 를 선택합니다. 아래와 같이 Stopped 상태의 인스턴스가 2개 추가된 것을 볼 수 있습니다.
![image](/images/20_ec2/experiment02_19.png)

Warm Pool은 시간이 많이 걸리는 인스턴스의 초기화 단계를 미리 진행한 후 인스턴스를 Stopped 상태로 관리함으로써 인스턴스의 확장시간을 단축시키고 비용을 최적화 할 수 있습니다.

### 실험 반복을 통한 개선사항 확인
이제 **장애주입** 단계로 돌아가서 다시 실험을 진행합니다.

실험이 진행되고 인스턴스가 확장되면 아래와 같이 Warm Pool에서 실행되는 인스턴스는 확장에 1분 30초 정도 소요되었습니다.
![image](/images/20_ec2/experiment02_20.png)

훨씬 더 빠르게 확장이 일어난 것입니다. 이 부분은 아래 Dynamic scaling policy에 따라 60초의 warm up 시간이 포함되어 있어 실제로는 30초 내에 새로운 인스턴스가 준비된 것입니다.
![image](/images/20_ec2/experiment02_21.png)

### 포스트모텀 - 실패로부터 배우기
카오스 엔지니어링은 무작위적으로 시스템을 파괴하는 행위가 아닙니다.

여러가지 실험을 통해 사전에 대비를 하고 우리가 가진 시스템의 한계를 찾아내고 이를 지속적으로 개선하는 과정입니다.

이를 통하여 장애가 발생하더라도 당황하지 않고 보다 체계적으로 대응할 수 있습니다.