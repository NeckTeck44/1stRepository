#!/usr/bin/env pwsh

# Script Git totalement automatique pour le portfolio Alegria
# Auteur: Cascade AI Assistant
# Date: $(Get-Date -Format "dd/MM/yyyy")

$message = "mise a jour portfolio - $(Get-Date -Format 'dd/MM/yyyy HH:mm')"

Write-Host "Git automatique en cours..." -ForegroundColor Green
Write-Host "Message: $message" -ForegroundColor Yellow

git add .
git commit -m $message
git push

Write-Host "Termine !" -ForegroundColor Green
Read-Host "`nAppuyez sur Entree pour fermer..."
