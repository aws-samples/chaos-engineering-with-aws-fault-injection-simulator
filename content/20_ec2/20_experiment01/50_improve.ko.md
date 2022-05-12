---
title: "개선사항 적용 및 검증"
chapter: false
weight: 50
---

### 개선사항 적용

단순히 좀 더 짧은 타임아웃을 주는 방법도 생각해 볼 수 있으나, 지연이 길어지고 요청량이 많아지면 결국 장애로 이어집니다.

따라서 서킷브레이커 패턴을 적용하여 장애가 지속되면 서킷을 열고 폴백 응답을 보내는 방식으로 개선합니다. 이를 위해 여기에서는 [resilience4j](https://resilience4j.readme.io/docs)를 적용합니다.

CircuitBreaker가 동작할 수 있도록 아래 코드에서 **@CircuitBreaker annotation에 있는 주석을 해제하고 저장합니다.**

파일위치
```bash
~/environment/fisworkshop/ec2/product-composite/src/main/java/com/skipio/demo/chaos/fis/composite/product/RecommendationService.java
```

수정전
```java
// @CircuitBreaker(name = "recommendation", fallbackMethod = "fallback")
public List<ProductComposite.Recommendation> getRecommendations(String productId){
    List<ProductComposite.Recommendation> recommendations = restTemplate.exchange("http://recommendation/products/"+productId+"/recommendations", HttpMethod.GET, null, new ParameterizedTypeReference<List<ProductComposite.Recommendation>>() {}).getBody();
    return recommendations;
}
```

수정후
```java
@CircuitBreaker(name = "recommendation", fallbackMethod = "fallback")
public List<ProductComposite.Recommendation> getRecommendations(String productId){
    List<ProductComposite.Recommendation> recommendations = restTemplate.exchange("http://recommendation/products/"+productId+"/recommendations", HttpMethod.GET, null, new ParameterizedTypeReference<List<ProductComposite.Recommendation>>() {}).getBody();
    return recommendations;
}
```

좀 더 코드를 살펴보면 CircuitBreaker 실패 시 처리되는 fallback 함수가 설정된 것을 볼 수 있습니다.
```java
public List<ProductComposite.Recommendation> fallback(Exception e){
    List<ProductComposite.Recommendation> recommendations = new ArrayList<>();
    ProductComposite.Recommendation recommendation = new ProductComposite.Recommendation();
    recommendation.setAuthor("fallback author");
    recommendation.setContent("fallback comment");
    recommendation.setProductId("fallback productId");
    recommendation.setRate(0);
    recommendation.setRecommendationId("fallback recommendationId");

    recommendations.add(recommendation);
    
    sleep(50 + RandomUtils.nextInt(51));
    
    return recommendations;
}
```

**Cloud9에서 아래의 명령어를 실행하여 코드를 재배포 합니다.**  배포가 완료되기까지 대략 5분 정도 기다립니다.

샘플 어플리케이션에는 안정적인 CI/CD 프로세스가 적용되어 있지는 않습니다. 단순히 빌드된 코드를 가져와서 EC2에서 프로세스를 재기동합니다.

{{% notice info %}}
이에 따라 배포 도중 오류가 나타날 수 있습니다. 현재 워크샵의 범위에서 다루지는 않지만, 왜 안정적인 CI/CD 프로세스가 필요한지 생각해 볼 수 있는 부분입니다.
{{% /notice %}}

```bash
cd ~/environment/fisworkshop/ec2/
./chaos-04-redeploy-recommendation.sh
```

### 실험 반복을 통한 개선사항 확인
배포가 완료되면 **장애주입** 단계로 돌아가서 다시 실험을 진행합니다.

이제 recommendation 서비스에 지속적인 지연이 발생하면, 서킷이 열리고 폴백 응답을 주어 지속적인 지연이 발생하지 않습니다.

![image](/images/20_ec2/experiment01_12.png)
![image](/images/20_ec2/experiment01_13.png)

**공격 중에 Cloud9에서 아래의 명령어를 실행하여 현재의 발생하는 응답의 상세내용을 확인합니다.**

recommendations의 상세내역을 보면 정상적인 응답이 아니라 fallback에 설정한 응답이 나오는 것을 볼 수 있습니다.

```
cd ~/environment/fisworkshop/ec2/
./chaos-05-check-response-product-composite.sh
```

```bash
TeamRole:~/environment/fisworkshop/ec2 (main) $ ./chaos-05-check-response-product-composite.sh
request to http://Chaos-produ-XMHKGLMY5Y8O-882044339.us-east-1.elb.amazonaws.com/product-composites/product-001
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   647    0   647    0     0    110      0 --:--:--  0:00:05 --:--:--   177
{
  "product": {
    "productId": "product-001",
    "productName": "product OeyHH",
    "weight": 10
  },
  "reviews": [
    ...
    {
      "productId": "product-001",
      "reviewId": "review-003",
      "author": "author EEgVR",
      "subject": "subject JFOQl",
      "content": "contents USzZs"
    }
  ],
  "recommendations": [
    {
      "productId": "fallback productId",
      "recommendationId": "fallback recommendationId",
      "author": "fallback author",
      "rate": 0,
      "content": "fallback comment"
    }
  ]
}
```


이번에는 알람이 발생하지 않고, 실험이 정상적으로 종료되었습니다.
![image](/images/20_ec2/experiment01_14.png)

실험이 끝나면 서킷이 다시 닫히고 다시 정상적으로 recommendations의 응답이 출력되는 것을 확인할 수 있습니다.
```
cd ~/environment/fisworkshop/ec2/
./chaos-05-check-response-product-composite.sh
```

```bash
TeamRole:~/environment/fisworkshop/ec2 (main) $ ./chaos-05-check-response-product-composite.sh
request to http://Chaos-produ-XMHKGLMY5Y8O-882044339.us-east-1.elb.amazonaws.com/product-composites/product-001
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1012    0  1012    0     0   2214      0 --:--:-- --:--:-- --:--:--  2214
{
  "product": {
    "productId": "product-001",
    "productName": "product wUMsw",
    "weight": 18
  },
  "reviews": [
    ...
    {
      "productId": "product-001",
      "reviewId": "review-003",
      "author": "author GOLvL",
      "subject": "subject fZxKf",
      "content": "contents ySyxJ"
    }
  ],
  "recommendations": [
    ...
    {
      "productId": "product-001",
      "recommendationId": "recommendation-003",
      "author": "author uvnIW",
      "rate": 3,
      "content": "contents bXKNh"
    },
    {
      "productId": "product-001",
      "recommendationId": "recommendation-004",
      "author": "author kOtrH",
      "rate": 1,
      "content": "contents eXOKj"
    }
  ]
}
```

### 포스트모텀 - 실패로부터 배우기
장애나 지연이 지속될 때 문제가 있는 서비스로 계속 요청을 보내는 것은 장애의 해소를 지연시키고 오히려 확산시킬 수 있습니다. 따라서 이 때에는 [서킷브레이커 패턴](https://docs.aws.amazon.com/ko_kr/whitepapers/latest/modern-application-development-on-aws/circuit-breaker.html)을 적용하여 Fail Fast 전략을 가져가는 것이 사용자 경험을 높이고, 장애를 격리시킬 수 있는 방안입니다.

실습에서 사용한 resilience4j는 Java언어에 한하여만 적용할 수 있다는 단점이 있습니다. AWS에서는 [AWS App Mesh](https://aws.amazon.com/ko/app-mesh/?aws-app-mesh-blogs.sort-by=item.additionalFields.createdDate&aws-app-mesh-blogs.sort-order=desc&whats-new-cards.sort-by=item.additionalFields.postDateTime&whats-new-cards.sort-order=desc) 서비스를 이용하여 사용하는 언어에 관계없이 이러한 서킷 브레이커 패턴을 적용할 수 있고, 애플리케이션의 가시성을 가져갈 수 있습니다.

또한 비즈니스에 따라 비동기 방식의 처리, 그리고 격벽패턴을 적용하는 것도 시스템을 안정적으로 운영할 수 있는 방법입니다.
