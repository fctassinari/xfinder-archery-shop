#!/bin/bash

# Script para verificar o status dos serviços Podman Quadlet do X-Finder
# Uso: ./check-status.sh

echo "=========================================="
echo "Status dos Serviços - X-Finder Archery Shop"
echo "=========================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar status
check_service() {
    local service=$1
    local name=$2
    
    echo -n "🔍 Verificando $name... "
    
    if systemctl is-active --quiet $service; then
        echo -e "${GREEN}✓ ATIVO${NC}"
        return 0
    elif systemctl is-failed --quiet $service; then
        echo -e "${RED}✗ FALHOU${NC}"
        return 1
    else
        echo -e "${YELLOW}○ INATIVO${NC}"
        return 2
    fi
}

# Verificar cada serviço
echo "📊 Status dos Serviços Systemd:"
echo ""

check_service "xfinder-postgres.service" "PostgreSQL"
check_service "xfinder-keycloak.service" "Keycloak"
check_service "xfinder-api.service" "API Backend"
check_service "xfinder-web.service" "Frontend Web"

echo ""
echo "=========================================="
echo "🐳 Containers Podman:"
echo "=========================================="
echo ""

podman ps --filter "name=xfinder" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "=========================================="
echo "🌐 Rede Docker:"
echo "=========================================="
echo ""

if podman network exists nt-xfinder; then
    echo -e "${GREEN}✓ Rede nt-xfinder existe${NC}"
    podman network inspect nt-xfinder --format "{{.NetworkSettings.Subnets}}" 2>/dev/null || echo "  (informações de rede)"
else
    echo -e "${RED}✗ Rede nt-xfinder não existe${NC}"
fi

echo ""
echo "=========================================="
echo "📋 Comandos Úteis:"
echo "=========================================="
echo ""
echo "Ver logs de um serviço:"
echo "  sudo journalctl -u xfinder-api.service -f"
echo ""
echo "Reiniciar um serviço:"
echo "  sudo systemctl restart xfinder-api.service"
echo ""
echo "Ver status detalhado:"
echo "  sudo systemctl status xfinder-postgres.service"
echo ""
