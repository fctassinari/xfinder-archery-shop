# XFinder Archery - Containerização


https://xfinderarchery.com.br/compra?capture_method=pix&transaction_id=4a4b0955-f786-471a-9cd2-348f90bf861f&transaction_nsu=4a4b0955-f786-471a-9cd2-348f90bf861f&slug=6UkxZ23vCb&order_nsu=5c7f02e8-f18b-47ea-aa57-508fbbf5413a&receipt_url=https%3A%2F%2Frecibo.infinitepay.io%2F4a4b0955-f786-471a-9cd2-348f90bf861f
https://checkout.infinitepay.io/fctassinari?items=[{"name":"X-Puller","price":100,"quantity":1}]&redirect_url=https://xfinder-archery.com.br/compra

```
https://xfinderarchery.com.br/compra?
capture_method=pix&
transaction_id=4a4b0955-f786-471a-9cd2-348f90bf861f&
transaction_nsu=4a4b0955-f786-471a-9cd2-348f90bf861f&
slug=6UkxZ23vCb&
order_nsu=5c7f02e8-f18b-47ea-aa57-508fbbf5413a&
receipt_url=https%3A%2F%2Frecibo.infinitepay.io%2F4a4b0955-f786-471a-9cd2-348f90bf861f
```

http://localhost:8080/compra?capture_method=pix&transaction_id=4a4b0955-f786-471a-9cd2-348f90bf861f&transaction_nsu=4a4b0955-f786-471a-9cd2-348f90bf861f&slug=6UkxZ23vCb&order_nsu=5c7f02e8-f18b-47ea-aa57-508fbbf5413a&receipt_url=https%3A%2F%2Frecibo.infinitepay.io%2F4a4b0955-f786-471a-9cd2-348f90bf861f

http://localhost:8080/compra


https://api.infinitepay.io/invoices/public/checkout/payment_check/fctassinari?transaction_nsu=4a4b0955-f786-471a-9cd2-348f90bf861f&external_order_nsu=5c7f02e8-f18b-47ea-aa57-508fbbf5413a&slug=6UkxZ23vCb
const response = await fetch(`https://api.infinitepay.io/invoices/public/checkout/payment_check/fctassinari?transaction_nsu=4a4b0955-f786-471a-9cd2-348f90bf861f&external_order_nsu=5c7f02e8-f18b-47ea-aa57-508fbbf5413a&slug=6UkxZ23vCb`);



## Pré-requisitos
- Podman instalado
- Podman Compose instalado (opcional)

```bash
podman machine start
```


## Opção 1: Build e execução manual

### Passo 1: Build da imagem
```bash
podman build -t xfinder-archery-shop:latest .
```

### Passo 2: Executar o container
```bash
podman stop xfinder-archery-shop
```
```bash
podman rm xfinder-archery-shop
```
```bash
podman run -d --name xfinder-archery-shop -p 8080:8080 --restart unless-stopped xfinder-archery-shop:latest
```

### Passo 3: Acessar o site
Abra o navegador em: http://localhost:8080

## Opção 2: Podman Compose (Recomendado)

### Passo 1: Executar com Podman Compose
```bash
podman-compose up -d
```

### Passo 2: Acessar o site
Abra o navegador em: http://localhost:8080

## Comandos úteis

### Ver logs do container
```bash
podman logs xfinder-archery-shop
```

### Parar o container
```bash
podman stop xfinder-archery-shop
```

### Remover o container
```bash
podman rm xfinder-archery-shop
```

### Rebuild da imagem
```bash
podman-compose down
podman-compose build --no-cache
podman-compose up -d
```

### Verificar status dos containers
```bash
podman ps
```

## Configurações de produção

### Para ambiente de produção, considere:
1. **SSL/TLS**: Configure um proxy reverso (nginx/traefik) com certificados SSL
2. **Monitoramento**: Adicione healthchecks ao container
3. **Logs**: Configure rotação de logs
4. **Backup**: Implemente backup dos logs se necessário

### Exemplo com SSL (nginx proxy):
```yaml
# podman-compose.prod.yml
version: '3.8'
services:
  xfinder-archery:
    build: .
    restart: unless-stopped
    networks:
      - web
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.xfinder.rule=Host(\`seu-dominio.com\`)"
      - "traefik.http.routers.xfinder.tls=true"
      - "traefik.http.routers.xfinder.tls.certresolver=letsencrypt"
```

## Troubleshooting

### Container não inicia
```bash
podman logs xfinder-archery-shop
```

### Problemas de build
```bash
podman build --no-cache -t xfinder-archery:latest .
```

### Limpar cache do Podman
```bash
podman system prune -f
```