#!/bin/bash

# Script para fazer rebuild completo do Keycloak em produção
# Remove container e imagem antiga, e reconstrói do zero
# Uso: ./rebuild-producao.sh

set -e

echo "=========================================="
echo "Rebuild Completo do Keycloak em Produção"
echo "=========================================="
echo ""

# Parar e remover container existente
if podman ps -a --format "{{.Names}}" | grep -q "^xfinder-keycloak-prod$"; then
    echo "Parando container existente..."
    podman stop xfinder-keycloak-prod 2>/dev/null || true
    echo "Removendo container existente..."
    podman rm xfinder-keycloak-prod 2>/dev/null || true
fi

# Remover imagem antiga (se existir)
if podman image exists xfinder-keycloak:prod; then
    echo "Removendo imagem antiga..."
    podman rmi xfinder-keycloak:prod 2>/dev/null || true
fi

# Fazer build completo sem cache
echo ""
echo "Fazendo build completo (sem cache)..."
podman build --no-cache -f Dockerfile.prod -t xfinder-keycloak:prod .

echo ""
echo "=========================================="
echo "Rebuild concluído com sucesso!"
echo "=========================================="
echo ""
echo "Agora execute ./start-producao.sh para iniciar o container"
echo ""
