# Script PowerShell para fazer rebuild completo do Keycloak em produção
# Remove container e imagem antiga, e reconstrói do zero
# Uso: .\rebuild-producao.ps1

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Rebuild Completo do Keycloak em Produção" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Parar e remover container existente
$containerExists = podman ps -a --format "{{.Names}}" | Select-String -Pattern "^xfinder-keycloak-prod$"
if ($containerExists) {
    Write-Host "Parando container existente..." -ForegroundColor Yellow
    podman stop xfinder-keycloak-prod 2>$null
    Write-Host "Removendo container existente..." -ForegroundColor Yellow
    podman rm xfinder-keycloak-prod 2>$null
}

# Remover imagem antiga (se existir)
$imageExists = podman image exists xfinder-keycloak:prod 2>$null
if ($imageExists) {
    Write-Host "Removendo imagem antiga..." -ForegroundColor Yellow
    podman rmi xfinder-keycloak:prod 2>$null
}

# Fazer build completo sem cache
Write-Host ""
Write-Host "Fazendo build completo (sem cache)..." -ForegroundColor Cyan
podman build --no-cache -f Dockerfile.prod -t xfinder-keycloak:prod .

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Rebuild concluído com sucesso!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Agora execute .\start-producao.ps1 para iniciar o container" -ForegroundColor Cyan
Write-Host ""
