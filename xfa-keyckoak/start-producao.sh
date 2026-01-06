#!/bin/bash

# Script para iniciar o Keycloak em produção
# Uso: ./start-producao.sh

set -e

echo "=========================================="
echo "Iniciando Keycloak em Produção"
echo "=========================================="

# Verificar se a imagem existe
if ! podman image exists xfinder-keycloak:prod; then
    echo "Imagem xfinder-keycloak:prod não encontrada. Fazendo build..."
    podman build -f Dockerfile.prod -t xfinder-keycloak:prod .
fi

# Verificar se o container já existe
if podman ps -a --format "{{.Names}}" | grep -q "^xfinder-keycloak-prod$"; then
    echo "Container xfinder-keycloak-prod já existe."
    read -p "Deseja remover e recriar? (s/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        echo "Parando e removendo container existente..."
        podman stop xfinder-keycloak-prod 2>/dev/null || true
        podman rm xfinder-keycloak-prod 2>/dev/null || true
    else
        echo "Iniciando container existente..."
        podman start xfinder-keycloak-prod
        exit 0
    fi
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
    --hostname=xfinder-archery.com.br \
    --hostname-strict=false \
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
