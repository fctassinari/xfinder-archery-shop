# Script de instalação dos arquivos Podman Quadlet para X-Finder Archery Shop
# Uso: Execute este script no servidor Linux via SSH ou adapte para uso local

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Instalação Podman Quadlet - X-Finder" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Nota: Este script é principalmente para referência
# A instalação real deve ser feita no servidor Linux

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$TargetDir = "/etc/containers/systemd"

Write-Host "📁 Diretório de origem: $ScriptDir" -ForegroundColor Yellow
Write-Host "📁 Diretório de destino: $TargetDir" -ForegroundColor Yellow
Write-Host ""

Write-Host "⚠️  ATENÇÃO: Este script deve ser executado no servidor Linux!" -ForegroundColor Red
Write-Host ""
Write-Host "Para instalar no servidor Linux, use:" -ForegroundColor Yellow
Write-Host "  sudo bash install-quadlet.sh" -ForegroundColor Green
Write-Host ""
Write-Host "Ou copie os arquivos manualmente:" -ForegroundColor Yellow
Write-Host "  sudo cp podman-quadlet-configs/*.container /etc/containers/systemd/" -ForegroundColor Green
Write-Host "  sudo cp podman-quadlet-configs/*.network /etc/containers/systemd/" -ForegroundColor Green
Write-Host "  sudo systemctl daemon-reload" -ForegroundColor Green
Write-Host ""
