---
title: "kubectl 설치"
chapter: false
weight: 10
---

## 준비사항

쿠버네티스 (kubernetes) 명령줄 도구인 kubectl을 설치합니다. 이 도구를 활용하여 쿠버네티스 클러스터를 관리합니다. 쿠버네티스 어플리케이션을 배포하거나, 컨테이너(container) 내부를 조사하거나 로그(logs)를 확인할 때 이 도구를 활용할 수 있습니다.

터미널에서, 아래 명령을 실행하며 설치합니다:

```sh
curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
```
Cloud9 환경에 kubectl을 설치하였습니다. 제대로 설치 되었는 지 확인하기 위하여 아래 명령을 실행합니다.

```sh
kubectl version --client
```
버전 정보가 제대로 보인다면 성공한 것입니다.