package com.xfinder.api.orders;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order extends PanacheEntity { // Já herda 'id' auto-increment

    @Column(name = "customer_id", nullable = false)
    public Long customerId;

    @Column(name = "total_amount", nullable = false)
    public Double totalAmount;

    @Column(name = "freight_observation", columnDefinition = "TEXT")
    public String freightObservation;

    // Campos da InfinitePay
    @Column(name = "capture_method", length = 50)
    public String captureMethod;

    @Column(name = "transaction_id", length = 100)
    public String transactionId;

    @Column(name = "transaction_nsu", length = 100)
    public String transactionNsu;

    @Column(name = "slug", length = 100)
    public String slug;

    @Column(name = "order_nsu", length = 100)
    public String orderNsu;

    @Column(name = "receipt_url", length = 500)
    public String receiptUrl;

    @Column(name = "payment_check_url", length = 500)
    public String paymentCheckUrl;

    // Campos da validação de pagamento
    @Column(name = "payment_success")
    public Boolean paymentSuccess;

    @Column(name = "payment_paid")
    public Boolean paymentPaid;

    @Column(name = "payment_amount")
    public Double paymentAmount;

    @Column(name = "payment_paid_amount")
    public Double paymentPaidAmount;

    @Column(name = "payment_installments")
    public Integer paymentInstallments;

    @Column(name = "payment_capture_method", length = 50)
    public String paymentCaptureMethod;

    @Column(name = "order_status", length = 50, nullable = false)
    public String orderStatus = "PENDING"; // PENDING, PAID, CANCELLED, SHIPPED, DELIVERED

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;

    @Column(name = "updated_at")
    public LocalDateTime updatedAt;

    @Column(name = "paid_at")
    public LocalDateTime paidAt;

    // Campos da SuperFrete (etiqueta)
    @Column(name = "superfrete_order_id", length = 100)
    public String superfreteOrderId;

    @Column(name = "tracking_code", length = 100)
    public String trackingCode;

    @Column(name = "label_url", length = 500)
    public String labelUrl;

    @Column(name = "superfrete_service", length = 50)
    public String superfreteService;

    // Relacionamento com itens do pedido
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    public List<OrderItem> items = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.orderStatus == null) {
            this.orderStatus = "PENDING";
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Order() {}

    public Order(Long customerId, Double totalAmount, String freightObservation) {
        this.customerId = customerId;
        this.totalAmount = totalAmount;
        this.freightObservation = freightObservation;
    }
}
