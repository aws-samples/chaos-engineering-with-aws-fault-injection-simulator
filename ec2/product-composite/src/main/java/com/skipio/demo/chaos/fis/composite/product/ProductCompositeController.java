package com.skipio.demo.chaos.fis.composite.product;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProductCompositeController {
    private final ProductCompositeService productCompositeService;

    public ProductCompositeController(ProductCompositeService productCompositeService) {
        this.productCompositeService = productCompositeService;
    }

    @GetMapping("/")
    public String healthCheck(){
        return "healthCheck";
    }

    @GetMapping("/product-composites")
    public List<ProductComposite> getProductComposites(){
        makeStress();
        return productCompositeService.getProductComposites();
    }

    @GetMapping("/product-composites/{productId}")
    public ProductComposite getProductComposites(@PathVariable String productId){
        makeStress();
        return productCompositeService.getProductComposite(productId);
    }
    
    private void makeStress(){
        // for(int i=0; i<5; i++){
            // isPrime( 999331);
            isPrime(104729);
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
