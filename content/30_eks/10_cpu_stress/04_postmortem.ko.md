---
title: "4. 포스트모텀 - 실패로부터 배우기"
chapter: false
weight: 14
---

# 그룹 토론

+ 의도한 동작은 어떤 것이었나요?
+ 실제로는 어떤 일이 발생했나요?

실험이 진행되는 동안 Container Insights 대시보드로 전환하여 카오스를 관찰합니다. 방금 시작한 실험에서 CPU 사용률이 급증한 것을 확인할 수 있도록 사용자 지정 시간 프레임으로 자유롭게 변경하십시오.

+ 가설이 맞았습니까?
+ CPU가 증가 했습니까?
+ 자동 확장 (Auto-Scaling)이 시작 되었습니까?
+ 자동 확장 정책을 설정한 사람이 있습니까?

# 결과

Container Insights의 **CPU Utilization** 그래프에서 CPU 스파이크가 나타났지만 **Number of Nodes**에 대한 그래프는 증가하지 않았습니다.

![amazon-cloudwatch-container-insights-exp1-results](/images/30_eks/aws-cw-container-insights-exp1-results1.png)

![amazon-cloudwatch-container-insights-exp1-results](/images/30_eks/aws-cw-container-insights-exp1-results2.png)

**Auto-Scaling을 설정하고 확인하는 작업 항목을 만들 것입니다.**

# 개선점 반영

자동 확장(Auto-Scaling)을 설정하여 애플리케이션의 탄력성을 높였습니다. 다음과 같이 보일 것입니다.

![aws-ec2-autoscaling-policies](/images/30_eks/aws-ec2-autoscaling-policies.png)

예상 한대로 작동하는지 확인해 보겠습니다. 이전에 했던 것처럼 다음 단계로 이동하기 전에 가설 및 중단 조건을 적어 두어야 합니다. 필요한 경우 실험 카드를 자유롭게 사용하십시오.

[Gremlin](app.gremlin.com)으로 돌아가서 모든 호스트에 CPU 공격을 구성해 보겠습니다. **"Attacks"**을 클릭하면 왼쪽 탐색 표시 줄에서 **"New Attack"**이 표시됩니다.

**"Attacks"**를 클릭하면 왼쪽 탐색바에서 **"New Attack"**이 표시됩니다.

![gremlin-ui-new-attack](/images/30_eks/gremlin-create-new-attack.png)

**"What do you want to attack?"**에서 **Hosts**를 선택한 다음 세 개의 호스트를 선택합니다.

![gremlin-ui-select-hosts](/images/30_eks/gremlin-select-hosts.png)

**"Choose a Gremlin"**에서 **"Resource"** 다음에 **"CPU"**를 선택하여 대상에서 CPU를 사용합니다. 구성의 경우 **Length**를 360 초로 변경
하고 **CPU Capacity** 를 **`80`**으로 변경하고 드롭 다운에서 **"All Cores"**를 선택합니다.

![gremlin-ui-cpu-attack](/images/30_eks/gremlin-cpu-attack.png)

그런 다음, **"Unleash Gremlin"**을 클릭합니다.

## 관찰

**CloudWatch 및 Container Insights에서 처음으로 CPU 실험을 실행할 때와 다른 결과가 있습니까? 노드 수에 대한 그래프가 증가했습니까?**

## 정리

카오스 엔지니어링은 무작위적으로 시스템을 파괴하는 행위가 아닙니다. 여러 가지 실험을 통해 사전에 대비를 하고 우리가 가진 시스템의 한계를 찾아내고 이를 지속적으로 개선하는 과정입니다. 이를 통하여 장애가 발생하더라도 당황하지 않고 보다 체계적으로 대응할 수 있으며, 시스템을 지속적으로 자동화하여 효율적이고 안정적으로 운영할 수 있게 됩니다.
