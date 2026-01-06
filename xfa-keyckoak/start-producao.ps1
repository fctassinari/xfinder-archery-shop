# Script PowerShell para iniciar o Keycloak em produção
# Uso: .\start-producao.ps1

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Iniciando Keycloak em Produção" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se a imagem existe
$imageExists = podman image exists xfinder-keycloak:prod 2>$null
if (-not $imageExists) {
    Write-Host "Imagem xfinder-keycloak:prod não encontrada. Fazendo build..." -ForegroundColor Yellow
    podman build -f Dockerfile.prod -t xfinder-keycloak:prod .
}

# Verificar se o container já existe
$containerExists = podman ps -a --format "{{.Names}}" | Select-String -Pattern "^xfinder-keycloak-prod$"
if ($containerExists) {
    Write-Host "Container xfinder-keycloak-prod já existe." -ForegroundColor Yellow
    $response = Read-Host "Deseja remover e recriar? (s/N)"
    if ($response -eq "s" -or $response -eq "S") {
        Write-Host "Parando e removendo container existente..." -ForegroundColor Yellow
        podman stop xfinder-keycloak-prod 2>$null
        podman rm xfinder-keycloak-prod 2>$null
    } else {
        Write-Host "Iniciando container existente..." -ForegroundColor Green
        podman start xfinder-keycloak-prod
        exit 0
    }
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
    "-p 8080:8080 " +
    "$realmVolume " +
    "xfinder-keycloak:prod start " +
    "--optimized " +
    "--http-enabled=true " +
    "--proxy=edge " +
    "--hostname=xfinder-archery.com.br " +
    "--hostname-strict=false " +
    "--import-realm"

Invoke-Expression $command

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Keycloak iniciado com sucesso!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Container: xfinder-keycloak-prod" -ForegroundColor White
Write-Host "Porta: 8080 (HTTP)" -ForegroundColor White
Write-Host "URL Admin: https://xfinder-archery.com.br/admin" -ForegroundColor White
Write-Host "URL Realm: https://xfinder-archery.com.br/realms/xfinder" -ForegroundColor White
Write-Host ""
Write-Host "Para ver os logs:" -ForegroundColor Cyan
Write-Host "  podman logs -f xfinder-keycloak-prod" -ForegroundColor Gray
Write-Host ""
Write-Host "Para parar:" -ForegroundColor Cyan
Write-Host "  podman stop xfinder-keycloak-prod" -ForegroundColor Gray
Write-Host ""
