# Correção do Dockerfile do Keycloak para Podman Quadlet

## Problema
O container do Keycloak precisa do comando `start` e seus argumentos, mas o Podman Quadlet não passa argumentos ao ENTRYPOINT facilmente.

## Solução: Modificar o Dockerfile.prod

Adicione o comando `CMD` ao final do arquivo `xfa-keycloak/Dockerfile.prod`:

```dockerfile
# Adicionar estas linhas ao final do Dockerfile.prod (após a linha 48)
CMD ["start", "--optimized", "--http-enabled=true", "--hostname=https://xfinder-archery.com.br", "--hostname-admin=https://xfinder-archery.com.br", "--proxy-headers=xforwarded", "--import-realm"]
```

O arquivo completo ficará assim:

```dockerfile
FROM quay.io/keycloak/keycloak:latest AS builder

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

# Configure a database vendor
ENV KC_DB=postgres

WORKDIR /opt/keycloak
# Em produção, não precisamos de certificado auto-assinado
# O nginx cuida do SSL/TLS
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:latest
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Copiar estrutura completa do tema (inclui diretórios)
COPY themes/ /opt/keycloak/themes/
# Desabilitar cache de temas (desenvolvimento)
ENV KC_SPI_THEME_CACHE_THEMES=false
ENV KC_SPI_THEME_CACHE_TEMPLATES=false

# Configurações do banco de dados
ENV KC_DB='postgres'
ENV KC_DB_URL='jdbc:postgresql://xfinder-postgres:5432/keycloak'
ENV KC_DB_USERNAME='postgres'
ENV KC_DB_PASSWORD='XFA@2025'

# Configurações para funcionar atrás de proxy reverso (nginx)
# O hostname externo que os usuários acessam (URL completa)
ENV KC_HOSTNAME='https://xfinder-archery.com.br'
# O hostname admin (URL completa para o console de administração)
ENV KC_HOSTNAME_ADMIN='https://xfinder-archery.com.br'
# Configurar proxy headers (novo formato - substitui KC_PROXY=edge)
ENV KC_PROXY_HEADERS='xforwarded'
# Habilitar HTTP (sem SSL, pois o nginx cuida do SSL)
ENV KC_HTTP_ENABLED=true
# Porta HTTP customizada
ENV KC_HTTP_PORT=8084
# Desabilitar HTTPS (não precisamos, o nginx cuida)
ENV KC_HTTPS_ENABLED=false

# Credenciais do admin
ENV KC_BOOTSTRAP_ADMIN_USERNAME=admin
ENV KC_BOOTSTRAP_ADMIN_PASSWORD=XFA@2025

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start", "--optimized", "--http-enabled=true", "--hostname=https://xfinder-archery.com.br", "--hostname-admin=https://xfinder-archery.com.br", "--proxy-headers=xforwarded", "--import-realm"]
```

## Passos para Aplicar a Correção

1. Editar o arquivo:
```bash
cd xfa-keycloak
vim Dockerfile.prod
```

2. Adicionar a linha `CMD` ao final do arquivo (conforme mostrado acima)

3. Reconstruir a imagem:
```bash
podman build -f Dockerfile.prod -t xfinder-keycloak:prod .
```

4. Remover o campo `Exec=` do arquivo `.container` (se existir):
```bash
# O arquivo xfinder-keycloak.container não deve ter a linha Exec=
```

5. Recarregar o systemd:
```bash
sudo systemctl daemon-reload
```

6. Iniciar o serviço:
```bash
sudo systemctl start xfinder-keycloak.service
```

7. Verificar se está funcionando:
```bash
sudo systemctl status xfinder-keycloak.service
podman ps | grep keycloak
```

## Alternativa: Remover Exec= do arquivo .container

Se você não quiser modificar o Dockerfile, pode remover a linha `Exec=` do arquivo `xfinder-keycloak.container` e o Keycloak tentará iniciar automaticamente. No entanto, isso pode não funcionar se o Keycloak realmente precisar dos argumentos explícitos.

A solução recomendada é modificar o Dockerfile para incluir o CMD.
