package com.skipio.demo.chaos.fis.recommendation;

import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.RandomUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class RecommendationController {
    private Map<String, Map<String, Recommendation>> productRecommendationMap = new HashMap<>();

    @PostConstruct
    private void init(){
        for(int i=1; i<=10; i++){
            String productId = "product-" + StringUtils.leftPad(String.valueOf(i), 3, "0");
            productRecommendationMap.put(productId, generateRecommendationMap(productId));
        }
    }

    private Map<String, Recommendation> generateRecommendationMap(String productId){
        Map<String, Recommendation> recommendationMap = new HashMap<>();
        for(int i=1; i<=4; i++){
            Recommendation recommendation = new Recommendation(productId, "recommendation-" + StringUtils.leftPad(String.valueOf(i), 3, "0"), "author " + RandomStringUtils.randomAlphabetic(5), RandomUtils.nextInt(5), "contents " + RandomStringUtils.randomAlphabetic(5));
            recommendationMap.put(recommendation.getRecommendationId(), recommendation);
        }

        return recommendationMap;
    }

    @GetMapping("/products/{productId}/recommendations")
    public List<Recommendation> getRecommendations(@PathVariable String productId){
        sleep(50 + RandomUtils.nextInt(51));
        makeStress();
        List<Recommendation> recommendations = new ArrayList<>();
        recommendations.addAll(productRecommendationMap.get(productId).values());

        return recommendations;
    }

    @GetMapping("/products/{productId}/recommendations/{recommendationId}")
    public Recommendation getRecommendation(@PathVariable String productId, @PathVariable String recommendationId){
        sleep(50 + RandomUtils.nextInt(51));
        makeStress();
        return productRecommendationMap.get(productId).get(recommendationId);
    }

    private void sleep(long milliseconds){
        try {
            Thread.sleep(milliseconds);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
    
    private void makeStress(){
        // for(int i=0; i<50; i++){
            // isPrime( 999331);
            // isPrime(104729); 
            isPrime(51197);
        // }
    }

    private boolean isPrime(int number){
        if(number <= 1){
            return false;
        }
        if(number == 2){
            return true;
        }

        for(int i=2; i<number; i++){
            if(number % i == 0){
                return false;
            }
        }

        return true;
    }
}
