#!/bin/bash

# Script para verificar e diagnosticar problemas com o serviço Keycloak
# Uso: sudo ./verify-keycloak.sh

echo "=========================================="
echo "Diagnóstico do Serviço Keycloak"
echo "=========================================="
echo ""

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Erro: Este script precisa ser executado como root (use sudo)"
    exit 1
fi

echo "1. Verificando se o arquivo existe..."
if [ -f "/etc/containers/systemd/xfinder-keycloak.container" ]; then
    echo "✅ Arquivo encontrado: /etc/containers/systemd/xfinder-keycloak.container"
    echo ""
    echo "   Conteúdo do arquivo (primeiras 10 linhas):"
    head -10 /etc/containers/systemd/xfinder-keycloak.container
    echo ""
else
    echo "❌ Arquivo NÃO encontrado: /etc/containers/systemd/xfinder-keycloak.container"
    exit 1
fi

echo "2. Verificando permissões do arquivo..."
ls -la /etc/containers/systemd/xfinder-keycloak.container
echo ""

echo "3. Verificando sintaxe do arquivo..."
# Tentar executar o gerador manualmente
if [ -f "/usr/lib/systemd/system-generators/podman-system-generator" ]; then
    echo "   Executando gerador do Podman (dry-run)..."
    /usr/lib/systemd/system-generators/podman-system-generator --dryrun 2>&1 | grep -i keycloak || echo "   Nenhuma saída relacionada ao Keycloak"
else
    echo "   Gerador do Podman não encontrado em /usr/lib/systemd/system-generators/"
fi
echo ""

echo "4. Recarregando systemd..."
systemctl daemon-reload
echo "✅ Systemd recarregado!"
echo ""

echo "5. Verificando se o serviço foi reconhecido..."
if systemctl list-unit-files | grep -q "xfinder-keycloak"; then
    echo "✅ Serviço reconhecido:"
    systemctl list-unit-files | grep xfinder-keycloak
else
    echo "❌ Serviço NÃO foi reconhecido pelo systemd"
    echo ""
    echo "   Possíveis causas:"
    echo "   - Erro de sintaxe no arquivo .container"
    echo "   - Campo não suportado pelo Podman Quadlet"
    echo "   - Problema com o nome do arquivo"
    echo ""
    echo "   Verificando outros serviços xfinder reconhecidos:"
    systemctl list-unit-files | grep xfinder
fi
echo ""

echo "6. Verificando logs do systemd para erros..."
journalctl -u systemd --since "1 minute ago" | grep -i "keycloak\|error\|fail" | tail -5 || echo "   Nenhum erro relacionado encontrado"
echo ""

echo "=========================================="
echo "Diagnóstico concluído!"
echo "=========================================="
