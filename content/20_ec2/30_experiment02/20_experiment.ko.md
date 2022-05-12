---
title: "장애주입"
chapter: false
weight: 20
---

### 공격대상 서비스 선택 및 장애주입

실험을 위해 product-composite 서비스에서 사용하는 EC2 인스턴스의 CPU에 부하를 발생시킵니다.

먼저 AWS 콘솔에서 FIS Service로 이동하고 좌측 메뉴에서 **Experiment templates** 메뉴를 선택합니다. 미리 생성된 **CPU Attack Template**을 선택하고 Actions에서 **Start experiment** 메뉴를 클릭합니다.
![image](/images/20_ec2/experiment02_01.png)

다음 화면에서 **Start experiment** 버튼을 클릭합니다.
![image](/images/20_ec2/experiment02_02.png)

경고문구를 확인하고 `start` 를 입력하고 **Start experiment** 버튼을 다시 한번 클릭합니다.
![image](/images/20_ec2/experiment02_03.png)

이제 product-composite 서비스에서 사용하는 EC2의 CPU에 대하여 공격이 시작됩니다.
![image](/images/20_ec2/experiment02_04.png)

Details 에 Stop Conditions이 설정된 것을 확인할 수 있습니다.
![image](/images/20_ec2/experiment02_05.png)

이 부분은 정상상태를 정의할 때 봤었던 CloudWatch alarm입니다. 이렇게 stop conditions를 정의함으로써 시스템이 정상상태를 벗어나면 실험이 중단되도록 할 수 있습니다.
이를 통해 보다 안전한 실험을 진행할 수 있습니다.

Actions 탭을 살펴보면 공격은 5분간 지속되며, CPU에 부하를 주입하는 것을 확인할 수 있습니다.
![image](/images/20_ec2/experiment02_06.png)

Targets 탭을 살펴보면 실제 어떤 EC2가 공격대상인지 조건을 확인할 수 있습니다.
![image](/images/20_ec2/experiment02_07.png)
