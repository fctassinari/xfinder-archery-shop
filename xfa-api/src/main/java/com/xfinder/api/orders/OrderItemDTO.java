package com.xfinder.api.orders;

public class OrderItemDTO {
    public Long id;
    public Long productId;
    public String productName;
    public Double productPrice;
    public Integer quantity;
    public Double subtotal;

    public OrderItemDTO() {}
}
