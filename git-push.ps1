#!/usr/bin/env pwsh

# Script Git automatisé pour le portfolio Alegria
# Auteur: Cascade AI Assistant
# Date: $(Get-Date -Format "dd/MM/yyyy")

Write-Host "🚀 Début du processus Git pour le portfolio Alegria..." -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan

# Vérifier si on est dans un dépôt Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ Erreur: Ce n'est pas un dépôt Git !" -ForegroundColor Red
    Write-Host "💡 Exécutez 'git init' pour initialiser un dépôt" -ForegroundColor Yellow
    Read-Host "`nAppuyez sur Entree pour fermer..."
    exit 1
}

# Vérifier le statut Git
Write-Host "📋 Vérification du statut Git..." -ForegroundColor Yellow
git status --porcelain
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la vérification du statut Git" -ForegroundColor Red
    Read-Host "`nAppuyez sur Entree pour fermer..."
    exit 1
}

# Demander le message de commit
$message = Read-Host "`n💬 Entrez le message de commit (laissez vide pour 'mise a jour portfolio')"
if (-not $message) {
    $message = "mise a jour portfolio"
}

# Ajouter les fichiers
Write-Host "`n📁 Ajout des fichiers modifiés..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'ajout des fichiers" -ForegroundColor Red
    Read-Host "`nAppuyez sur Entree pour fermer..."
    exit 1
}

# Faire le commit
Write-Host "💾 Commit des modifications..." -ForegroundColor Yellow
git commit -m $message
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du commit" -ForegroundColor Red
    Read-Host "`nAppuyez sur Entree pour fermer..."
    exit 1
}

# Vérifier s'il y a un dépôt distant
$remoteExists = git remote -v
if ($remoteExists) {
    Write-Host "📤 Envoi vers le dépôt distant..." -ForegroundColor Yellow
    git push
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Attention: L'envoi a échoué, mais le commit est local" -ForegroundColor Yellow
        Write-Host "💡 Vérifiez votre connexion ou les droits d'accès" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Envoi réussi !" -ForegroundColor Green
    }
} else {
    Write-Host "ℹ️  Aucun dépôt distant configuré" -ForegroundColor Yellow
    Write-Host "💡 Utilisez 'git remote add origin <url>' pour ajouter un dépôt distant" -ForegroundColor Yellow
}

Write-Host "`n🎉 Opération Git terminée avec succès !" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan

# Afficher le résumé
Write-Host "`n📊 Résumé des opérations:" -ForegroundColor Cyan
Write-Host "   • Message de commit: $message" -ForegroundColor White
Write-Host "   • Fichiers ajoutés: Tous" -ForegroundColor White
if ($remoteExists -and $LASTEXITCODE -eq 0) {
    Write-Host "   • Envoi distant: ✅ Succès" -ForegroundColor Green
} elseif ($remoteExists) {
    Write-Host "   • Envoi distant: ⚠️ Échec (commit local)" -ForegroundColor Yellow
} else {
    Write-Host "   • Envoi distant: ❌ Aucun dépôt distant" -ForegroundColor Red
}

Read-Host "`nAppuyez sur Entree pour fermer..."
