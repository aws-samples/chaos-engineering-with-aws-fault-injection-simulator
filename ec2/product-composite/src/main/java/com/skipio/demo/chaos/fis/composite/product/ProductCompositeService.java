package com.skipio.demo.chaos.fis.composite.product;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductCompositeService {
    private final ProductService productService;
    private ReviewService reviewService;
    private RecommendationService recommendationService;

    public ProductCompositeService(ProductService productService, ReviewService reviewService, RecommendationService recommendationService) {
        this.productService = productService;
        this.reviewService = reviewService;
        this.recommendationService = recommendationService;
    }

    public List<ProductComposite> getProductComposites(){
        return null;
    }

    public ProductComposite getProductComposite(String productId){
        ProductComposite.Product product = productService.getProduct(productId);
        List<ProductComposite.Review> reviews = reviewService.getReviews(productId);
        List<ProductComposite.Recommendation> recommendations = recommendationService.getRecommendations(productId);

        return new ProductComposite(product, reviews, recommendations);
    }
}
