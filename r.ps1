# Script de lancement rapide - usage: .\r.ps1 <script-name>
# Exemples: .\r.ps1 git-auto, .\r.ps1 launch-dev, .\r.ps1 cleanup

param(
    [Parameter(Mandatory=$true)]
    [string]$ScriptName
)

$scriptPath = "./scripts/$ScriptName.ps1"

if (Test-Path $scriptPath) {
    Write-Host "Lancement de $ScriptName..." -ForegroundColor Green
    & $scriptPath
} else {
    Write-Host "Script '$ScriptName' non trouvé." -ForegroundColor Red
    Write-Host "Scripts disponibles:" -ForegroundColor Yellow
    Get-ChildItem -Path "./scripts" -Name "*.ps1" | ForEach-Object {
        $name = $_ -replace '\.ps1$', ''
        Write-Host "  $name" -ForegroundColor Cyan
    }
}
