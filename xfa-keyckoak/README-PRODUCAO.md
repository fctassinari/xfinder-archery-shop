# Guia de Configuração do Keycloak em Produção

Este guia descreve como configurar o Keycloak em produção com nginx fazendo proxy reverso e SSL/TLS gerenciado pelo nginx.

## Cenário de Produção

- **Domínio**: `https://xfinder-archery.com.br`
- **Nginx**: Gerencia SSL/TLS com certificado Let's Encrypt
- **Keycloak**: Roda em HTTP internamente (porta 8084), acessível via `https://xfinder-archery.com.br/realms/*`
- **Aplicação Principal**: Roda na porta 8083, acessível via `https://xfinder-archery.com.br/`

## Por que não usar certificado auto-assinado em produção?

Em produção, o nginx já possui um certificado SSL válido (Let's Encrypt) que:
- É reconhecido pelos navegadores (sem avisos de segurança)
- É renovado automaticamente
- Gerencia todo o tráfego HTTPS

O Keycloak não precisa de seu próprio certificado SSL quando está atrás de um proxy reverso. Ele deve:
- Rodar em HTTP (sem SSL)
- Ser configurado para funcionar atrás de um proxy reverso
- Confiar nos headers do proxy para informações de protocolo e host

## Passo 1: Build da Imagem para Produção

Use o `Dockerfile.prod` que não cria certificado auto-assinado:

```bash
cd xfa-keyckoak
podman build -f Dockerfile.prod -t xfinder-keycloak:prod .
```

## Passo 2: Configurar o Banco de Dados

Certifique-se de que o banco de dados `keycloak` existe:

```bash
podman exec -it xfinder-postgres psql -U postgres -c "CREATE DATABASE keycloak WITH OWNER = postgres ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8' LOCALE_PROVIDER = 'libc' TABLESPACE = pg_default CONNECTION LIMIT = -1 IS_TEMPLATE = False;"
```

## Passo 3: Subir o Keycloak em Produção

### Opção A: Usando Podman (recomendado)

```bash
podman run -d \
    --tz=America/Sao_Paulo \
    --name xfinder-keycloak-prod \
    --network nt-xfinder \
    -p 8084:8084 \
    -v "C:/caminho/para/realm-export-prod.json:/opt/keycloak/data/import/realm-export.json:Z" \
    xfinder-keycloak:prod start \
    --optimized \
    --http-enabled=true \
    --proxy=edge \
    --hostname=xfinder-archery.com.br \
    --hostname-strict=false \
    --import-realm
```

**Parâmetros importantes:**
- `--http-enabled=true`: Habilita HTTP (sem SSL)
- `--proxy=edge`: Configura para funcionar atrás de proxy reverso
- `--hostname=xfinder-archery.com.br`: Define o hostname externo
- `--hostname-strict=false`: Permite que o Keycloak aceite requisições do nginx
- `-p 8084:8084`: Expõe apenas a porta HTTP

### Opção B: Usando Docker Compose

Crie um arquivo `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  keycloak:
    image: xfinder-keycloak:prod
    container_name: xfinder-keycloak-prod
    environment:
      - KC_DB=postgres
      - KC_DB_URL=jdbc:postgresql://xfinder-postgres:5432/keycloak
      - KC_DB_USERNAME=postgres
      - KC_DB_PASSWORD=XFA@2025
      - KC_HOSTNAME=xfinder-archery.com.br
      - KC_HOSTNAME_STRICT=false
      - KC_PROXY=edge
      - KC_HTTP_ENABLED=true
      - KC_HTTPS_ENABLED=false
      - KC_BOOTSTRAP_ADMIN_USERNAME=admin
      - KC_BOOTSTRAP_ADMIN_PASSWORD=XFA@2025
    ports:
      - "8084:8084"
    networks:
      - nt-xfinder
    command: start --optimized --http-enabled=true --proxy=edge --hostname=xfinder-archery.com.br --hostname-strict=false
    volumes:
      - ./realm-export-prod.json:/opt/keycloak/data/import/realm-export.json:Z
    restart: unless-stopped
```

Execute:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Passo 4: Configurar o Nginx

### Opção A: Adicionar ao arquivo existente

Edite o arquivo de configuração do nginx (geralmente em `/etc/nginx/sites-available/xfinder-archery.com.br` ou similar) e adicione as locations do arquivo `nginx-keycloak.conf` dentro do bloco `server` que já tem SSL configurado.

### Opção B: Usar configuração completa

Substitua o conteúdo do arquivo de configuração do nginx pelo conteúdo do arquivo `nginx-keycloak-completo.conf`.

**Importante**: Ajuste o upstream do Keycloak conforme necessário:
- Se o Keycloak estiver no mesmo servidor: `server localhost:8084;`
- Se estiver em outro servidor: `server vpsking15907.publiccloud.com.br:8084;`

### Validar e recarregar o nginx

```bash
# Validar configuração
sudo nginx -t

# Recarregar nginx
sudo systemctl reload nginx
# ou
sudo nginx -s reload
```

## Passo 5: Configurar o Realm no Keycloak

Após o Keycloak estar rodando, acesse o Admin Console:

1. **URL**: `https://xfinder-archery.com.br/admin` (ou `https://xfinder-archery.com.br`)
2. **Usuário**: `admin`
3. **Senha**: `XFA@2025`

### Atualizar URLs do Client

1. Vá para **Clients** → `xfinder-web` → aba **Settings**
2. Atualize as seguintes URLs:
   - **Root URL**: `https://xfinder-archery.com.br`
   - **Home URL**: `https://xfinder-archery.com.br`
   - **Valid redirect URIs**:
     ```
     https://xfinder-archery.com.br/*
     ```
   - **Valid post logout redirect URIs**:
     ```
     https://xfinder-archery.com.br/*
     ```
   - **Web origins**:
     ```
     https://xfinder-archery.com.br
     ```
3. Clique em **Save**

### Atualizar Realm Settings

1. Vá para **Realm settings** → aba **General**
2. Verifique se o **Frontend URL** está correto (pode deixar vazio para usar o padrão)
3. Na aba **Login**, verifique as configurações de SSO

## Passo 6: Atualizar Configurações da Aplicação

### Frontend (xfa-web)

Atualize o arquivo de configuração do Keycloak:

```typescript
// xfa-web/src/config/keycloak.ts
export const keycloakConfig = {
  url: 'https://xfinder-archery.com.br',
  realm: 'xfinder',
  clientId: 'xfinder-web',
  // ...
};
```

### Backend (xfa-api)

Atualize o `application.properties`:

```properties
# URL do Keycloak em produção
quarkus.oidc.auth-server-url=https://xfinder-archery.com.br/realms/xfinder
```

## Verificação

### Testar acesso ao Keycloak

1. **Admin Console**: `https://xfinder-archery.com.br/admin`
2. **Realm endpoint**: `https://xfinder-archery.com.br/realms/xfinder`
3. **OpenID Connect Discovery**: `https://xfinder-archery.com.br/realms/xfinder/.well-known/openid-configuration`

### Verificar logs

```bash
# Logs do Keycloak
podman logs -f xfinder-keycloak-prod

# Logs do nginx
sudo tail -f /var/log/nginx/access-xfinder.log
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Erro: "Invalid redirect URI"

- Verifique se as URLs no client do Keycloak estão corretas
- Certifique-se de usar `https://` (não `http://`)
- Verifique se o path está correto: `/realms/xfinder/...`

### Erro: "CORS"

- Verifique se `https://xfinder-archery.com.br` está em **Web origins** no client
- Verifique os headers do nginx (X-Forwarded-*)

### Keycloak não inicia

- Verifique os logs: `podman logs xfinder-keycloak-prod`
- Verifique se o banco de dados está acessível
- Verifique se a porta 8084 está disponível

### Nginx retorna 502 Bad Gateway

- Verifique se o Keycloak está rodando: `podman ps`
- Verifique se a porta está correta no upstream do nginx
- Verifique os logs do nginx: `sudo tail -f /var/log/nginx/error.log`

### Certificado SSL inválido no navegador

- Isso não deve acontecer, pois o nginx gerencia o SSL
- Se acontecer, verifique se o certificado Let's Encrypt está válido
- Verifique se o nginx está usando o certificado correto

## Diferenças entre Desenvolvimento e Produção

| Aspecto | Desenvolvimento | Produção |
|---------|----------------|----------|
| **Protocolo** | HTTPS (porta 8443) | HTTP (porta 8084) |
| **Certificado** | Auto-assinado | Gerenciado pelo nginx |
| **Hostname** | `localhost` | `xfinder-archery.com.br` |
| **Proxy** | Não | Sim (nginx) |
| **URL de acesso** | `https://localhost:8443` | `https://xfinder-archery.com.br/realms/*` |
| **Dockerfile** | `Dockerfile` | `Dockerfile.prod` |

## Segurança

### Recomendações

1. **Restringir acesso ao Admin Console**: Considere restringir `/admin` apenas para IPs internos
2. **Restringir metrics**: O endpoint `/metrics` deve ser restrito
3. **Senhas fortes**: Use senhas fortes para o admin do Keycloak
4. **Backup regular**: Faça backup regular do banco de dados do Keycloak
5. **Monitoramento**: Configure monitoramento para o Keycloak

### Exemplo de restrição de acesso no nginx

```nginx
location /admin {
    # Permitir apenas IPs internos
    allow 127.0.0.1;
    allow 10.0.0.0/8;
    allow 192.168.0.0/16;
    deny all;
    
    proxy_pass http://keycloak;
    # ... resto da configuração
}
```

## Referências

- [Keycloak Behind a Proxy](https://www.keycloak.org/server/reverseproxy)
- [Keycloak Hostname Configuration](https://www.keycloak.org/server/hostname)
- [Nginx Proxy Pass](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
