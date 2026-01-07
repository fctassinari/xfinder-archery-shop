# Variáveis de Ambiente

Este documento descreve todas as variáveis de ambiente necessárias para configurar a aplicação XFinder Archery.

## URLs Base da Aplicação

### `VITE_APP_BASE_URL`
- **Descrição**: URL base do frontend da aplicação
- **Desenvolvimento**: `http://localhost:8080`
- **Produção**: `https://seudominio.com.br`
- **Usado em**: Redirect URLs, links de imagens em emails

### `VITE_API_BASE_URL`
- **Descrição**: URL base da API backend
- **Desenvolvimento**: `http://localhost:8081`
- **Produção**: `https://api.seudominio.com.br`
- **Usado em**: Requisições para APIs internas

## APIs de Produtos

### `VITE_PRODUCTS_API_URL`
- **Descrição**: Endpoint completo para API de produtos
- **Desenvolvimento**: `http://localhost:8081/api/products`
- **Produção**: `https://api.seudominio.com.br/api/products`

### `VITE_PRODUCTS_IMAGE_URL`
- **Descrição**: URL base para servir imagens de produtos
- **Desenvolvimento**: `http://localhost:8080`
- **Produção**: `https://seudominio.com.br` ou `https://cdn.seudominio.com.br`

## APIs de Negócio

### `VITE_SUPERFRETE_API_URL`
- **Descrição**: Endpoint para cálculo de frete via SuperFrete
- **Desenvolvimento**: `http://localhost:8081/api/superfrete/calculate-freight`
- **Produção**: `https://api.seudominio.com.br/api/superfrete/calculate-freight`

### `VITE_CUSTOMERS_API_URL`
- **Descrição**: Endpoint para gestão de clientes
- **Desenvolvimento**: `http://localhost:8081/api/customers`
- **Produção**: `https://api.seudominio.com.br/api/customers`

### `VITE_ORDERS_API_URL`
- **Descrição**: Endpoint para gestão de pedidos
- **Desenvolvimento**: `http://localhost:8081/api/orders`
- **Produção**: `https://api.seudominio.com.br/api/orders`

### `VITE_MAIL_API_URL`
- **Descrição**: Endpoint para envio de emails
- **Desenvolvimento**: `http://localhost:8081/api/mail`
- **Produção**: `https://api.seudominio.com.br/api/mail`

## Gateway de Pagamento (InfinitePay)

### `VITE_CHECKOUT_BASE_URL`
- **Descrição**: URL do checkout da InfinitePay
- **Valor**: `https://checkout.infinitepay.io/fctassinari`
- **Nota**: Não alterar - URL fornecida pela InfinitePay

### `VITE_PAYMENT_CHECK_URL`
- **Descrição**: Endpoint para verificação de pagamento
- **Valor**: `https://api.infinitepay.io/invoices/public/checkout/payment_check/fctassinari`
- **Nota**: Não alterar - URL fornecida pela InfinitePay

## Supabase (Caso seja utilizado)

### `VITE_SUPABASE_URL`
- **Descrição**: URL do projeto Supabase
- **Exemplo**: `https://eerwibydxuihmlgranok.supabase.co`


## Exemplo de Arquivo .env para Produção

```env
# URLs Base da Aplicação
VITE_APP_BASE_URL="https://seudominio.com.br"
VITE_API_BASE_URL="https://api.seudominio.com.br"

# URLs das APIs
VITE_PRODUCTS_API_URL="https://api.seudominio.com.br/api/products"
VITE_PRODUCTS_IMAGE_URL="https://cdn.seudominio.com.br"
VITE_SUPERFRETE_API_URL="https://api.seudominio.com.br/api/superfrete/calculate-freight"
VITE_CUSTOMERS_API_URL="https://api.seudominio.com.br/api/customers"
VITE_ORDERS_API_URL="https://api.seudominio.com.br/api/orders"
VITE_MAIL_API_URL="https://api.seudominio.com.br/api/mail"

# Gateway de Pagamento (NÃO ALTERAR)
VITE_CHECKOUT_BASE_URL="https://checkout.infinitepay.io/fctassinari"
VITE_PAYMENT_CHECK_URL="https://api.infinitepay.io/invoices/public/checkout/payment_check/fctassinari"

```

## Notas Importantes

1. **Variáveis VITE_**: Todas as variáveis de ambiente no Vite devem começar com `VITE_` para serem expostas ao código do cliente.

2. **Build Time**: As variáveis de ambiente são injetadas no build time, não no runtime. Se mudar o `.env`, é necessário rebuild.

3. **Segurança**: Nunca exponha chaves secretas ou tokens de API privados através de variáveis `VITE_`. Use apenas para configurações públicas ou URLs.

4. **Docker**: Para ambientes Docker, estas variáveis podem ser passadas através de:
   - Arquivo `.env` no build
   - Environment variables do Docker Compose
   - Secrets do Kubernetes/Docker Swarm

5. **CI/CD**: Configure estas variáveis no seu pipeline de CI/CD (GitHub Actions, GitLab CI, etc).

## Testando Configuração

Para verificar se as variáveis estão configuradas corretamente:

```bash
# Verificar arquivo .env
cat .env

# Build da aplicação
npm run build

# Verificar se as variáveis foram injetadas
grep -r "VITE_APP_BASE_URL" dist/
```
