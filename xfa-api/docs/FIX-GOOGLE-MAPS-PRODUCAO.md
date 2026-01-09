# 🔧 Correção do Google Maps em Produção

## Problemas Identificados

1. **CSP (Content Security Policy)**: O nginx de proxy não está permitindo conexões com `https://maps.googleapis.com`
2. **API Key**: O domínio `https://xfinder-archery.com.br` não está autorizado na API key do Google Maps

## Soluções

### 1. Atualizar CSP no Nginx de Proxy (VM)

O arquivo `xfa-keyckoak/nginx-keycloak-completo.conf` já está atualizado localmente. Você precisa:

1. **Copiar o arquivo para a VM**:
   ```bash
   # Na sua máquina local
   scp xfa-keyckoak/nginx-keycloak-completo.conf usuario@vm:/etc/nginx/sites-available/
   # ou o caminho onde está o arquivo de configuração do nginx na VM
   ```

2. **Na VM, testar a configuração**:
   ```bash
   sudo nginx -t
   ```

3. **Se estiver OK, recarregar o nginx**:
   ```bash
   sudo systemctl reload nginx
   # ou
   sudo nginx -s reload
   ```

### 2. Configurar API Key no Google Cloud Console

1. Acesse: https://console.cloud.google.com/google/maps-apis/credentials

2. Clique na API key: `AIzaSyCqAInDVGGJeFAMPcc8UbwSvXuD2RlV24A`

3. Em **"Restrições de aplicativo"**, selecione **"Restrições de HTTP referrer (sites web)"**

4. Adicione os seguintes domínios (um por linha):
   ```
   https://xfinder-archery.com.br/*
   https://xfinder-archery.com.br
   http://localhost:8080/*
   ```

5. Clique em **"Salvar"**

### 3. Verificar APIs Habilitadas

No Google Cloud Console, vá em **"APIs e serviços" → "Biblioteca"** e verifique se estão habilitadas:

- ✅ **Maps JavaScript API**
- ✅ **Geocoding API**

Se não estiverem, habilite-as.

### 4. Rebuild do Backend (se necessário)

Se você alterou o `application.properties`, precisa rebuild:

```bash
cd xfa-api
./mvnw package -DskipTests=true
podman stop xfinder-api
podman rm xfinder-api
podman build -f src/main/docker/Dockerfile.jvm -t xfinder-api:latest .
podman run -d --tz=America/Sao_Paulo --name xfinder-api --network nt-xfinder -p 8085:8085 xfinder-api:latest
```

### 5. Rebuild do Frontend (se necessário)

Se você alterou o código do frontend:

```bash
cd xfa-web
podman stop xfinder-web
podman rm xfinder-web
podman build -t xfinder-web:latest .
podman run -d --tz=America/Sao_Paulo --name xfinder-web -p 8083:8080 --network nt-xfinder --restart unless-stopped xfinder-web:latest
```

## Verificação

Após aplicar as correções:

1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Acesse: https://xfinder-archery.com.br/contato
3. Verifique o console do navegador (F12) - não deve haver erros de CSP
4. O mapa do Google Maps deve aparecer corretamente

## Troubleshooting

### Se ainda aparecer erro de CSP:

1. Verifique se o nginx foi recarregado: `sudo systemctl status nginx`
2. Verifique os logs do nginx: `sudo tail -f /var/log/nginx/error.log`
3. Verifique se o header CSP está sendo enviado: Use DevTools → Network → Headers → Response Headers

### Se aparecer erro "RefererNotAllowedMapError":

1. Verifique se o domínio está exatamente como `https://xfinder-archery.com.br/*` (com `/*` no final)
2. Aguarde alguns minutos após salvar (pode levar até 5 minutos para propagar)
3. Verifique se não há espaços extras nos domínios configurados

### Se o mapa não carregar:

1. Verifique se a API key está correta no `application.properties`
2. Verifique se as APIs (Maps JavaScript API e Geocoding API) estão habilitadas
3. Verifique se há créditos disponíveis no Google Cloud Console
4. Verifique o console do navegador para erros específicos
