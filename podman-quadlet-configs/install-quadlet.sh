#!/bin/bash

# Script de instalação dos arquivos Podman Quadlet para X-Finder Archery Shop
# Uso: sudo ./install-quadlet.sh

set -e

echo "=========================================="
echo "Instalação Podman Quadlet - X-Finder"
echo "=========================================="
echo ""

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Erro: Este script precisa ser executado como root (use sudo)"
    exit 1
fi

# Diretório de origem (onde está o script)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="/etc/containers/systemd"

echo "📁 Diretório de origem: $SCRIPT_DIR"
echo "📁 Diretório de destino: $TARGET_DIR"
echo ""

# Criar diretório de destino se não existir
if [ ! -d "$TARGET_DIR" ]; then
    echo "📂 Criando diretório $TARGET_DIR..."
    mkdir -p "$TARGET_DIR"
fi

# Copiar arquivos
echo "📋 Copiando arquivos de configuração..."
cp "$SCRIPT_DIR/nt-xfinder.network" "$TARGET_DIR/"
cp "$SCRIPT_DIR/xfinder-postgres.container" "$TARGET_DIR/"
cp "$SCRIPT_DIR/xfinder-keycloak.container" "$TARGET_DIR/"
cp "$SCRIPT_DIR/xfinder-api.container" "$TARGET_DIR/"
cp "$SCRIPT_DIR/xfinder-web.container" "$TARGET_DIR/"

echo "✅ Arquivos copiados com sucesso!"
echo ""

# Ajustar permissões
echo "🔒 Ajustando permissões dos arquivos..."
chmod 644 "$TARGET_DIR"/*.network
chmod 644 "$TARGET_DIR"/*.container

echo "✅ Permissões ajustadas!"
echo ""

# Ajustar permissões
echo "🔒 Ajustando permissões dos arquivos..."
chmod 644 "$TARGET_DIR"/*.network
chmod 644 "$TARGET_DIR"/*.container

echo "✅ Permissões ajustadas!"
echo ""

# Recarregar systemd
echo "🔄 Recarregando configurações do systemd..."
systemctl daemon-reload

echo "✅ Systemd recarregado!"
echo ""

# Verificar se os serviços foram reconhecidos
echo "🔍 Verificando se os serviços foram reconhecidos..."
if systemctl list-unit-files | grep -q xfinder; then
    echo "✅ Serviços reconhecidos pelo systemd:"
    systemctl list-unit-files | grep xfinder
else
    echo "⚠️  Aviso: Nenhum serviço xfinder encontrado. Verifique os arquivos."
fi
echo ""

echo "=========================================="
echo "✅ Instalação concluída!"
echo "=========================================="
echo ""
echo "Próximos passos:"
echo "1. Verificar se as imagens Docker estão disponíveis"
echo "2. Habilitar os serviços:"
echo "   sudo systemctl enable xfinder-postgres.service"
echo "   sudo systemctl enable xfinder-keycloak.service"
echo "   sudo systemctl enable xfinder-api.service"
echo "   sudo systemctl enable xfinder-web.service"
echo ""
echo "3. Iniciar os serviços na ordem correta (veja README-PODMAN-QUADLET-XFINDER.md)"
echo ""
echo "4. Criar os bancos de dados após a primeira inicialização do PostgreSQL"
echo ""
