# Exemplo de Uso de Podman Secrets

Este documento mostra como usar Podman Secrets para melhorar a segurança das configurações do Quadlet, removendo senhas em texto plano dos arquivos de configuração.

## Criar Secrets

```bash
# Criar secret para senha do PostgreSQL
echo -n "XFA@2025" | sudo podman secret create postgres_password -

# Criar secret para senha do admin do Keycloak
echo -n "XFA@2025" | sudo podman secret create keycloak_admin_password -

# Criar secret para senha do SMTP (Gmail)
echo -n "bpir kvyk osew qxkz" | sudo podman secret create smtp_password -
```

## Listar Secrets

```bash
sudo podman secret ls
```

## Modificar Arquivos .container

### xfinder-postgres.container (com Secrets)

```ini
[Unit]
Description=X-Finder Archery Shop PostgreSQL Database
After=network-online.target
Wants=network-online.target

[Container]
Image=docker.io/library/postgres:18.0
ContainerName=xfinder-postgres
Network=nt-xfinder.network
PublishPort=5432:5432
Volume=xfinder-postgres:/var/lib/postgresql/data
Secret=postgres_password,type=env,target=POSTGRES_PASSWORD
Environment=TZ=America/Sao_Paulo
Timezone=America/Sao_Paulo

[Service]
Restart=on-failure
TimeoutStartSec=900

[Install]
WantedBy=multi-user.target default.target
```

**Mudanças**:
- Removido: `Environment=POSTGRES_PASSWORD=XFA@2025`
- Adicionado: `Secret=postgres_password,type=env,target=POSTGRES_PASSWORD`

### xfinder-keycloak.container (com Secrets)

```ini
[Unit]
Description=X-Finder Archery Shop Keycloak Authentication Server
After=network-online.target xfinder-postgres.service
Wants=network-online.target
Requires=xfinder-postgres.service

[Container]
Image=docker.io/fctassinari/xfinder-keycloak:prod
ContainerName=xfinder-keycloak
Network=nt-xfinder.network
PublishPort=8084:8084
Volume=xfinder-keycloak-realm:/opt/keycloak/data/import
Environment=KC_DB=postgres
Environment=KC_DB_URL=jdbc:postgresql://xfinder-postgres:5432/keycloak
Environment=KC_DB_USERNAME=postgres
Secret=postgres_password,type=env,target=KC_DB_PASSWORD
Environment=KC_HOSTNAME=https://xfinder-archery.com.br
Environment=KC_HOSTNAME_ADMIN=https://xfinder-archery.com.br
Environment=KC_PROXY_HEADERS=xforwarded
Environment=KC_HTTP_ENABLED=true
Environment=KC_HTTP_PORT=8084
Environment=KC_HTTPS_ENABLED=false
Environment=KC_BOOTSTRAP_ADMIN_USERNAME=admin
Secret=keycloak_admin_password,type=env,target=KC_BOOTSTRAP_ADMIN_PASSWORD
Environment=KC_HEALTH_ENABLED=true
Environment=KC_METRICS_ENABLED=true
Environment=KC_SMTP_HOST=smtp.gmail.com
Environment=KC_SMTP_PORT=465
Environment=KC_SMTP_FROM=contato.xfinder@gmail.com
Environment=KC_SMTP_FROM_DISPLAY_NAME=X-Finder Archery Shop
Environment=KC_SMTP_USERNAME=contato.xfinder@gmail.com
Secret=smtp_password,type=env,target=KC_SMTP_PASSWORD
Environment=KC_SMTP_SSL_ENABLED=true
Environment=KC_SMTP_STARTTLS_ENABLED=false
Timezone=America/Sao_Paulo

[Service]
Restart=on-failure
TimeoutStartSec=600

[Install]
WantedBy=multi-user.target default.target
```

**Mudanças**:
- Removido: `Environment=KC_DB_PASSWORD=XFA@2025`
- Adicionado: `Secret=postgres_password,type=env,target=KC_DB_PASSWORD`
- Removido: `Environment=KC_BOOTSTRAP_ADMIN_PASSWORD=XFA@2025`
- Adicionado: `Secret=keycloak_admin_password,type=env,target=KC_BOOTSTRAP_ADMIN_PASSWORD`
- Removido: `Environment=KC_SMTP_PASSWORD=bpir kvyk osew qxkz`
- Adicionado: `Secret=smtp_password,type=env,target=KC_SMTP_PASSWORD`

## Remover Secrets

```bash
# Remover um secret específico
sudo podman secret rm postgres_password

# Remover todos os secrets (cuidado!)
sudo podman secret ls -q | xargs sudo podman secret rm
```

## Verificar Secrets em Uso

```bash
# Ver detalhes de um secret
sudo podman secret inspect postgres_password
```

## Vantagens de Usar Secrets

1. **Segurança**: Senhas não ficam em texto plano nos arquivos de configuração
2. **Auditoria**: Podman rastreia quando e por quem os secrets foram criados
3. **Rotação**: Mais fácil rotacionar senhas sem editar múltiplos arquivos
4. **Compartilhamento**: Secrets podem ser compartilhados entre containers

## Notas Importantes

- Secrets são armazenados de forma segura pelo Podman
- Secrets são injetados como variáveis de ambiente no container
- Secrets persistem mesmo após reinicialização do sistema
- Use `podman secret ls` para listar todos os secrets disponíveis

## Migração de Configuração Existente

Se você já tem containers rodando com senhas em texto plano:

1. Criar os secrets
2. Modificar os arquivos `.container` para usar secrets
3. Recarregar systemd: `sudo systemctl daemon-reload`
4. Reiniciar os serviços: `sudo systemctl restart <serviço>`
