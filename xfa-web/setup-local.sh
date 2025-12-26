#!/bin/bash

# Script de Configuração Local - Frontend React
# Este script configura o ambiente local para desenvolvimento
# Compatível com Git Bash e WSL no Windows

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Função para criar arquivo .env
create_env_file() {
    echo -e "${YELLOW}Criando arquivo .env...${NC}"
    cat > .env << 'EOF'
# Variáveis de Ambiente para Desenvolvimento Local
# Baseadas nas configurações do Dockerfile

# URL base da API backend
VITE_API_BASE_URL=http://localhost:8081

# Configurações do Keycloak
VITE_KEYCLOAK_URL=https://localhost:8443
VITE_KEYCLOAK_REALM=xfinder
VITE_KEYCLOAK_CLIENT_ID=xfinder-web

# URL base do frontend
VITE_APP_BASE_URL=http://localhost:8080
EOF
    echo -e "${GREEN}✓ Arquivo .env criado com sucesso!${NC}"
}

# Header
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Configuração Local - XFinder Web${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Verificar se Node.js está instalado
echo -e "${YELLOW}Verificando Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js encontrado: ${NODE_VERSION}${NC}"
else
    echo -e "${RED}✗ Node.js não encontrado!${NC}"
    echo -e "${YELLOW}  Por favor, instale o Node.js 22 ou superior:${NC}"
    echo -e "${YELLOW}  https://nodejs.org/${NC}"
    exit 1
fi

# Verificar se npm está instalado
echo -e "${YELLOW}Verificando npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm encontrado: ${NPM_VERSION}${NC}"
else
    echo -e "${RED}✗ npm não encontrado!${NC}"
    exit 1
fi

echo ""

# Criar arquivo .env se não existir
echo -e "${YELLOW}Verificando arquivo .env...${NC}"
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ Arquivo .env já existe${NC}"
    read -p "Deseja sobrescrever? (s/N): " overwrite
    if [[ "$overwrite" == "s" || "$overwrite" == "S" ]]; then
        create_env_file
    else
        echo -e "${YELLOW}Mantendo arquivo .env existente${NC}"
    fi
else
    create_env_file
fi

echo ""

# Instalar dependências
echo -e "${YELLOW}Instalando dependências...${NC}"
echo -e "${GRAY}Isso pode levar alguns minutos...${NC}"
npm install --legacy-peer-deps

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependências instaladas com sucesso!${NC}"
else
    echo -e "${RED}✗ Erro ao instalar dependências${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}  Configuração concluída!${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo -e "${WHITE}  1. Certifique-se de que a API está rodando em http://localhost:8081${NC}"
echo -e "${WHITE}  2. Certifique-se de que o Keycloak está rodando em https://localhost:8443${NC}"
echo -e "${WHITE}  3. Execute: npm run dev${NC}"
echo -e "${WHITE}  4. Acesse: http://localhost:8080${NC}"
echo ""

