package com.skipio.demo.chaos.fis.composite.product;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;
import org.apache.commons.lang.math.RandomUtils;

@Service
public class ProductService {
    private final RestTemplate restTemplate;

    public ProductService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @CircuitBreaker(name = "product", fallbackMethod = "fallback")
    public ProductComposite.Product getProduct(String productId){
        ProductComposite.Product product = restTemplate.getForObject("http://product/products/"+productId, ProductComposite.Product.class);
        return product;
    }

    private ProductComposite.Product fallback(Exception e){
        ProductComposite.Product product = new ProductComposite.Product();

        product.setProductId("fallback-product-id");
        product.setProductName("fallback-product-name");
        product.setWeight(0);

        sleep(50 + RandomUtils.nextInt(51));

        return product;
    }
    
    private void sleep(long milliseconds){
        try {
            Thread.sleep(milliseconds);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
