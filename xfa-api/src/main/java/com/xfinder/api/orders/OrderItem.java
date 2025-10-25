package com.xfinder.api.orders;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem extends PanacheEntity { // ID auto-increment

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    public Order order;

    @Column(name = "product_id", nullable = false)
    public Long productId;

    @Column(name = "product_name", nullable = false, length = 200)
    public String productName;

    @Column(name = "product_price", nullable = false)
    public Double productPrice;

    @Column(name = "quantity", nullable = false)
    public Integer quantity;

    @Column(name = "subtotal", nullable = false)
    public Double subtotal;

    public OrderItem() {}

    public OrderItem(Order order, Long productId, String productName, Double productPrice, Integer quantity) {
        this.order = order;
        this.productId = productId;
        this.productName = productName;
        this.productPrice = productPrice;
        this.quantity = quantity;
        this.subtotal = productPrice * quantity;
    }
}
