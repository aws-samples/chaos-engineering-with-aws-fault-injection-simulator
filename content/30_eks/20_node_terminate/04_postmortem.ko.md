---
title: "4. 포스트모텀 - 실패로부터 배우기"
chapter: false
weight: 14
---

## 그룹 토론

+ 의도한 동작은 어떤 것이었나요?
+ 실제로는 어떤 일이 발생했나요?

그런 다음 마이크로서비스 애플리케이션에 다시 액세스하십시오. 무슨 일이 있어났을까요? 아마도 결함 주입 실험에 의한 노드 종료로 인해 애플리케이션이 중단될 수 있습니다. 애플리케이션의 첫 번째 배포는 고가용성을 고려하지 않았기 때문입니다.

## 개선점 반영

클러스터 오토스케일러(Cluster Autoscaler) 은 다음의 조건을 만족하는 경우 쿠버네티스 클러스터의 크기를 자동으로 조절해주는 도구 입니다:

+ 클러스터에 자원이 부족해서 포드(Pods) 스케쥴링에 실패했을 경우.
+ 사용량이 특정 시간동안 저조했을 때, 노드에서 동작 중인 포드가 다른 노드에서 실행 가능한 경우.

클러스터 오토스케일러는 오토 스케일링 그룹(Auto Scaling groups)과의 연동 기능을 제공합니다. 클러스터 오토스케일러는 오토스케일링 그룹에서 관리하는 인스턴스의 프로세서, 메모리, 그래픽 프로세서를 측정합니다. 보다 자세한 내용은 [여기](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler/cloudprovider/aws)에서 확인할 수 있습니다.

먼저, 클러스터 오토스케일러가 잘 설치되어 있는 지 확인합니다. 만약, 오류 메시지가 보이지 않고 정상적으로 보이는 것 같다면, 여러 분의 클러스터는 스케일링 할 준비가 된 것입니다.
```sh
kubectl -n kube-system logs -l app.kubernetes.io/name=aws-cluster-autoscaler
```

고가용성 확보를 위하여 포드를 증설합니다.
```sh
cd ~/environment/fisworkshop/eks/
kubectl apply -f kubernetes/manifest/sockshop-demo-ha.yaml
```

모드 포드 또는 컨테이너가 준비가 될 때까지 기다립니다:
```sh
kubectl -n sockshop get pods -w
```
`CTRL+C`를 눌러서 빠져 나옵니다.

## 재실험을 통한 가설 검증

AWS FIS 서비스 페이지로 돌아갑니다. 실험 템플릿 목록 중에서 `Terminate EKS nodes`을 선택합니다. 화면 오른 쪽 상단에 있는 **작업** 단추를 누르고 **실험 시작** 을 눌러서 실험을 재시작 합니다. AWS FIS는 EKS 노드를 다시 종료시킬 것입니다. EC2 서비스 페이지로 이동해 보면 종료 중인 EKS 노드들을 볼 수 있습니다. 그리고 EKS 노드가 종료된 다음에는 새 인스턴스가 생성되는 것을 볼 수 있습니다.

```sh
kubectl get nodes -w
```
```sh
NAME                                            STATUS   ROLES    AGE     VERSION
ip-10-1-1-183.ap-northeast-2.compute.internal    Ready    <none>   56m     v1.20.4-eks-6b7464
ip-10-1-1-193.ap-northeast-2.compute.internal    Ready    <none>   4m12s   v1.20.4-eks-6b7464
ip-10-1-17-157.ap-northeast-2.compute.internal   Ready    <none>   55m     v1.20.4-eks-6b7464
ip-10-1-9-211.ap-northeast-2.compute.internal    Ready    <none>   11m     v1.20.4-eks-6b7464
ip-10-1-21-107.ap-northeast-2.compute.internal   Ready    <none>   10m40s   v1.20.4-eks-6b7464
ip-10-1-21-107.ap-northeast-2.compute.internal   NotReady   <none>   10m40s   v1.20.4-eks-6b7464
ip-10-1-21-107.ap-northeast-2.compute.internal   NotReady   <none>   10m40s   v1.20.4-eks-6b7464
```

그러나 첫 번째 실험과 달리 응용 프로그램의 가용성이 높습니다. 어플리케이션 웹사이트로 돌아가서 정상적으로 동작하는 지 확인합니다. 몇 개의 EKS 노드가 종료되었더라도 전체 서비스는 계속 사용할 수 있을 것입니다.

## 정리

카오스 엔지니어링은 무작위적으로 시스템을 파괴하는 행위가 아닙니다. 여러 가지 실험을 통해 사전에 대비를 하고 우리가 가진 시스템의 한계를 찾아내고 이를 지속적으로 개선하는 과정입니다. 이를 통하여 장애가 발생하더라도 당황하지 않고 보다 체계적으로 대응할 수 있으며, 시스템을 지속적으로 자동화하여 효율적이고 안정적으로 운영할 수 있게 됩니다.
