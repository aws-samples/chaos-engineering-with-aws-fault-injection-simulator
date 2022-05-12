---
title: "어플리케이션 배포"
chapter: false
weight: 10
---

## Repository 다운로드 및 환경생성
* Cloud9에서 아래의 명령어를 실행하여 Repository를 다운로드합니다.
```bash
cd ~/environment
git clone https://github.com/dns-msa/fisworkshop.git
```

* Cloud9의 EBS초기 용량은 10G 입니다. 원활한 실습을 위해 아래 스크립트를 호출하여 EBS 용량을 20G로 늘립니다.
```bash
cd ~/environment/fisworkshop/ec2
./chaos-resize-ebs.sh
```

* 이제 아래의 명령어를 실행하여 실습을 위한 환경을 구성합니다.
```bash
cd ~/environment/fisworkshop/ec2
./chaos-00-deploy-all.sh
```
* 실습환경이 생성되기 까지는 대략 30분이상 소요됩니다.