# Script PowerShell simple pour restaurer les améliorations du son de typing
$filePath = "c:\Users\catel\Downloads\Portfolio Alegria - Candidature Formation\client\index.html"

Write-Host "🔧 Application des corrections du son de typing..." -ForegroundColor Yellow

# 1. Corriger la vitesse de lecture de 1.20 à 1.35
(Get-Content $filePath) -replace 'const playbackRate = 1\.20;.*', 'const playbackRate = 1.35; // Vitesse de lecture 1.35x pour un effet plus dynamique' | Set-Content $filePath
Write-Host "✅ Vitesse de lecture corrigée à 1.35x" -ForegroundColor Green

Write-Host "🎉 Correction de la vitesse appliquée !" -ForegroundColor Cyan
