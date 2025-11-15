package com.xfinder.api.orders;

import java.time.LocalDateTime;
import java.util.List;

public class OrderDTO {
    public Long id;
    public Long customerId;
    public Double totalAmount;
    public String freightObservation;
    
    // Campos da InfinitePay
    public String captureMethod;
    public String transactionId;
    public String transactionNsu;
    public String slug;
    public String orderNsu;
    public String receiptUrl;
    public String paymentCheckUrl;
    
    // Campos da validação de pagamento
    public Boolean paymentSuccess;
    public Boolean paymentPaid;
    public Double paymentAmount;
    public Double paymentPaidAmount;
    public Integer paymentInstallments;
    public String paymentCaptureMethod;
    
    public String orderStatus;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
    public LocalDateTime paidAt;
    
    // Campos da SuperFrete (etiqueta)
    public String superfreteOrderId;
    public String trackingCode;
    public String labelUrl;
    public String superfreteService;
    
    public List<OrderItemDTO> items;

    public OrderDTO() {}
}
