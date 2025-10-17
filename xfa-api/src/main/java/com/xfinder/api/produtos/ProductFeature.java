package com.xfinder.api.produtos;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "product_features")
public class ProductFeature extends PanacheEntity { // ID auto-increment

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    public Product product;

    @Column(nullable = false, length = 500)
    public String feature;

    // Construtores
    public ProductFeature() {}

    public ProductFeature(Product product, String feature) {
        this.product = product;
        this.feature = feature;
    }
}