---
title: "2. 정상 상태 정의"
chapter: false
weight: 12
---

## 정상 상태 정의

실패 상황을 주입하는 실험을 시작하기 전에, 모니터링 지표를 확인하고 이해해야 합니다. 시스템이 제대로 잘 동작하는 상태를 나타내는 수치를 정해야 합니다. 여기서 정의한 지표가 가리키는 값의 범위를 *정상 상태* 라고 말합니다. 현재 시스템이 그 정상 수치를 나타내고 있는 확인합니다.

계속해서 Sock Shop 애플리케이션을 살펴 보겠습니다.
다음은 어플리케이션이 잘 동작하는 지 확인하기 위하여 시도해 볼 할 몇 가지 행동입니다:

+ 아래 자격 증명을 사용하여 등록하고 로그인하십시오 (보안을 위하여 공유하지 마십시오).
    - **Username:** `user`
    - **Password:** `password`
+ 다양한 아이템보기
+ 장바구니에 항목 추가
+ 장바구니에서 항목 제거
+ 항목 확인

이것은 우리가 실험을 할 때 사용자 경험을 비교하고자 하는 애플리케이션의 안정된 상태입니다.

![sockshop-preview](/images/30_eks/weaveworks-sockshop-frontend.png)

## 가설 수립

이 실험에서는 컴퓨트 노드가 갑자기 종료되는 상황이 발생했을 때, 어플리케이션의 가용성을 점검하고 미세 조정을 할 것입니다. 어플리케이션은 쿠버네티스 클러스터 위에 컨테이너 형태로 배포 되어 있으며, 따라서 만약 노드가 일부 종료되더라도 쿠버네티스 클러스터에서 자동으로 재배포를 할 것이라고 생각합니다. 쿠버네티스는 노드가 종료되면 자동으로 정상 상태 노드로 포드(Pod)를 재설정 해줍니다.

우리는 카오스 엔지니어링을 수행할 때 과학적인 방법을 따른다고 말했습니다. 여러 분의 실험 가설을 수립할 때 아래와 같은 실험 차트의 도움을 받아 실험을 설계할 수 있습니다. 약 5분 동안 여러 분이 생각하는 실험 계획을 작성해 보세요.

**Steady State Hypothesis Example**

+ Title: Services are all available and healthy
+ Type: What are your assumptions?
   - [ ] No Impact
   - [ ] Degraded Performance
   - [ ] Service Outage
   - [ ] Impproved Performance
+ Probes:
   - Type: CloudWatch Metric
   - Status: `service_number_of_running_pods` is greater than 0
+ Stop condition (Abort condition):
   - Type: CloudWatch Alarm
   - Status: `service_number_of_running_pods` is less than 1
+ Results:
   - What did you see?
+ Conclusions:
   - [ ] Everything is as expected
   - [ ] Detected something
   - [ ] Handleable error has occurred
   - [ ] Need to automate
   - [ ] Need to dig deeper
