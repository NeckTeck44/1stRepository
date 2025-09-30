#!/usr/bin/env pwsh

Write-Host "[INFO] Pour lancer le serveur et voir les URLs, exécutez :" -ForegroundColor Green
Write-Host ""
Write-Host "cd server" -ForegroundColor Yellow
Write-Host "npx tsx -r tsconfig-paths/register index.ts" -ForegroundColor Yellow
Write-Host ""
Write-Host "[INFO] Les URLs apparaîtront directement dans la console :" -ForegroundColor Cyan
Write-Host "- Local access: http://127.0.0.1:5000" -ForegroundColor White
Write-Host "- Network access: http://192.168.1.x:5000" -ForegroundColor White
Write-Host ""
Write-Host "[TIP] Vous pourrez cliquer sur ces URLs une fois le serveur démarré" -ForegroundColor Green
