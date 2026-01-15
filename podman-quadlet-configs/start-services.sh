#!/bin/bash

# Script para iniciar todos os serviços X-Finder (sem usar enable)
# Uso: sudo ./start-services.sh

set -e

echo "=========================================="
echo "Iniciando Serviços X-Finder Archery Shop"
echo "=========================================="
echo ""

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Erro: Este script precisa ser executado como root (use sudo)"
    exit 1
fi

# Recarregar systemd
echo "🔄 Recarregando configurações do systemd..."
systemctl daemon-reload
echo "✅ Systemd recarregado!"
echo ""

# Iniciar PostgreSQL
echo "🐘 Iniciando PostgreSQL..."
systemctl start xfinder-postgres.service
sleep 15
echo "✅ PostgreSQL iniciado!"
echo ""

# Verificar se PostgreSQL está rodando
if systemctl is-active --quiet xfinder-postgres.service; then
    echo "✅ PostgreSQL está ativo"
else
    echo "❌ Erro: PostgreSQL não iniciou corretamente"
    echo "   Verifique os logs: sudo journalctl -u xfinder-postgres.service -n 50"
    exit 1
fi

# Criar bancos de dados (apenas se não existirem)
echo "📊 Verificando bancos de dados..."
DB_XFA=$(podman exec xfinder-postgres psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='xfa'" 2>/dev/null || echo "0")
DB_KEYCLOAK=$(podman exec xfinder-postgres psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='keycloak'" 2>/dev/null || echo "0")

if [ "$DB_XFA" != "1" ]; then
    echo "📊 Criando banco de dados 'xfa'..."
    podman exec -i xfinder-postgres psql -U postgres <<EOF
CREATE DATABASE xfa WITH OWNER = postgres ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8' LOCALE_PROVIDER = 'libc' TABLESPACE = pg_default CONNECTION LIMIT = -1 IS_TEMPLATE = False;
EOF
    echo "✅ Banco 'xfa' criado!"
else
    echo "✅ Banco 'xfa' já existe"
fi

if [ "$DB_KEYCLOAK" != "1" ]; then
    echo "📊 Criando banco de dados 'keycloak'..."
    podman exec -i xfinder-postgres psql -U postgres <<EOF
CREATE DATABASE keycloak WITH OWNER = postgres ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8' LOCALE_PROVIDER = 'libc' TABLESPACE = pg_default CONNECTION LIMIT = -1 IS_TEMPLATE = False;
EOF
    echo "✅ Banco 'keycloak' criado!"
else
    echo "✅ Banco 'keycloak' já existe"
fi
echo ""

# Iniciar Keycloak
echo "🔐 Iniciando Keycloak..."
systemctl start xfinder-keycloak.service
sleep 30
echo "✅ Keycloak iniciado!"
echo ""

# Iniciar API
echo "🚀 Iniciando API Backend..."
systemctl start xfinder-api.service
sleep 10
echo "✅ API Backend iniciada!"
echo ""

# Iniciar Frontend
echo "🌐 Iniciando Frontend Web..."
systemctl start xfinder-web.service
echo "✅ Frontend Web iniciado!"
echo ""

# Verificar status de todos os serviços
echo "=========================================="
echo "📊 Status dos Serviços:"
echo "=========================================="
echo ""

for service in xfinder-postgres xfinder-keycloak xfinder-api xfinder-web; do
    if systemctl is-active --quiet ${service}.service; then
        echo "✅ ${service}.service - ATIVO"
    else
        echo "❌ ${service}.service - INATIVO"
    fi
done

echo ""
echo "=========================================="
echo "✅ Processo concluído!"
echo "=========================================="
echo ""
echo "ℹ️  Os serviços iniciarão automaticamente no boot"
echo "   porque a seção [Install] está configurada nos arquivos .container"
echo ""
echo "📋 Comandos úteis:"
echo "   Ver status: sudo systemctl status xfinder-*.service"
echo "   Ver logs: sudo journalctl -u xfinder-api.service -f"
echo "   Parar serviços: sudo systemctl stop xfinder-*.service"
echo ""
