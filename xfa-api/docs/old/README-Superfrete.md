# XFinder Archery Superfrete API

API REST desenvolvida em Java com Quarkus para integração com o serviço Superfrete, permitindo cálculo de frete e emissão de etiquetas para o e-commerce XFinder Archery.

## Funcionalidades

- ✅ Cálculo de frete via API Superfrete
- ✅ Emissão de etiquetas de envio
- ✅ Documentação automática com OpenAPI/Swagger
- ✅ CORS habilitado para integração com frontend
- ✅ Cliente REST reativo para comunicação com Superfrete
- ✅ Configuração flexível via variáveis de ambiente

## Endpoints

### POST /api/superfrete/calculate-freight
Calcula o frete para produtos baseado no CEP de destino.

**Exemplo de requisição:**
```json
{
  "cep": "01310-100",
  "products": [
    {
      "name": "Arco Recurvo",
      "quantity": 1,
      "unitary_value": 70.0,
      "weight": 0.2,
      "height": 15,
      "width": 5,
      "length": 10
    }
  ],
  "insurance_value": 70.0,
  "use_insurance_value": true
}
```

### POST /api/superfrete/create-label
Cria uma etiqueta de envio para o pedido.

**Exemplo de requisição:**
```json
{
  "from": {
    "name": "XFinder Archery",
    "phone": "(11) 99131-8744",
    "email": "contato.xfinder@gmail.com.br",
    "postal_code": "01153000",
    "address": "Rua das Flores, 123",
    "city": "São Paulo",
    "state_abbr": "SP"
  },
  "to": {
    "name": "Cliente",
    "phone": "(11) 88888-8888",
    "email": "cliente@email.com",
    "postal_code": "01310100",
    "address": "Av. Paulista, 456",
    "city": "São Paulo",
    "state_abbr": "SP"
  },
  "service": "1",
  "volume": {
    "height": 15,
    "width": 5,
    "length": 10,
    "weight": 0.2
  }
}
```

### GET /api/superfrete/health
Health check da API.

## Como executar

### Pré-requisitos
- Java 11 ou superior
- Maven 3.8.2 ou superior

### Configuração
Configure as seguintes variáveis de ambiente ou edite o arquivo `application.properties`:

```bash
export SUPERFRETE_API_TOKEN="seu_token_superfrete"
export STORE_POSTAL_CODE="01153000"
export STORE_EMAIL="contato.xfinder@gmail.com.br"
```

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

## Configurações

### Variáveis de Ambiente
- `SUPERFRETE_API_TOKEN`: Token de acesso à API Superfrete
- `STORE_POSTAL_CODE`: CEP de origem da loja (padrão: 01153000)
- `STORE_EMAIL`: Email de contato da loja

### Arquivo application.properties
```properties
# Porta do servidor (padrão: 8081)
quarkus.http.port=8081

# Token da API Superfrete
superfrete.api.token=YOUR_SUPERFRETE_API_TOKEN

# CEP de origem da loja
superfrete.store.postal-code=03167030

# Email de contato
superfrete.store.email=contato.xfinder@gmail.com.br
```

## Integração com Frontend

O frontend React pode consumir esta API fazendo requisições para:
```
http://localhost:8081/api/superfrete/calculate-freight
```

CORS está habilitado para permitir requisições de qualquer origem durante o desenvolvimento.

## Arquitetura

### Componentes Principais

1. **SuperfreteResource**: Controller REST que expõe os endpoints
2. **SuperfreteService**: Lógica de negócio e validações
3. **SuperfreteApiClient**: Cliente REST para comunicação com a API Superfrete
4. **DTOs**: Classes para serialização/deserialização JSON
5. **CorsFilter**: Filtro para habilitar CORS

### Fluxo de Dados

1. Frontend envia requisição para `/api/superfrete/calculate-freight`
2. SuperfreteResource recebe e valida os dados
3. SuperfreteService processa a requisição
4. SuperfreteApiClient faz chamada para API externa do Superfrete
5. Resposta é retornada ao frontend

## Diferenças da Versão Flask

### Melhorias Implementadas

- ✅ **Tipagem forte**: Classes Java com validação em tempo de compilação
- ✅ **Cliente REST reativo**: Melhor performance e tratamento de erros
- ✅ **Configuração flexível**: Suporte a variáveis de ambiente
- ✅ **Documentação automática**: Swagger UI integrado
- ✅ **Startup rápido**: Quarkus oferece inicialização mais rápida
- ✅ **Observabilidade**: Logs estruturados e métricas

### Compatibilidade

A API mantém total compatibilidade com o frontend existente:
- Mesmos endpoints (`/api/superfrete/calculate-freight`, `/api/superfrete/create-label`)
- Mesma estrutura de dados JSON
- Mesmas validações e tratamento de erros

## Deployment

### Docker
```bash
./mvnw clean package
docker build -f src/main/docker/Dockerfile.jvm -t superfrete-api .
docker run -i --rm -p 8081:8081 superfrete-api
```

### Native
```bash
./mvnw package -Pnative
./target/superfrete-api-1.0.0-SNAPSHOT-runner
```

## Monitoramento

### Health Check
```bash
curl http://localhost:8081/api/superfrete/health
```

### Métricas (se habilitadas)
```bash
curl http://localhost:8081/q/metrics
```

## Troubleshooting

### Problemas Comuns

1. **Token inválido**: Verifique se `SUPERFRETE_API_TOKEN` está configurado corretamente
2. **CORS**: Certifique-se de que o filtro CORS está ativo
3. **Conectividade**: Verifique se há acesso à internet para chamadas à API Superfrete

### Logs
```bash
# Habilitar logs debug
export QUARKUS_LOG_CATEGORY_COM_XFINDER_SUPERFRETE_LEVEL=DEBUG
```

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Implemente os testes
4. Faça commit das mudanças
5. Abra um Pull Request

## Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais detalhes.

