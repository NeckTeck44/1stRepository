#!/usr/bin/env pwsh

# Script pour nettoyer les fichiers temporaires et inutiles
# Auteur: Cascade AI Assistant
# Date: $(Get-Date -Format "dd/MM/yyyy")

Write-Host "Nettoyage des fichiers temporaires et inutiles..." -ForegroundColor Green

# Fichiers de log
$logFiles = @(
    "log.txt",
    "log-prod.txt"
)

# Scripts temporaires Netlify (conserves)
# $tempScripts = @(
#     "netlify-clean-deploys.ps1",
#     "netlify-delete-sites.ps1"
# )

# Dossiers temporaires
$tempFolders = @(
    "logs",
    "dist"
)

$totalSize = 0

# Supprimer les fichiers de log
foreach ($file in $logFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        $totalSize += $size
        Write-Host "Suppression de $file ($([math]::Round($size/1KB, 2)) KB)" -ForegroundColor Yellow
        Remove-Item $file -Force
    }
}

# Scripts temporaires conserves
# foreach ($script in $tempScripts) {
#     if (Test-Path $script) {
#         Write-Host "Suppression de $script" -ForegroundColor Yellow
#         Remove-Item $script -Force
#     }
# }

# Supprimer les dossiers temporaires
foreach ($folder in $tempFolders) {
    if (Test-Path $folder) {
        Write-Host "Suppression du dossier $folder/" -ForegroundColor Yellow
        Remove-Item $folder -Recurse -Force
    }
}

Write-Host "`nNettoyage termine !" -ForegroundColor Green
Write-Host "Espace libere : $([math]::Round($totalSize/1MB, 2)) MB" -ForegroundColor Green

Read-Host "`nAppuyez sur Entree pour fermer..."
