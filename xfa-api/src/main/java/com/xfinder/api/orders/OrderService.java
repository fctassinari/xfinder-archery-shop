package com.xfinder.api.orders;

import com.xfinder.api.produtos.Product;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
public class OrderService {

    // Listar pedidos com paginação
    public List<OrderDTO> getOrdersPaginated(int page, int limit) {
        int offset = (page - 1) * limit;

        List<Order> orders = Order.find("ORDER BY createdAt DESC")
                .range(offset, offset + limit - 1)
                .list();

        return orders.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Buscar pedido por ID
    public Optional<OrderDTO> getOrderById(Long id) {
        Order order = Order.findById(id);
        if (order == null) {
            return Optional.empty();
        }
        return Optional.of(toDTO(order));
    }

    // Buscar pedidos por cliente
    public List<OrderDTO> getOrdersByCustomer(Long customerId) {
        List<Order> orders = Order.find("customerId = ?1 ORDER BY createdAt DESC", customerId).list();
        return orders.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Buscar pedidos por status
    public List<OrderDTO> getOrdersByStatus(String status) {
        List<Order> orders = Order.find("orderStatus = ?1 ORDER BY createdAt DESC", status.toUpperCase()).list();
        return orders.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Criar pedido
    @Transactional
    public OrderDTO createOrder(OrderDTO orderDTO) {
        Order order = new Order();
        order.customerId = orderDTO.customerId;
        order.totalAmount = orderDTO.totalAmount;
        order.freightObservation = orderDTO.freightObservation;

        // Campos InfinitePay (garantir que não sejam null)
        order.captureMethod = orderDTO.captureMethod;
        order.transactionId = orderDTO.transactionId;
        order.transactionNsu = orderDTO.transactionNsu;
        order.slug = orderDTO.slug;
        order.orderNsu = orderDTO.orderNsu;
        order.receiptUrl = orderDTO.receiptUrl;
        order.paymentCheckUrl = orderDTO.paymentCheckUrl;

        // Campos de validação de pagamento (garantir conversão correta)
        order.paymentSuccess = orderDTO.paymentSuccess != null ? orderDTO.paymentSuccess : false;
        order.paymentPaid = orderDTO.paymentPaid != null ? orderDTO.paymentPaid : false;
        order.paymentAmount = orderDTO.paymentAmount;
        order.paymentPaidAmount = orderDTO.paymentPaidAmount;
        order.paymentInstallments = orderDTO.paymentInstallments;
        order.paymentCaptureMethod = orderDTO.paymentCaptureMethod;

        // Se pagamento confirmado, definir status e data
        if (order.paymentPaid != null && order.paymentPaid) {
            order.orderStatus = "PAID";
            order.paidAt = LocalDateTime.now();
        } else {
            order.orderStatus = orderDTO.orderStatus != null ? orderDTO.orderStatus : "PENDING";
        }

        // Campos da SuperFrete (etiqueta)
        order.superfreteOrderId = orderDTO.superfreteOrderId;
        order.trackingCode = orderDTO.trackingCode;
        order.labelUrl = orderDTO.labelUrl;
        order.superfreteService = orderDTO.superfreteService;

        System.out.println("💾 Salvando pedido com dados de pagamento:");
        System.out.println("   - paymentSuccess: " + order.paymentSuccess);
        System.out.println("   - paymentPaid: " + order.paymentPaid);
        System.out.println("   - paymentAmount: " + order.paymentAmount);
        System.out.println("   - paymentPaidAmount: " + order.paymentPaidAmount);
        System.out.println("   - paymentInstallments: " + order.paymentInstallments);
        System.out.println("   - paymentCaptureMethod: " + order.paymentCaptureMethod);
        System.out.println("   - paidAt: " + order.paidAt);

        order.persist();

        // Criar itens do pedido e atualizar estoque
        if (orderDTO.items != null) {
            for (OrderItemDTO itemDTO : orderDTO.items) {
                OrderItem item = new OrderItem(
                        order,
                        itemDTO.productId,
                        itemDTO.productName,
                        itemDTO.productPrice,
                        itemDTO.quantity
                );
                item.persist();
                order.items.add(item);

                // Atualizar estoque do produto
                updateProductStock(itemDTO.productId, itemDTO.quantity);
            }
        }

        return toDTO(order);
    }

    // Atualizar pedido (usado para atualizar dados de pagamento)
    @Transactional
    public OrderDTO updateOrder(Long id, OrderDTO orderDTO) {
        Order order = Order.findById(id);
        if (order == null) {
            throw new NotFoundException("Pedido não encontrado");
        }

        // Atualizar campos se fornecidos
        if (orderDTO.captureMethod != null) order.captureMethod = orderDTO.captureMethod;
        if (orderDTO.transactionId != null) order.transactionId = orderDTO.transactionId;
        if (orderDTO.transactionNsu != null) order.transactionNsu = orderDTO.transactionNsu;
        if (orderDTO.slug != null) order.slug = orderDTO.slug;
        if (orderDTO.orderNsu != null) order.orderNsu = orderDTO.orderNsu;
        if (orderDTO.receiptUrl != null) order.receiptUrl = orderDTO.receiptUrl;
        if (orderDTO.paymentCheckUrl != null) order.paymentCheckUrl = orderDTO.paymentCheckUrl;
        if (orderDTO.freightObservation != null) order.freightObservation = orderDTO.freightObservation;
        if (orderDTO.orderStatus != null) order.orderStatus = orderDTO.orderStatus;

        // Atualizar dados de validação de pagamento
        if (orderDTO.paymentSuccess != null) order.paymentSuccess = orderDTO.paymentSuccess;
        if (orderDTO.paymentPaid != null) {
            order.paymentPaid = orderDTO.paymentPaid;
            // Se o pagamento foi confirmado, atualiza o status e a data
            if (orderDTO.paymentPaid && order.paidAt == null) {
                order.paidAt = LocalDateTime.now();
                order.orderStatus = "PAID";
            }
        }
        if (orderDTO.paymentAmount != null) order.paymentAmount = orderDTO.paymentAmount;
        if (orderDTO.paymentPaidAmount != null) order.paymentPaidAmount = orderDTO.paymentPaidAmount;
        if (orderDTO.paymentInstallments != null) order.paymentInstallments = orderDTO.paymentInstallments;
        if (orderDTO.paymentCaptureMethod != null) order.paymentCaptureMethod = orderDTO.paymentCaptureMethod;

        // Campos da SuperFrete (etiqueta)
        if (orderDTO.superfreteOrderId != null) order.superfreteOrderId = orderDTO.superfreteOrderId;
        if (orderDTO.trackingCode != null) order.trackingCode = orderDTO.trackingCode;
        if (orderDTO.labelUrl != null) order.labelUrl = orderDTO.labelUrl;
        if (orderDTO.superfreteService != null) order.superfreteService = orderDTO.superfreteService;

        return toDTO(order);
    }

    // Atualizar apenas o status do pedido
    @Transactional
    public OrderDTO updateOrderStatus(Long id, String status) {
        Order order = Order.findById(id);
        if (order == null) {
            throw new NotFoundException("Pedido não encontrado");
        }

        order.orderStatus = status.toUpperCase();

        // Se mudou para PAID, registra a data
        if ("PAID".equals(status.toUpperCase()) && order.paidAt == null) {
            order.paidAt = LocalDateTime.now();
        }

        return toDTO(order);
    }

    // Atualizar estoque do produto
    @Transactional
    public void updateProductStock(Long productId, Integer quantity) {
        Product product = Product.findById(productId);
        if (product != null && product.quantity != null) {
            int newQuantity = product.quantity - quantity;
            if (newQuantity < 0) {
                System.out.println("⚠️ AVISO: Estoque do produto " + productId + " ficou negativo!");
            }
            product.quantity = newQuantity;
            product.inStock = newQuantity > 0;
            product.persist();
            System.out.println("✅ Estoque atualizado - Produto: " + productId + " | Quantidade: " + product.quantity);
        }
    }

    // Cancelar pedido (restaura estoque)
    @Transactional
    public OrderDTO cancelOrder(Long id) {
        Order order = Order.findById(id);
        if (order == null) {
            throw new NotFoundException("Pedido não encontrado");
        }

        // Restaurar estoque
        for (OrderItem item : order.items) {
            Product product = Product.findById(item.productId);
            if (product != null && product.quantity != null) {
                product.quantity += item.quantity;
                product.inStock = true;
                product.persist();
                System.out.println("✅ Estoque restaurado - Produto: " + item.productId + " | Quantidade: " + product.quantity);
            }
        }

        order.orderStatus = "CANCELLED";
        return toDTO(order);
    }

    // Deletar pedido
    @Transactional
    public void deleteOrder(Long id) {
        Order order = Order.findById(id);
        if (order == null) {
            throw new NotFoundException("Pedido não encontrado");
        }

        order.delete();
    }

    // Contar pedidos
    public long countOrders() {
        return Order.count();
    }

    public long countOrdersByStatus(String status) {
        return Order.count("orderStatus = ?1", status.toUpperCase());
    }

    // Métodos auxiliares para conversão DTO <-> Entity
    private OrderDTO toDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.id = order.id;
        dto.customerId = order.customerId;
        dto.totalAmount = order.totalAmount;
        dto.freightObservation = order.freightObservation;
        dto.captureMethod = order.captureMethod;
        dto.transactionId = order.transactionId;
        dto.transactionNsu = order.transactionNsu;
        dto.slug = order.slug;
        dto.orderNsu = order.orderNsu;
        dto.receiptUrl = order.receiptUrl;
        dto.paymentCheckUrl = order.paymentCheckUrl;
        dto.paymentSuccess = order.paymentSuccess;
        dto.paymentPaid = order.paymentPaid;
        dto.paymentAmount = order.paymentAmount;
        dto.paymentPaidAmount = order.paymentPaidAmount;
        dto.paymentInstallments = order.paymentInstallments;
        dto.paymentCaptureMethod = order.paymentCaptureMethod;
        dto.orderStatus = order.orderStatus;
        dto.createdAt = order.createdAt;
        dto.updatedAt = order.updatedAt;
        dto.paidAt = order.paidAt;

        // Campos da SuperFrete (etiqueta)
        dto.superfreteOrderId = order.superfreteOrderId;
        dto.trackingCode = order.trackingCode;
        dto.labelUrl = order.labelUrl;
        dto.superfreteService = order.superfreteService;

        // Items
        dto.items = order.items.stream()
                .map(this::itemToDTO)
                .collect(Collectors.toList());

        return dto;
    }

    private OrderItemDTO itemToDTO(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.id = item.id;
        dto.productId = item.productId;
        dto.productName = item.productName;
        dto.productPrice = item.productPrice;
        dto.quantity = item.quantity;
        dto.subtotal = item.subtotal;
        return dto;
    }
}