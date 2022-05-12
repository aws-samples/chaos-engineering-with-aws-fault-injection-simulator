package com.skipio.demo.chaos.fis.composite.product;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import org.apache.commons.lang.math.RandomUtils;

@Service
public class ReviewService {
    private final RestTemplate restTemplate;

    public ReviewService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @CircuitBreaker(name = "review", fallbackMethod = "fallback")
    public List<ProductComposite.Review> getReviews(String productId){
        List<ProductComposite.Review> reviews = restTemplate.exchange("http://review/products/"+productId+"/reviews", HttpMethod.GET, null, new ParameterizedTypeReference<List<ProductComposite.Review>>() {}).getBody();
        return reviews;
    }

    public List<ProductComposite.Review> fallback(Exception e){
        List<ProductComposite.Review> reviews = new ArrayList<>();

        ProductComposite.Review review = new ProductComposite.Review();
        review.setAuthor("fallback author");
        review.setContent("fallback content");
        review.setProductId("fallback productId");
        review.setReviewId("fallback reviewId");
        review.setSubject("fallback subject");

        reviews.add(review);
        
        sleep(50 + RandomUtils.nextInt(51));
        
        return reviews;
    }
    
    private void sleep(long milliseconds){
        try {
            Thread.sleep(milliseconds);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
