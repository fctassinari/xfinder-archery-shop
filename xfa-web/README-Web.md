### Executar em container
```bash
  podman build -t xfinder-web:latest .
```
```bash
  podman stop xfinder-web
```
```bash
  podman rm xfinder-web
```
```bash
  podman run -d --name xfinder-web -p 8080:8080 --network nt-xfinder --restart unless-stopped xfinder-web:latest
```
```bash
  podman start xfinder-web
```

- Criar background com listras na cor do alvo
```
  style={{
    backgroundImage: `url(${heroImage}), repeating-linear-gradient(
                              45deg,
                              #FFD700,           /* amarelo */
                              #FFD700 80px,
                              #FF0000 80px,      /* vermelho */
                              #FF0000 160px,
                              #007BFF 160px,     /* azul */
                              #007BFF 240px,
                              #FFFFFF 240px,     /* branco */
                              #FFFFFF 320px,
                              #000000 320px,     /* preto */
                              #000000 400px
                            )`,
    backgroundColor: "#FFFFFF", // #d4af37 = dourado de base
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "contain",
  }}
```



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



lsof -i :8080


netstat -aon | findstr 8080

taskkill /PID 26152 /F


```
{
  "cep": "03311020",
  "products": [
    {
      "name": "X-Nock Adapter - 3 mm",
      "quantity": 1,
      "unitary_value": 75,
      "weight": 0.036,
      "height": 2,
      "width": 0.3,
      "length": 3.6
    }
  ],
  "insurance_value": 75,
  "use_insurance_value": true
}
```


## Comandos úteis

### Ver logs do container
```bash
podman logs xfinder-web
```

### Parar o container
```bash
podman stop xfinder-web
```

### Remover o container
```bash
podman rm xfinder-web
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
podman logs xfinder-web
```

### Problemas de build
```bash
podman build --no-cache -t xfinder-archery:latest .
```

### Limpar cache do Podman
```bash
podman system prune -f
```