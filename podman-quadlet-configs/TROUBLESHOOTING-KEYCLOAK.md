# Troubleshooting - Keycloak não inicia

## Problema
O container do Keycloak morre imediatamente após iniciar.

## Diagnóstico

Execute o script de diagnóstico:
```bash
sudo bash podman-quadlet-configs/debug-keycloak.sh
```

Ou verifique manualmente:

### 1. Verificar logs do container
```bash
# Ver logs do último container Keycloak
podman ps -a | grep keycloak
podman logs <CONTAINER_ID>
```

### 2. Testar execução manual
```bash
podman run --rm \
    --tz=America/Sao_Paulo \
    --network nt-xfinder \
    -e KC_DB=postgres \
    -e KC_DB_URL=jdbc:postgresql://xfinder-postgres:5432/keycloak \
    -e KC_DB_USERNAME=postgres \
    -e KC_DB_PASSWORD=XFA@2025 \
    -e KC_HTTP_ENABLED=true \
    -e KC_HTTP_PORT=8084 \
    -e KC_HTTPS_ENABLED=false \
    localhost/xfinder-keycloak:prod start --optimized --http-enabled=true
```

### 3. Verificar se a imagem existe
```bash
podman images | grep xfinder-keycloak
```

### 4. Verificar se o banco de dados está acessível
```bash
podman exec xfinder-postgres psql -U postgres -c "SELECT 1;"
podman exec xfinder-postgres psql -U postgres -l | grep keycloak
```

## Soluções Possíveis

### Solução 1: Modificar o Dockerfile para incluir o comando start

O problema é que o Keycloak precisa do comando `start` e seus argumentos, mas o Podman Quadlet não passa argumentos ao ENTRYPOINT facilmente.

**Opção A**: Modificar o `Dockerfile.prod` para incluir o comando no CMD:

```dockerfile
# Adicionar ao final do Dockerfile.prod
CMD ["start", "--optimized", "--http-enabled=true", "--hostname=https://xfinder-archery.com.br", "--hostname-admin=https://xfinder-archery.com.br", "--proxy-headers=xforwarded", "--import-realm"]
```

Depois, reconstruir a imagem:
```bash
cd xfa-keycloak
podman build -f Dockerfile.prod -t xfinder-keycloak:prod .
```

### Solução 2: Usar um script wrapper

Criar um script que inicia o Keycloak com os argumentos corretos e usar esse script como ENTRYPOINT.

### Solução 3: Verificar se o Keycloak inicia automaticamente

Algumas versões do Keycloak podem iniciar automaticamente se as variáveis de ambiente estiverem corretas. Teste sem o comando `start`:

```bash
podman run --rm \
    --tz=America/Sao_Paulo \
    --network nt-xfinder \
    -e KC_DB=postgres \
    -e KC_DB_URL=jdbc:postgresql://xfinder-postgres:5432/keycloak \
    -e KC_DB_USERNAME=postgres \
    -e KC_DB_PASSWORD=XFA@2025 \
    -e KC_HTTP_ENABLED=true \
    -e KC_HTTP_PORT=8084 \
    -e KC_HTTPS_ENABLED=false \
    localhost/xfinder-keycloak:prod
```

## Verificação Final

Após aplicar uma solução:

1. Recarregar systemd:
```bash
sudo systemctl daemon-reload
```

2. Iniciar o serviço:
```bash
sudo systemctl start xfinder-keycloak.service
```

3. Verificar status:
```bash
sudo systemctl status xfinder-keycloak.service
podman ps | grep keycloak
```

4. Ver logs:
```bash
sudo journalctl -u xfinder-keycloak.service -f
```
