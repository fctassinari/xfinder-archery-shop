```
-- Script de criação da tabela de clientes

-- Remove a tabela se existir (cuidado em produção!)
DROP TABLE IF EXISTS customers CASCADE;

-- Cria a tabela com id auto-incremento
CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    cep VARCHAR(9) NOT NULL,
    address VARCHAR(300) NOT NULL,
    number VARCHAR(20) NOT NULL,
    complement VARCHAR(100),
    neighborhood VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT true
);

-- Índices para melhorar performance
CREATE INDEX idx_customers_email ON customers(email) WHERE active = true;
CREATE INDEX idx_customers_cpf ON customers(cpf) WHERE active = true;
CREATE INDEX idx_customers_city ON customers(city) WHERE active = true;
CREATE INDEX idx_customers_state ON customers(state) WHERE active = true;
CREATE INDEX idx_customers_created_at ON customers(created_at DESC);

-- Comentários nas colunas
COMMENT ON TABLE customers IS 'Tabela de clientes do e-commerce';
COMMENT ON COLUMN customers.id IS 'ID único do cliente (auto-increment)';
COMMENT ON COLUMN customers.name IS 'Nome completo do cliente';
COMMENT ON COLUMN customers.email IS 'E-mail único do cliente';
COMMENT ON COLUMN customers.phone IS 'Telefone do cliente (somente números)';
COMMENT ON COLUMN customers.cpf IS 'CPF do cliente (somente números)';
COMMENT ON COLUMN customers.cep IS 'CEP do endereço (somente números)';
COMMENT ON COLUMN customers.address IS 'Logradouro (rua, avenida, etc)';
COMMENT ON COLUMN customers.number IS 'Número do endereço';
COMMENT ON COLUMN customers.complement IS 'Complemento do endereço (opcional)';
COMMENT ON COLUMN customers.neighborhood IS 'Bairro';
COMMENT ON COLUMN customers.city IS 'Cidade';
COMMENT ON COLUMN customers.state IS 'Estado (UF - 2 caracteres)';
COMMENT ON COLUMN customers.created_at IS 'Data de cadastro do cliente';
COMMENT ON COLUMN customers.updated_at IS 'Data da última atualização';
COMMENT ON COLUMN customers.active IS 'Indica se o cliente está ativo (soft delete)';

-- Verificar a sequence criada automaticamente
SELECT column_name, column_default, data_type 
FROM information_schema.columns 
WHERE table_name = 'customers' AND column_name = 'id';
```

```
podman exec -it xfinder-postgres psql -U postgres -d xfa
INSERT INTO customers (name, email, phone, cpf, cep, address, number, complement, neighborhood, city, state, created_at, active) 
VALUES ('João Silva Santos', 'joao.silva@email.com', '11987654321', '12345678900', '01310100', 'Avenida Paulista', '1578', 'Apto 101', 'Bela Vista', 'São Paulo', 'SP', CURRENT_TIMESTAMP, true);

-- Verificar dados inseridos
"SELECT 
    id,
    name,
    email,
    phone,
    cpf,
    CONCAT(address, ', ', number, COALESCE(CONCAT(' - ', complement), '')) as full_address,
    neighborhood,
    city,
    state,
    cep,
    created_at,
    active
FROM customers
ORDER BY created_at DESC;"
```