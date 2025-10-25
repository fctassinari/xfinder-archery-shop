Perfeito! Agora criei toda a estrutura completa. Aqui está o resumo:

## ✅ API de Pedidos Criada:

### **Entidades:**
1. **Order.java** - Pedido principal com todos os campos solicitados
2. **OrderItem.java** - Itens do pedido

### **DTOs:**
3. **OrderDTO.java** - DTO do pedido
4. **OrderItemDTO.java** - DTO dos itens

### **Serviço:**
5. **OrderService.java** - Com funcionalidades:
    - ✅ Criar pedido e **atualizar estoque automaticamente**
    - ✅ Atualizar dados de pagamento
    - ✅ Cancelar pedido e **restaurar estoque**
    - ✅ Listar, buscar, filtrar pedidos
    - ✅ Contar pedidos por status

### **API REST:**
6. **OrderResource.java** - Endpoints:
    - `POST /api/orders` - Criar pedido
    - `GET /api/orders` - Listar (paginado)
    - `GET /api/orders/{id}` - Buscar por ID
    - `GET /api/orders/customer/{id}` - Pedidos do cliente
    - `GET /api/orders/status/{status}` - Filtrar por status
    - `PUT /api/orders/{id}` - Atualizar
    - `PUT /api/orders/{id}/status` - Atualizar status
    - `PUT /api/orders/{id}/cancel` - Cancelar e restaurar estoque
    - `DELETE /api/orders/{id}` - Deletar

### **SQL:**
7. **create_orders_tables.sql** - Scripts de criação com índices

### **Frontend Atualizado:**
8. **Compra.tsx** - Função `saveOrder()`:
    - ✅ Busca cliente pelo CPF
    - ✅ Monta payload do pedido
    - ✅ Salva pedido via API
    - ✅ **Estoque é atualizado automaticamente no backend**
    - ✅ Envia e-mail de confirmação

## 🎯 Fluxo Completo:

1. Cliente finaliza compra → Cart.tsx
2. InfinitePay processa pagamento
3. Redireciona para Compra.tsx com parâmetros
4. **Compra.tsx salva pedido via API** 💾
5. **API atualiza estoque automaticamente** 📦
6. Envia e-mail de confirmação 📧
7. Exibe resumo da compra ✅

Está tudo pronto! Execute o script SQL e teste! 🚀

```
-- Script de criação das tabelas de pedidos

-- Remove tabelas se existirem (cuidado em produção!)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- Cria tabela de pedidos
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    freight_observation TEXT,
    
    -- Campos da InfinitePay
    capture_method VARCHAR(50),
    transaction_id VARCHAR(100),
    transaction_nsu VARCHAR(100),
    slug VARCHAR(100),
    order_nsu VARCHAR(100),
    receipt_url VARCHAR(500),
    payment_check_url VARCHAR(500),
    
    -- Campos da validação de pagamento
    payment_success BOOLEAN,
    payment_paid BOOLEAN,
    payment_amount DECIMAL(10, 2),
    payment_paid_amount DECIMAL(10, 2),
    payment_installments INTEGER,
    payment_capture_method VARCHAR(50),
    
    -- Status e datas
    order_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    paid_at TIMESTAMP,
    
    -- Foreign key para customers
    CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Cria tabela de itens do pedido
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    
    -- Foreign keys
    CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Índices para melhorar performance
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_transaction_nsu ON orders(transaction_nsu);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Comentários nas colunas
COMMENT ON TABLE orders IS 'Tabela de pedidos do e-commerce';
COMMENT ON COLUMN orders.id IS 'ID único do pedido (auto-increment)';
COMMENT ON COLUMN orders.customer_id IS 'ID do cliente que fez o pedido';
COMMENT ON COLUMN orders.total_amount IS 'Valor total do pedido (produtos + frete)';
COMMENT ON COLUMN orders.freight_observation IS 'Observações sobre o frete (dados JSON da transportadora)';
COMMENT ON COLUMN orders.order_status IS 'Status do pedido: PENDING, PAID, CANCELLED, SHIPPED, DELIVERED';
COMMENT ON COLUMN orders.payment_check_url IS 'URL gerada para verificação de pagamento';

COMMENT ON TABLE order_items IS 'Itens dos pedidos';
COMMENT ON COLUMN order_items.product_id IS 'ID do produto vendido';
COMMENT ON COLUMN order_items.product_name IS 'Nome do produto no momento da compra';
COMMENT ON COLUMN order_items.product_price IS 'Preço do produto no momento da compra';
COMMENT ON COLUMN order_items.quantity IS 'Quantidade comprada';
COMMENT ON COLUMN order_items.subtotal IS 'Subtotal do item (preço x quantidade)';
```