package com.xfinder.api.produtos;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product extends PanacheEntity { // Já herda 'id' auto-increment

    @Column(nullable = false)
    public String name;

    @Column
    public Double price;

    @Column(length = 500)
    public String image;

    @Column(columnDefinition = "TEXT")
    public String description;

    @Column
    public Double weight;

    @Column
    public Double height;

    @Column
    public Double width;

    @Column
    public Double length;

    @Column(length = 100)
    public String category;

    @Column
    public Double rating;

    public Integer reviews;

    @Column(name = "original_price")
    public Double originalPrice;

    @Column(name = "is_new")
    public Boolean isNew;

    @Column(name = "in_stock")
    public Boolean inStock;

    public Integer quantity;

    // Relacionamento com features
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    public List<ProductFeature> features = new ArrayList<>();

    // Relacionamento com variantes (como variante)
    @OneToMany(mappedBy = "variantProduct", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    public List<ProductVariant> asVariant = new ArrayList<>();

    // Relacionamento com variantes (como produto pai)
    @OneToMany(mappedBy = "parentProduct", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    public List<ProductVariant> variants = new ArrayList<>();

    // Construtores
    public Product() {}

    // Construtor sem ID - o ID será gerado automaticamente
    public Product(String name, Double price, String image, String description,
                   Double weight, Double height, Double width, Double length,
                   String category, Double rating, Integer reviews, Double originalPrice,
                   Boolean isNew, Boolean inStock, Integer quantity) {
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
        this.inStock = inStock;
        this.quantity = quantity;
    }
}