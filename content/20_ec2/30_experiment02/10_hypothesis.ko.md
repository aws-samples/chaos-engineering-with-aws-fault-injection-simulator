---
title: "가설 수립 및 예상 결과 정의"
chapter: false
weight: 10
---

### 가설 수립
product-composite 서비스는 CPU를 많이 사용하는 워크로드라고 가정하겠습니다. 그래서 CPU 사용량이 증가하면, 안정적인 처리를 위해 AutoScaling을 통해 인스턴스 확장이 일어나야 합니다.

### 예상 결과 정의
데모 애플리케이션은 product-composite 서비스에서 사용하는 EC2 인스턴스의 CPU 사용량이 증가하면 AutoScaling을 통해 3분 안에 가용한 추가 인스턴스가 생성되고, 요청을 처리할 수 있어야 합니다.
