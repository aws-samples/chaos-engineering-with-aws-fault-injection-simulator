---
title: "Action Item 도출"
chapter: false
weight: 40
---

### Action Item 도출 및 적용

product-composite 서비스는 recommendation 서비스를 Sync방식으로 호출하고 있습니다.

```bash
~/environment/fisworkshop/ec2/product-composite/src/main/java/com/skipio/demo/chaos/fis/composite/product/RecommendationService.java 
```

```java
public List<ProductComposite.Recommendation> getRecommendations(String productId){
    List<ProductComposite.Recommendation> recommendations = restTemplate.exchange("http://recommendation/products/"+productId+"/recommendations", HttpMethod.GET, null, new ParameterizedTypeReference<List<ProductComposite.Recommendation>>() {}).getBody();
    return recommendations;
}
```

또한 이때 타임아웃은 3초로 시간이 설정되어 있습니다.

```bash
~/environment/fisworkshop/ec2/product-composite/src/main/java/com/skipio/demo/chaos/fis/composite/product/AppConfig.java
```

```java
@Bean
public CloseableHttpClient defaultHttpClient() {
    PoolingHttpClientConnectionManager connectionManager = new PoolingHttpClientConnectionManager();
    connectionManager.setMaxTotal(2000);
    connectionManager.setDefaultMaxPerRoute(1000);

    RequestConfig requestConfig = RequestConfig
            .custom()
            .setConnectionRequestTimeout(3000) // timeout to get connection from pool
            .setSocketTimeout(3000) // standard connection timeout
            .setConnectTimeout(3000) // standard connection timeout
            .build();
    return org.apache.http.impl.client.HttpClientBuilder.create()
            .setConnectionManager(connectionManager)
            .setDefaultRequestConfig(requestConfig)
            .build();
}
```

따라서 연계된 하나의 서비스만 지연되더라도 연쇄적으로 응답에 지연이 발생하고, 이는 product-composite의 가용 스레드를 소모하여 전체시스템에 영향을 주게 되었습니다. 

**한 서비스의 장애가 전체 서비스의 장애로 전파된 것입니다.**

### 그룹토론

개선 계획과 예상 결과를 작성해보기 (5분 작성 / 10분 발표 토론)