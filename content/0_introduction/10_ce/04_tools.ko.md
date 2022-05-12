---
title: "4. 카오스 엔지니어링 도구"
chapter: false
weight: 14
---

## AWS Fault Injection Simulator

[AWS Fault Injection Simulator](https://aws.amazon.com/ko/fis/)는 AWS에서 카오스엔지니어링을 실행하기 위한 완전관리형 서비스로, 이를 통해 애플리케이션의 성능, 관찰 가능성 및 탄력성을 더 쉽게 개선 할 수 있습니다.

AWS Fault Injection Simulator는 다양한 AWS 서비스에서 결함을 주입하는 실험을 설정하고 실행하는 프로세스를 단순화하여 팀이 애플리케이션 동작에 대한 신뢰를 구축할 수 있도록 해줍니다.

AWS Fault Injection Simulator를 통해 팀은 사전에 구축된 템플릿을 사용하여 실험을 신속하게 설정할 수 있습니다. Fault Injection Simulator는 특정 조건이 충족되는 경우 자동으로 롤백하거나 실험을 중지하는 등 팀이 프로덕션에서 실험을 실행하는 데 필요한 제어 및 가드 레일을 제공합니다.

콘솔에서 몇 번의 클릭만으로 팀은 일반적인 분산 시스템 오류가 병렬로 발생하거나 시간이 지남에 따라 순차적으로 발생하는 복잡한 시나리오를 실행하여 숨겨진 약점을 찾는 데 필요한 실제 조건을 만들 수 있습니다.

---

## Gremlin
[Gremlin](https://www.gremlin.com/)은 인터넷을 보다 안정적으로 만들기 위해 구축된 "failure-as-a-service" 플랫폼입니다. 고객에게 영향을 미치고 수익 손실을 일으키기 전에 복잡한 시스템에서 안전하게 실험할 수 있는 완전 호스팅 솔루션을 제공하여 엔지니어가 취약점을 식별하고 장애를 복원력으로 바꿉니다.

[AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-tosyg6v5cyney)에서 Gremlin을 사용할 수 있습니다.

다운타임은 비용이 많이 들고 고객의 신뢰를 손상시키며 직원의 피로를 유발합니다. Gremlin을 사용하면 애플리케이션에 대한 압력 테스트를 통해 약점을 찾고 전체 시스템을 더 잘 이해할 수 있습니다.

Gremlin을 사용하면 12가지 공격 모드 또는 "Gremlin"을 사용하여 AWS에서 호스트, 컨테이너, 기능 또는 Kubernetes 기본 요소에 대해 Chaos Engineering 실험을 실행할 수 있습니다. 네트워크, 리소스, 운영 체제 및 애플리케이션에서 스택의 모든 계층을 테스트합니다. 인프라의 작은 부분을 정확하게 타겟팅하거나 계층 트래픽을 요청하여 애플리케이션이 어떻게 반응하는지 확인한 다음 폭발 반경 및 규모를 확장하여 시스템의 안정성에 대한 확신을 얻으십시오.

GameDays를 수행하거나 파이프라인에 Gremlin을 추가하여 모든 빌드의 복원력을 높이십시오. Gremlin을 사용하면 사고를 줄이고, 해결 시간을 단축하고, 코드를 더 빠르게 제공하고, 자신 있게 새 애플리케이션을 시작할 수 있습니다.

---

## Litumus
[Litumus](https://litmuschaos.io/)는 클라우드 네이티브 카오스(Chaos) 엔지니어링을 수행하기 위한 도구 세트입니다. 리트머스는 쿠버네티스에서 카오스를 조율하는 도구를 제공하여 SRE가 배포된 환경에서 약점을 찾을 수 있도록 지원합니다. SRE는 리트머스를 사용하여 초기에 스테이징 환경에서 카오스 실험을 실행하고 결국에는 프로덕션에서 버그와 취약점을 찾습니다. 약점을 수정하면 시스템의 회복 탄력성이 향상됩니다.

리트머스는 클라우드 네이티브 접근 방식을 사용하여 카오스를 생성, 관리 및 모니터링 합니다. 카오스는 다음의 쿠버네티스 커스텀 리소스 데피니션(CRD)을 사용하여 조정됩니다.

* ChaosEngine: 쿠버네티스 애플리케이션 또는 쿠버네티스 노드를 ChaosExperiment에 연결하는 리소스입니다. ChaosEngine은 리트머스의 카오스-오퍼레이터(Chaos-Operator)가 감시하고 카오스-실험(Chaos-Experiments)을 호출합니다.
* ChaosExperiment: 카오스 실험의 구성 파라미터를 그룹화하는 리소스입니다. ChaosExperiment CR은 ChaosEngine에서 실험을 호출할 때 오퍼레이터가 생성합니다.
* ChaosResult: 카오스 실험의 결과를 보관할 리소스입니다. 카오스-익스포터(Chaos-exporter)는 결과를 읽고 구성된 프로메테우스(Prometheus) 서버로 메트릭을 내보냅니다.

카오스 실험은 [hub.litmuschaos.io](https://hub.litmuschaos.io)에서 호스팅합니다. 이를 통해 사용자가 프로덕션 애플리케이션의 회복 탄력성을 높일 수 있도록 애플리케이션 개발자 또는 공급 업체가 카오스 실험을 공유하는 중앙 허브입니다.

[Litumus github](https://github.com/litmuschaos/litmus)
