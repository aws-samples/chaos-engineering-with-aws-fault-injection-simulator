---
title: "1. 모니터링 방법 확인"
chapter: false
weight: 11
---

컨테이너 인사이츠([CloudWatch Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html))를 사용하여 마이크로서비스 또는 컨테이너로 구성된 어플리케이션의 지표와 로그를 수집하고 정리해서 분석할 수 있습니다. 컨테이너 인사이츠는 아마존 엘라스틱 컨테이너 서비스(Amazon ECS), 아마존 엘라스틱 쿠버네티스 서비스(Amazon EKS), 그리고 EC2 위에 직접 설치한 쿠버네티스를 지원합니다. 아마존 엘라스틱 컨테이너 서비스에는 파게이트(Fargate) 지원도 포함되어 있습니다.

클라우드 와치(CloudWatch)는 자동으로 CPU, 메모리, 디스크, 네트워크와 같은 자원들의 지표를 수집합니다. 컨테이너 인사이츠 또한 진단 및 분석을 위한 정보들을 제공합니다. 실패에의한 컨테이너 재시작 같은 진단 정보를 제공함으로써 사용자가 빠르게 문제를 분석하고 조치할 수 있도록 돕습니다. 그리고 클라우드 와치 알람을 설정하여 특정 조건에 따른 경보를 발생할 수 있으며, 경보를 수신하여 자동으로 문제를 수습할 수 있도록 자동화할 수 있습니다.

이제 클라우드 와치 서비스 화면으로 이동하여 컨테이너 인사이츠(Container Insights)를 찾습니다. 왼 쪽 내비게이션 바의 아래 쪽에 있습니다. 여러 분의 컨테이너에 대한 대시보드를 새로고침하여 지표가 잘 수집되고 있는 지 확인합니다. 시스템이 일반적인 정상 상태인 지 확인합니다.

![amazon-cloudwatch-container-insights-dashboard](/images/30_eks/aws-cw-container-insights-dashboard.png)

![amazon-cloudwatch-container-insights-mapview](/images/30_eks/aws-cw-container-insights-mapview.png)
