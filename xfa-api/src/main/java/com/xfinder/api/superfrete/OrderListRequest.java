package com.xfinder.api.superfrete;

import java.util.List;

public class OrderListRequest {
    private List<String> orders;

    // Construtores
    public OrderListRequest() {}

    public OrderListRequest(List<String> orders) {
        this.orders = orders;
    }

    // Getters e Setters
    public List<String> getOrders() {
        return orders;
    }

    public void setOrders(List<String> orders) {
        this.orders = orders;
    }
}