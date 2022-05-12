package com.skipio.demo.chaos.fis.product;

public class Product {
    private String productId;
    private String productName;
    private int weight;

    public Product(String productId, String productName, int weight) {
        this.productId = productId;
        this.productName = productName;
        this.weight = weight;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }
}
