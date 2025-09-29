#!/usr/bin/env pwsh

# Script de rotation des logs pour le projet Portfolio Alegria
# Auteur: NeckTeck
# Date: $(Get-Date -Format "yyyy-MM-dd")

param(
    [string]$LogPath = ".\log.txt",
    [int]$MaxSizeMB = 5,
    [int]$MaxArchives = 5
)

# Configuration
$MaxSizeBytes = $MaxSizeMB * 1MB
$ArchiveDir = ".\logs"

Write-Host "🔄 Rotation des logs démarrée..." -ForegroundColor Cyan

# Créer le dossier d'archives si nécessaire
if (-not (Test-Path $ArchiveDir)) {
    New-Item -ItemType Directory -Path $ArchiveDir -Force | Out-Null
    Write-Host "📁 Dossier d'archives créé: $ArchiveDir" -ForegroundColor Green
}

# Vérifier si le fichier de log existe
if (-not (Test-Path $LogPath)) {
    Write-Host "⚠️  Fichier de log non trouvé: $LogPath" -ForegroundColor Yellow
    exit 0
}

# Obtenir la taille du fichier
$fileInfo = Get-Item $LogPath
$fileSize = $fileInfo.Length

Write-Host "📊 Taille actuelle du log: $([math]::Round($fileSize / 1MB, 2)) MB" -ForegroundColor Blue

# Vérifier si la rotation est nécessaire
if ($fileSize -lt $MaxSizeBytes) {
    Write-Host "✅ Taille du log acceptable, pas de rotation nécessaire" -ForegroundColor Green
    exit 0
}

Write-Host "🔄 Rotation nécessaire..." -ForegroundColor Yellow

# Créer le nom du fichier d'archive
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$archiveName = "log_$timestamp.txt"
$archivePath = Join-Path $ArchiveDir $archiveName

# Archiver le fichier actuel
try {
    Copy-Item $LogPath $archivePath -Force
    Write-Host "📦 Log archivé vers: $archivePath" -ForegroundColor Green
    
    # Vider le fichier de log actuel
    Clear-Content $LogPath
    Write-Host "🧹 Fichier de log actuel vidé" -ForegroundColor Green
    
    # Ajouter une entrée de rotation
    $rotationEntry = "=== ROTATION DES LOGS ===`nDate: $(Get-Date)`nFichier archivé: $archiveName`nTaille avant rotation: $([math]::Round($fileSize / 1MB, 2)) MB`n========================`n"
    Add-Content $LogPath $rotationEntry
    
    Write-Host "✅ Rotation terminée avec succès" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de la rotation: $_" -ForegroundColor Red
    exit 1
}

# Nettoyer les anciennes archives
$archives = Get-ChildItem -Path $ArchiveDir -Filter "log_*.txt" | Sort-Object LastWriteTime -Descending
if ($archives.Count -gt $MaxArchives) {
    Write-Host "🧹 Nettoyage des anciennes archives..." -ForegroundColor Yellow
    $archivesToDelete = $archives | Select-Object -Skip $MaxArchives
    foreach ($archive in $archivesToDelete) {
        Remove-Item $archive.FullName -Force
        Write-Host "🗑️  Archive supprimée: $($archive.Name)" -ForegroundColor Red
    }
}

Write-Host "🎉 Rotation des logs terminée !" -ForegroundColor Green
