---
title: "장애 주입 실험"
chapter: false
weight: 13
---

# 실험 시작

실행할 첫 번째 시나리오는 자동 확장을 확인하고 조정하는 것입니다. AWS의 Auto-Scaling은 사용하기 쉽지만 트래픽 수요에 따라 인프라를 확장
하는 수단이기 때문에 마스터하기는 어렵습니다.

먼저 [Gremlin](https://app.gremlin.com)으로 돌아가 모든 호스트에 CPU 공격을 구성합니다.

웹 콘솔의 왼쪽 탐색 메뉴 표시 줄에서 **"Attacks"** 를 선택하면 다음에 나오는 **"New Attack"** 버튼을 클릭합니다.

![gremlin-ui-new-attack](/images/30_eks/gremlin-create-new-attack.png)

**"What do you want to attack?"**에서 Services 옆에 있는 **Infrastructure**를 선택한 다음 두 개의 호스트를 선택합니다.

![gremlin-ui-select-hosts](/images/30_eks/gremlin-select-hosts.png)

**"Choose a Gremlin"**에서 **"Resource"** 다음에 **"CPU"**를 선택하여 대상에서 CPU를 사용합니다. 구성의 경우 **Length**를 360 초로 변경
하고 **CPU Capacity** 를 **`80`**로 변경한 다음 드롭 다운에서 **"All Cores"**를 선택합니다.

![gremlin-ui-cpu-attack](/images/30_eks/gremlin-cpu-attack.png)

그런 다음 **"Unleash Gremlin"**을 클릭합니다.

🎉 축하합니다. 첫 번째 공격을 시작했습니다!
다음 페이지에서는 방금 공개한 카오스 엔지니어링 실험을 관찰하는 방법에 대해 설명합니다.
