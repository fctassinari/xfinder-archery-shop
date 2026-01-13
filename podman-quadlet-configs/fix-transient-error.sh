#!/bin/bash

# Script para corrigir o erro "Unit is transient or generated" no Podman Quadlet
# Uso: sudo ./fix-transient-error.sh

set -e

echo "=========================================="
echo "Correção: Erro 'Unit is transient or generated'"
echo "=========================================="
echo ""

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Erro: Este script precisa ser executado como root (use sudo)"
    exit 1
fi

TARGET_DIR="/etc/containers/systemd"

echo "📁 Verificando diretório: $TARGET_DIR"
echo ""

# Verificar se o diretório existe
if [ ! -d "$TARGET_DIR" ]; then
    echo "❌ Erro: Diretório $TARGET_DIR não existe!"
    echo "   Execute primeiro: sudo mkdir -p $TARGET_DIR"
    exit 1
fi

# Verificar se os arquivos existem
echo "📋 Verificando arquivos de configuração..."
CONTAINER_FILES=$(ls "$TARGET_DIR"/*.container 2>/dev/null | wc -l)
NETWORK_FILES=$(ls "$TARGET_DIR"/*.network 2>/dev/null | wc -l)

if [ "$CONTAINER_FILES" -eq 0 ]; then
    echo "⚠️  Aviso: Nenhum arquivo .container encontrado em $TARGET_DIR"
    echo "   Certifique-se de copiar os arquivos primeiro"
fi

if [ "$NETWORK_FILES" -eq 0 ]; then
    echo "⚠️  Aviso: Nenhum arquivo .network encontrado em $TARGET_DIR"
    echo "   Certifique-se de copiar os arquivos primeiro"
fi

echo "   Arquivos .container encontrados: $CONTAINER_FILES"
echo "   Arquivos .network encontrados: $NETWORK_FILES"
echo ""

# Parar serviços temporários
echo "🛑 Parando serviços temporários (se existirem)..."
systemctl stop xfinder-postgres.service 2>/dev/null || echo "   xfinder-postgres.service não estava rodando"
systemctl stop xfinder-keycloak.service 2>/dev/null || echo "   xfinder-keycloak.service não estava rodando"
systemctl stop xfinder-api.service 2>/dev/null || echo "   xfinder-api.service não estava rodando"
systemctl stop xfinder-web.service 2>/dev/null || echo "   xfinder-web.service não estava rodando"
echo ""

# Desabilitar serviços (se estiverem habilitados)
echo "🔌 Desabilitando serviços (se estiverem habilitados)..."
systemctl disable xfinder-postgres.service 2>/dev/null || true
systemctl disable xfinder-keycloak.service 2>/dev/null || true
systemctl disable xfinder-api.service 2>/dev/null || true
systemctl disable xfinder-web.service 2>/dev/null || true
echo ""

# Ajustar permissões
echo "🔒 Ajustando permissões dos arquivos..."
chmod 644 "$TARGET_DIR"/*.container 2>/dev/null || true
chmod 644 "$TARGET_DIR"/*.network 2>/dev/null || true
echo "✅ Permissões ajustadas!"
echo ""

# Limpar unidades geradas
echo "🧹 Limpando unidades systemd geradas..."
systemctl daemon-reload
systemctl reset-failed
echo "✅ Limpeza concluída!"
echo ""

# Recarregar novamente
echo "🔄 Recarregando configurações do systemd..."
systemctl daemon-reload
echo "✅ Systemd recarregado!"
echo ""

# Verificar se os serviços foram reconhecidos
echo "🔍 Verificando se os serviços foram reconhecidos..."
RECOGNIZED=$(systemctl list-unit-files | grep -c xfinder || echo "0")

if [ "$RECOGNIZED" -gt 0 ]; then
    echo "✅ Serviços reconhecidos pelo systemd:"
    systemctl list-unit-files | grep xfinder
    echo ""
    echo "✅ Agora você pode habilitar os serviços:"
    echo "   sudo systemctl enable xfinder-postgres.service"
    echo "   sudo systemctl enable xfinder-keycloak.service"
    echo "   sudo systemctl enable xfinder-api.service"
    echo "   sudo systemctl enable xfinder-web.service"
else
    echo "⚠️  Nenhum serviço xfinder foi reconhecido."
    echo ""
    echo "Possíveis causas:"
    echo "1. Arquivos não estão em $TARGET_DIR"
    echo "2. Arquivos têm formato incorreto"
    echo "3. Podman Quadlet não está instalado/configurado"
    echo ""
    echo "Verifique:"
    echo "   ls -la $TARGET_DIR"
    echo "   podman --version"
    echo "   systemctl --version"
fi

echo ""
echo "=========================================="
echo "✅ Processo concluído!"
echo "=========================================="
