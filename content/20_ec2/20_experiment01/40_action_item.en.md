---
title: "Action Item"
chapter: false
weight: 40
---

### Create and Apply Action Item

The product-composite service calls the recommendation service synchronously. 
```bash
~/environment/fisworkshop/ec2/product-composite/src/main/java/com/skipio/demo/chaos/fis/composite/product/RecommendationService.java 
```

```java
public List<ProductComposite.Recommendation> getRecommendations(String productId){
    List<ProductComposite.Recommendation> recommendations = restTemplate.exchange("http://recommendation/products/"+productId+"/recommendations", HttpMethod.GET, null, new ParameterizedTypeReference<List<ProductComposite.Recommendation>>() {}).getBody();
    return recommendations;
}
```

And the timeout is set to 3 seconds. 
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

Therefore, even if only one connected service is delayed, the response is delayed in a chain.
This consumes the available threads of product-composite and affects the entire system. 

**A failure in one service propagates to a failure in all services.** 

### Group Discussion

Write an improvement plan and expected results (Writing for 5 mins / Discussion for 10 mins)
