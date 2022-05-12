---
title: "실습 환경 준비"
weight: 1
chapter: true
draft: false
---

# 실습 환경 준비

준비과정을 마치면 실습을 위해 간단하게 구현된 아래의 데모 애플리케이션이 배포됩니다.
![image](/images/20_ec2/architecture.png)

데모 애플리케이션은 크게 4가지의 마이크로서비스로 구성되어 있으며 product-composite, product, review, recommendation은 각자의 독립적인 서비스입니다.

그리고 클라이언트에서 상품정보를 한번에 통합하여 가져오기 위한 API를 제공하는 product-composite 서비스가 구현되어 있고, 이 서비스는 나머지 마이크로서비스로 API를 호출하여 정보를 조회하고 이를 결합하여 클라이언트에 응답으로 보내줍니다.
각 서비스는 모두 spring-boot 기반으로 작성되어 있으며, 서비스 디스커버리를 위해 각 서비스는 유레카와 통신합니다.

데모를 좀 더 사실적으로 보여주기 위해 load-generator에서 일정한 트래픽을 마이크로서비스 환경으로 발생하도록 구성되었습니다.
또한 각 서비스의 메트릭은 Amazon CloudWatch를 통하여 수집됩니다.

{{% notice info %}}
해당 마이크로서비스는 데모용으로 제작되어, 실제 프로덕션 환경에 적합하지 않습니다.
마이크로서비스 기반 클라우드 네이티브 애플리케이션을 설계하기 시작한 경우 AWS에 문의를 주시면 충분한 도움을 드릴 것입니다.
{{% /notice %}}

{{% children showhidden="true" %}}
