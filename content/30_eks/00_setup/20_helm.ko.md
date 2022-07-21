---
title: "Helm 설치"
chapter: false
weight: 20
---

[Helm](https://helm.sh/)은 스스로를 'kubernetes 용 패키지 관리자'라고 설명하며 Kubernetes에 리소스를 배포하는데 사용할 수 있습니다.

애플리케이션을 템플릿 파일(일반적으로 Kubernetes 리소스)을 포함 할 수있는 **chart**로 패키징하고 템플릿을 렌더링 할 때 기본 구성 **values**도 사용합니다. 차트는 재사용 가능하며 특정 환경에 대해 값을 재정의 할 수 있습니다.

{{% notice tip %}}
워크샵에서 Helm v3를 사용하고 있으며, `tiller`는 없습니다. 워크샵 **Cloud9** 환경이 아닌 자체 환경을 사용하고 Helm v2가있는 경우 명령이 정상적으로 작동합니다.
{{% /notice %}}

터미널 명령 프롬프트에서 다음 명령을 입력하여 Helm을 다운로드 합니다. 그런 다음 helm을 추출하고 실행 가능하게 만들고 경로의 위치에 복사하려고 합니다:

```sh
curl -o /tmp/helm.tar.gz -L https://get.helm.sh/helm-v3.6.0-linux-amd64.tar.gz
tar xvfz /tmp/helm.tar.gz -C /tmp
chmod +x /tmp/linux-amd64/helm
sudo mv /tmp/linux-amd64/helm /usr/local/bin/helm
```

**EKS 클러스터**에 `helm` 이 설치됩니다. 명령이 제대로 설치되었는지 테스트하려면 다음 명령을 실행하십시오.

```sh
helm version
```

`helm` 버전 메시지가 표시되어야 합니다.
