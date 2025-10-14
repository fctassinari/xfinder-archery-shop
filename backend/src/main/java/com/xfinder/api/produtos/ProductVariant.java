package com.xfinder.api.produtos;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "product_variants")
public class ProductVariant extends PanacheEntity { // ID auto-increment

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_product_id", nullable = false)
    public Product parentProduct;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_product_id", nullable = false)
    public Product variantProduct;

    // Construtores
    public ProductVariant() {}

    public ProductVariant(Product parentProduct, Product variantProduct) {
        this.parentProduct = parentProduct;
        this.variantProduct = variantProduct;
    }
}