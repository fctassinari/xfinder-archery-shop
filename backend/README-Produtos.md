# XFinder Archery Products API

API REST desenvolvida em Java com Quarkus para gerenciar os produtos do e-commerce XFinder Archery.

## Funcionalidades

- ✅ Listagem de todos os produtos
- ✅ Busca de produto por ID
- ✅ Busca de produtos por categoria
- ✅ Listagem de produtos em destaque
- ✅ Documentação automática com OpenAPI/Swagger
- ✅ CORS habilitado para integração com frontend
- ✅ Mock de dados para testes

## Endpoints

### GET /api/products
Retorna todos os produtos disponíveis.

### GET /api/products/{id}
Retorna um produto específico pelo ID.

### GET /api/products/category/{category}
Retorna produtos de uma categoria específica (Arcos, Kits, Flechas, Acessórios, Proteções).

### GET /api/products/featured
Retorna produtos marcados como novos ou em destaque.

### GET /api/products/health
Health check da API.

## Como executar

### Pré-requisitos
- Java 11 ou superior
- Maven 3.8.2 ou superior

### Executando em modo de desenvolvimento
```bash
./mvnw compile quarkus:dev
```

### Executando em produção
```bash
./mvnw clean package
java -jar target/quarkus-app/quarkus-run.jar
```

## Documentação da API

Após iniciar a aplicação, acesse:
- Swagger UI: http://localhost:8081/swagger-ui
- OpenAPI Spec: http://localhost:8081/swagger

## Estrutura dos Dados

### Produto
```json
{
  "id": "1",
  "name": "Nome do Produto",
  "price": 100.0,
  "image": "/api/images/produto.jpg",
  "description": "Descrição do produto",
  "weight": 0.5,
  "height": 10.0,
  "width": 5.0,
  "length": 15.0,
  "category": "Categoria",
  "rating": 4.5,
  "reviews": 25,
  "originalPrice": 120.0,
  "isNew": true,
  "features": ["Feature 1", "Feature 2"]
}
```

## Configurações

A aplicação roda por padrão na porta 8081. Para alterar, modifique o arquivo `src/main/resources/application.properties`:

```properties
quarkus.http.port=8081
```

## Mock de Dados

A aplicação inclui 6 produtos de exemplo:
1. Arco Recurvo Profissional X-Elite
2. Kit Completo Iniciante Pro
3. Flechas de Carbono X-Precision
4. Mira Profissional X-Sight
5. Estabilizador Carbon Pro
6. Protetor de Braço Elite

## Integração com Frontend

O frontend React pode consumir esta API fazendo requisições para:
```
http://localhost:8081/api/products
```

CORS está habilitado para permitir requisições de qualquer origem durante o desenvolvimento.

