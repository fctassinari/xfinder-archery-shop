# Script de Configuração Local - Frontend React
# Este script configura o ambiente local para desenvolvimento

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuração Local - XFinder Web" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Node.js está instalado
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "  Por favor, instale o Node.js 22 ou superior:" -ForegroundColor Yellow
    Write-Host "  https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar se npm está instalado
Write-Host "Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Criar arquivo .env se não existir
Write-Host "Verificando arquivo .env..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✓ Arquivo .env já existe" -ForegroundColor Green
    $overwrite = Read-Host "Deseja sobrescrever? (s/N)"
    if ($overwrite -ne "s" -and $overwrite -ne "S") {
        Write-Host "Mantendo arquivo .env existente" -ForegroundColor Yellow
    } else {
        CreateEnvFile
    }
} else {
    CreateEnvFile
}

Write-Host ""

# Instalar dependências
Write-Host "Instalando dependências..." -ForegroundColor Yellow
Write-Host "Isso pode levar alguns minutos..." -ForegroundColor Gray
npm install --legacy-peer-deps

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependências instaladas com sucesso!" -ForegroundColor Green
} else {
    Write-Host "✗ Erro ao instalar dependências" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuração concluída!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. Certifique-se de que a API está rodando em http://localhost:8081" -ForegroundColor White
Write-Host "  2. Certifique-se de que o Keycloak está rodando em https://localhost:8443" -ForegroundColor White
Write-Host "  3. Execute: npm run dev" -ForegroundColor White
Write-Host "  4. Acesse: http://localhost:8080" -ForegroundColor White
Write-Host ""

function CreateEnvFile {
    Write-Host "Criando arquivo .env..." -ForegroundColor Yellow
    $envContent = @"
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
"@
    $envContent | Out-File -FilePath ".env" -Encoding utf8 -NoNewline
    Write-Host "✓ Arquivo .env criado com sucesso!" -ForegroundColor Green
}

