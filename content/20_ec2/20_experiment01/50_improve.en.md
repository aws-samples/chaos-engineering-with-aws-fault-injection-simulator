---
title: "Improvement & Verification"
chapter: false
weight: 50
---

### Apply improvement

You can think of simply giving a shorter timeout, but if the delay continues and the request volume is high, it will eventually lead to failure.

So we will apply the circuit breaker pattern. If the failure persists, it opens a circuit and sends a fallback response. For this, we will use [resilience4j](https://resilience4j.readme.io/docs) here.

**Uncomment @CircuitBreaker annotation** in the code below and **save it** so that CircuitBreaker can work.

File location
```bash
~/environment/fisworkshop/ec2/product-composite/src/main/java/com/skipio/demo/chaos/fis/composite/product/RecommendationService.java
```

Before change
```java
// @CircuitBreaker(name = "recommendation", fallbackMethod = "fallback")
public List<ProductComposite.Recommendation> getRecommendations(String productId){
    List<ProductComposite.Recommendation> recommendations = restTemplate.exchange("http://recommendation/products/"+productId+"/recommendations", HttpMethod.GET, null, new ParameterizedTypeReference<List<ProductComposite.Recommendation>>() {}).getBody();
    return recommendations;
}
```

After change
```java
@CircuitBreaker(name = "recommendation", fallbackMethod = "fallback")
public List<ProductComposite.Recommendation> getRecommendations(String productId){
    List<ProductComposite.Recommendation> recommendations = restTemplate.exchange("http://recommendation/products/"+productId+"/recommendations", HttpMethod.GET, null, new ParameterizedTypeReference<List<ProductComposite.Recommendation>>() {}).getBody();
    return recommendations;
}
```

If you look at the code a bit more, you can see that a fallback function is set up that handles when a failure occurs. 
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

**Run the following command in Cloud9 to redeploy the code.** Wait approximately 5 minutes for the deployment to complete. 

The demo application does not have a reliable CI/CD process. Simply download the built code and restart the process on EC2.

{{% notice info %}}
As a result, some errors may appear during deployment. Although we will not cover this scope of the current workshop, you can understand why you need a reliable CI/CD process. 
{{% /notice %}}

```bash
cd ~/environment/fisworkshop/ec2/
./chaos-04-redeploy-recommendation.sh
```

### Check for improvement through experiment iteration
When the deployment is complete, return to the **failure injection** step and start the experiment again.

Now, when the recommendation service encounters a delay, the circuit opens and gives a fallback response so that there is no continuous delay.

![image](/images/20_ec2/experiment01_12.png)
![image](/images/20_ec2/experiment01_13.png)

**During the attack, run the following command in Cloud9 to check the details of the current response.** 

If you look at the details of recommendations, you can see that the response set in the fallback. 

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

There was no alarm aht this time, and the experiment ended normally. 
![image](/images/20_ec2/experiment01_14.png)

When the experiment is over, the circuit closes again, and you can check that the recommendations are normally responded to. 
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

### Postmortem - Learning from Failure 
Continuing to send requests to the service with the failure can delay recovery from failures and, rather, propagate failures. Therefore, in this case, applying the [Circuit Breaker Pattern] (https://docs.aws.amazon.com/en_kr/whitepapers/latest/modern-application-development-on-aws/circuit-breaker.html) and adopting a Fail Fast strategy is a way to improve user experience and isolate failures. 

The resilience4j used in this lab has the disadvantage that it can be applied only to the Java language. At AWS, you can apply the circuit breaker pattern regardless of the language with [AWS App Mesh](https://aws.amazon.com/ko/app-mesh/?aws-app-mesh-blogs.sort-by=item.additionalFields.createdDate&aws-app-mesh-blogs.sort-order=desc&whats-new-cards.sort-by=item.additionalFields.postDateTime&whats-new-cards.sort-order=desc) and can get visibility of your application.

In addition, depending on the business, asynchronous processing or applying the bulkhead pattern are ways to operate the system stably.
