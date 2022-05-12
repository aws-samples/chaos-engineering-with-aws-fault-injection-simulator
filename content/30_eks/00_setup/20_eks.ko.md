---
title: "EKS 클러스터 생성"
chapter: false
weight: 20
---

## 준비사항

이 모듈을 실습하기 위해서는 EKS 클러스터를 생성해야 합니다. 먼저, 클러스터를 생성할 수 있는 권한이 잘 적용되어 있는 지 확인합니다.
`aws sts get-caller-identity` 명령을 이용하여 `ChaosEngineeringWorkshop-Admin` 역할과 인스턴스 ID가 잘 출력되는 지 점검합니다.
```sh
aws sts get-caller-identity
```

출력은 아래와 비슷할 것입니다:
```sh
{
    "Account": "123456789012",
    "UserId": "AROA1SAMPLEAWSIAMROLE:i-01234567890abcdef",
    "Arn": "arn:aws:sts::123456789012:assumed-role/ChaosEngineeringWorkshop-Admin/i-01234567890abcdef"
}
```

다음, 클러스터를 생성하기 위한 스크립트를 내려받기 합니다. 이 예제에서는 AWS CDK를 사용할 것입니다.
```sh
git clone https://github.com/dns-msa/fisworkshop.git
```

## EKS 클러스터 만들기

내려받은 파일을 이용하여 EKS 클러스터를 생성합니다:
```sh
cd ~/environment/fisworkshop/eks/cdk
bash deploy.sh
```

{{% notice info %}}
EKS 클러스터와 관련된 의존성들을 띄우는 데 약 15분 정도 소요됩니다. :coffee:
{{% /notice %}}

## kubeconfig 저장

쿠버네티스 클러스터를 kubectl로 관리하기 위해서는 `aws eks update-kubeconfig` 명령을 실행해야 합니다. 이 명령은 실습 환경에 kubeconfig 설정 파일을 저장합니다:
```
Outputs:
ClusterConfigCommand43AAE40F = aws eks update-kubeconfig --name <your cluster name will be here> --role-arn <your role arn will be here>
```

AWS CDK의 출력으로 나온 명령을 실습 환경 터미널에 붙여넣기하여 실행합니다. 이 명령은 아래와 비슷한 모양을 하고 있습니다. kubeconfig 파일을 새로 생성하거나 갱신합니다:
```sh
aws eks update-kubeconfig --name <your cluster name will be here> --role-arn <your role arn will be here>
```

## 클러스터 확인

생성한 클러스터의 노드를 확인합니다:
3개의 노드가 보인다면 제대로 성성한 것으로 볼 수 있습니다.
```sh
kubectl get nodes
```

## 축하합니다!

:tada: 당신은 잘 동작하는 EKS 클러스터를 생성하였습니다. 다음 단계로 넘어가기 전, 다음 장의 안내를 따라 EKS 콘솔 자격증명을 갱신합니다.
