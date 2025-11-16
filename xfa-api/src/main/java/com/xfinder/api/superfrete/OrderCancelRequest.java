package com.xfinder.api.superfrete;

public class OrderCancelRequest {
    private OrderCancel order;

    // Classe interna para representar o objeto order
    public static class OrderCancel {
        private String id;
        private String description = "Cancelado pelo usuário";

        // Construtores
        public OrderCancel() {}

        public OrderCancel(String id, String description) {
            this.id = id;
            this.description = description;
        }

        // Getters e Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    // Construtores
    public OrderCancelRequest() {}

    public OrderCancelRequest(OrderCancel order) {
        this.order = order;
    }

    public OrderCancelRequest(String orderId, String description) {
        this.order = new OrderCancel(orderId, description);
    }

    // Getters e Setters
    public OrderCancel getOrder() {
        return order;
    }

    public void setOrder(OrderCancel order) {
        this.order = order;
    }
}