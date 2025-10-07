package com.xfinder.api.produtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Product {

    @JsonProperty("variants")
    private Variant[] variants;

    @JsonProperty("id")
    private String id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("price")
    private Double price;

    @JsonProperty("image")
    private String image;

    @JsonProperty("description")
    private String description;

    @JsonProperty("weight")
    private Double weight;

    @JsonProperty("height")
    private Double height;

    @JsonProperty("width")
    private Double width;

    @JsonProperty("length")
    private Double length;

    @JsonProperty("category")
    private String category;

    @JsonProperty("rating")
    private Double rating;

    @JsonProperty("reviews")
    private Integer reviews;

    @JsonProperty("originalPrice")
    private Double originalPrice;

    @JsonProperty("isNew")
    private Boolean isNew;

    @JsonProperty("inStock")
    private Boolean inStock;

    @JsonProperty("features")
    private String[] features;

    @JsonProperty("qtd")
    private int qtd;

    // Construtor padrão
    public Product() {}

    // Construtor completo
    public Product(String id, String name, Double price, String image, String description,
                   Double weight, Double height, Double width, Double length, String category,
                   Double rating, Integer reviews, Double originalPrice, Boolean isNew, String[] features, boolean inStock, int qtd, Variant[] variants) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.description = description;
        this.weight = weight;
        this.height = height;
        this.width = width;
        this.length = length;
        this.category = category;
        this.rating = rating;
        this.reviews = reviews;
        this.originalPrice = originalPrice;
        this.isNew = isNew;
        this.features = features;
        this.inStock = inStock;
        this.qtd = qtd;
        this.variants = variants;
    }

    // Getters e Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }

    public Double getWidth() { return width; }
    public void setWidth(Double width) { this.width = width; }

    public Double getLength() { return length; }
    public void setLength(Double length) { this.length = length; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviews() { return reviews; }
    public void setReviews(Integer reviews) { this.reviews = reviews; }

    public Double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; }

    public Boolean getIsNew() { return isNew; }
    public void setIsNew(Boolean isNew) { this.isNew = isNew; }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }

    public String[] getFeatures() { return features; }
    public void setFeatures(String[] features) { this.features = features; }

    public int getQtd() {
        return qtd;
    }

    public void setQtd(int qtd) {
        this.qtd = qtd;
    }

    public Variant[] getVariants() { return variants; }
    public void setVariants(Variant[] variants) { this.variants = variants; }
}