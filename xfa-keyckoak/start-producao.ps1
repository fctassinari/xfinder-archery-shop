# Script PowerShell para iniciar o Keycloak em produção
# Uso: .\start-producao.ps1

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Iniciando Keycloak em Produção" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Fazer rebuild forçado da imagem (sem cache) para garantir configurações atualizadas
Write-Host "Fazendo rebuild da imagem (sem cache) para garantir configurações atualizadas..." -ForegroundColor Yellow
podman build --no-cache -f Dockerfile.prod -t xfinder-keycloak:prod .

# Parar e remover container existente (se houver)
$containerExists = podman ps -a --format "{{.Names}}" | Select-String -Pattern "^xfinder-keycloak-prod$"
if ($containerExists) {
    Write-Host "Parando e removendo container existente..." -ForegroundColor Yellow
    podman stop xfinder-keycloak-prod 2>$null
    podman rm xfinder-keycloak-prod 2>$null
}

# Verificar se o arquivo realm-export-prod.json existe
$realmFile = Join-Path $PSScriptRoot "realm-export-prod.json"
$realmVolume = ""
if (Test-Path $realmFile) {
    $realmAbsPath = (Resolve-Path $realmFile).Path
    $realmVolume = "-v `"$realmAbsPath:/opt/keycloak/data/import/realm-export.json:Z`""
    Write-Host "Arquivo realm encontrado: $realmAbsPath" -ForegroundColor Green
} else {
    Write-Host "AVISO: Arquivo realm-export-prod.json não encontrado." -ForegroundColor Yellow
    Write-Host "O Keycloak será iniciado sem importação automática do realm." -ForegroundColor Yellow
}

# Criar e iniciar o container
Write-Host ""
Write-Host "Criando container xfinder-keycloak-prod..." -ForegroundColor Cyan

$command = "podman run -d " +
    "--tz=America/Sao_Paulo " +
    "--name xfinder-keycloak-prod " +
    "--network nt-xfinder " +
    "-p 8084:8084 " +
    "$realmVolume " +
    "xfinder-keycloak:prod start " +
    "--optimized " +
    "--http-enabled=true " +
    "--hostname=https://xfinder-archery.com.br " +
    "--hostname-admin=https://xfinder-archery.com.br " +
    "--proxy-headers=xforwarded " +
    "--import-realm"

Invoke-Expression $command

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Keycloak iniciado com sucesso!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Container: xfinder-keycloak-prod" -ForegroundColor White
Write-Host "Porta: 8084 (HTTP)" -ForegroundColor White
Write-Host "URL Admin: https://xfinder-archery.com.br/admin" -ForegroundColor White
Write-Host "URL Realm: https://xfinder-archery.com.br/realms/xfinder" -ForegroundColor White
Write-Host ""
Write-Host "Para ver os logs:" -ForegroundColor Cyan
Write-Host "  podman logs -f xfinder-keycloak-prod" -ForegroundColor Gray
Write-Host ""
Write-Host "Para parar:" -ForegroundColor Cyan
Write-Host "  podman stop xfinder-keycloak-prod" -ForegroundColor Gray
Write-Host ""
