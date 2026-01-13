#!/bin/bash

# Script para diagnosticar problemas com o container Keycloak
# Uso: sudo ./debug-keycloak.sh

echo "=========================================="
echo "Diagnóstico do Container Keycloak"
echo "=========================================="
echo ""

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Erro: Este script precisa ser executado como root (use sudo)"
    exit 1
fi

echo "1. Verificando se a imagem existe..."
if podman images | grep -q "xfinder-keycloak.*prod"; then
    echo "✅ Imagem encontrada:"
    podman images | grep "xfinder-keycloak.*prod"
else
    echo "❌ Imagem NÃO encontrada: localhost/xfinder-keycloak:prod"
    echo "   Execute: cd xfa-keycloak && podman build -f Dockerfile.prod -t xfinder-keycloak:prod ."
fi
echo ""

echo "2. Verificando containers Keycloak (parados e rodando)..."
podman ps -a | grep keycloak || echo "   Nenhum container Keycloak encontrado"
echo ""

echo "3. Verificando logs do último container Keycloak (se existir)..."
LAST_CONTAINER=$(podman ps -a --format "{{.Names}}" | grep keycloak | head -1)
if [ -n "$LAST_CONTAINER" ]; then
    echo "   Container encontrado: $LAST_CONTAINER"
    echo "   Últimas 30 linhas dos logs:"
    podman logs --tail 30 "$LAST_CONTAINER" 2>&1 || echo "   Não foi possível obter logs"
else
    echo "   Nenhum container Keycloak encontrado para verificar logs"
fi
echo ""

echo "4. Testando execução manual do container..."
echo "   Tentando executar o container manualmente para ver o erro:"
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
    localhost/xfinder-keycloak:prod start --optimized --http-enabled=true 2>&1 | head -20 || echo "   Erro ao executar container"
echo ""

echo "5. Verificando se o PostgreSQL está acessível..."
if podman exec xfinder-postgres psql -U postgres -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ PostgreSQL está acessível"
    echo "   Verificando se o banco 'keycloak' existe..."
    if podman exec xfinder-postgres psql -U postgres -lqt | cut -d \| -f 1 | grep -qw keycloak; then
        echo "✅ Banco 'keycloak' existe"
    else
        echo "⚠️  Banco 'keycloak' NÃO existe"
    fi
else
    echo "❌ PostgreSQL NÃO está acessível"
fi
echo ""

echo "6. Verificando status do serviço systemd..."
systemctl status xfinder-keycloak.service --no-pager -l | head -20 || echo "   Serviço não encontrado"
echo ""

echo "=========================================="
echo "Diagnóstico concluído!"
echo "=========================================="
