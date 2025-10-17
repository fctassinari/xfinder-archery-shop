package com.xfinder.api.produtos;

import java.util.List;

public class ProductDTO {
    public Long id; // Agora é Long para compatibilidade com auto-increment
    public String name;
    public Double price;
    public String image;
    public String description;
    public Double weight;
    public Double height;
    public Double width;
    public Double length;
    public String category;
    public Double rating;
    public Integer reviews;
    public Double originalPrice;
    public Boolean isNew;
    public Boolean inStock;
    public Integer quantity;
    public List<String> features;
    public List<ProductVariantDTO> variants;

    public ProductDTO() {}
}