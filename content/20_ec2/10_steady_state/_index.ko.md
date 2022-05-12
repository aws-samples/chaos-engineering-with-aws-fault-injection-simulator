---
title: "정상상태 정의"
weight: 10
chapter: false
draft: false
---

### 정상상태 정의하기

데모로 구축된 마이크로서비스는 쇼핑몰의 상품정보 페이지를 보여주기 위한 API를 제공하고 있습니다. 상품정보 페이지의 조회가 오래 걸릴 경우, 사용자는 사이트를 이탈할 가능성이 높습니다.
또한 간헐적인 오류 발생의 경우도 사용자의 경험에 치명적인 영향을 미치게 됩니다.

따라서 데모 시스템의 정상상태는 아래의 2가지로 정의 합니다.

* **상품정보조회 API 응답처리시간 - p90을 기준으로 1초 이내**
* **상품정보조회 API 응답 에러율 - 0.5 퍼센트 이내**

### CloudWatch에서 정상상태 확인하기

먼저 AWS 콘솔에서 CloudWatch 메뉴로 이동합니다.
![image](/images/20_ec2/steady-state_01.png)

화면에서 **Recent alarms** 내용에 있는 2가지 알람을 확인하고 **View recent alarms dashboard** 링크를 클릭합니다.
![image](/images/20_ec2/steady-state_02.png)

아래의 화면에서 chaosTargetResponseAlaram의 우측 상단의 ... 으로 되어 있는 메뉴에서 `View in metrics` 과 `View in alarms` 링크를 클릭하여 내용을 살펴봅니다.
![image](/images/20_ec2/steady-state_03.png)


상품정보조회 API를 제공하는 product-composite 서비스에 연결된 로드밸런서의 TargetResponseTime의 p90 메트릭을 기준으로 1초가 넘어가면 알람이 발생하도록 되어 있는 것을 알 수 있습니다.
![image](/images/20_ec2/steady-state_05.png)
![image](/images/20_ec2/steady-state_04.png)

다시 recent alarms dashboard 화면으로 넘어와서 아래의 화면에서 chaosErrorRateAlarm의 우측 상단의 ... 으로 되어 있는 메뉴에서 `View in metrics` 과 `View in alarms` 링크를 클릭하여 내용을 살펴봅니다.
![image](/images/20_ec2/steady-state_06.png)

상품정보조회 API를 제공하는 product-composite 서비스에 연결된 로드밸런서의 HTTPCode_ELB_5XX_Count, HTTPCode_ELB_4XX_Count, RequestCount 메트릭을 기준으로 에러율을 계산하고 이를 통해 0.5퍼센트 이상의 에러가 발생하면 알람이 발생하도록 되어 있는 것을 알 수 있습니다.

이렇게 여러 메트릭을 조합해서 새로운 메트릭을 만들고 이를 통해서 모니터링 할 수 있습니다.

![image](/images/20_ec2/steady-state_07.png)
![image](/images/20_ec2/steady-state_08.png)

**여기에서 중요한 것은 단순히 CPU, Memory, 응답속도와 같은 단순한 기계적인 메트릭이 아니라 비즈니스의 목표에 보다 부합하는 정상상태를 확인하고 이를 모니터링 하는 것입니다.**