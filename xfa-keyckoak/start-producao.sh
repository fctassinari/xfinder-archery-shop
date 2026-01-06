#!/bin/bash

# Script para iniciar o Keycloak em produção
# Uso: ./start-producao.sh

set -e

echo "=========================================="
echo "Iniciando Keycloak em Produção"
echo "=========================================="

# Verificar se a imagem existe e fazer rebuild forçado
echo "Fazendo rebuild da imagem (sem cache) para garantir configurações atualizadas..."
podman build --no-cache -f Dockerfile.prod -t xfinder-keycloak:prod .

# Parar e remover container existente (se houver)
if podman ps -a --format "{{.Names}}" | grep -q "^xfinder-keycloak-prod$"; then
    echo "Parando e removendo container existente..."
    podman stop xfinder-keycloak-prod 2>/dev/null || true
    podman rm xfinder-keycloak-prod 2>/dev/null || true
fi

# Verificar se o arquivo realm-export-prod.json existe
REALM_FILE="./realm-export-prod.json"
if [ ! -f "$REALM_FILE" ]; then
    echo "AVISO: Arquivo $REALM_FILE não encontrado."
    echo "O Keycloak será iniciado sem importação automática do realm."
    REALM_VOLUME=""
else
    REALM_VOLUME="-v \"$(pwd)/realm-export-prod.json:/opt/keycloak/data/import/realm-export.json:Z\""
fi

# Obter caminho absoluto do arquivo realm (se existir)
if [ -f "$REALM_FILE" ]; then
    REALM_ABS_PATH=$(realpath "$REALM_FILE")
    REALM_VOLUME="-v \"$REALM_ABS_PATH:/opt/keycloak/data/import/realm-export.json:Z\""
fi

# Criar e iniciar o container
echo "Criando container xfinder-keycloak-prod..."

eval "podman run -d \
    --tz=America/Sao_Paulo \
    --name xfinder-keycloak-prod \
    --network nt-xfinder \
    -p 8084:8084 \
    $REALM_VOLUME \
    xfinder-keycloak:prod start \
    --optimized \
    --http-enabled=true \
    --hostname=https://xfinder-archery.com.br \
    --hostname-admin=https://xfinder-archery.com.br \
    --proxy-headers=xforwarded \
    --import-realm"

echo ""
echo "=========================================="
echo "Keycloak iniciado com sucesso!"
echo "=========================================="
echo ""
echo "Container: xfinder-keycloak-prod"
echo "Porta: 8084 (HTTP)"
echo "URL Admin: https://xfinder-archery.com.br/admin"
echo "URL Realm: https://xfinder-archery.com.br/realms/xfinder"
echo ""
echo "Para ver os logs:"
echo "  podman logs -f xfinder-keycloak-prod"
echo ""
echo "Para parar:"
echo "  podman stop xfinder-keycloak-prod"
echo ""
