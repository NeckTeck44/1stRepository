#!/usr/bin/env pwsh

# Script de deploiement Netlify pour le portfolio Alegria
# Auteur: Cascade AI Assistant
# Date: $(Get-Date -Format "dd/MM/yyyy")

Write-Host "Deploiement Netlify en cours..." -ForegroundColor Green

# Verifier si Netlify CLI est installe
if (-not (Get-Command netlify -ErrorAction SilentlyContinue)) {
    Write-Host "Installation de Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
}

# Se connecter a Netlify si necessaire
Write-Host "Verification de la connexion Netlify..." -ForegroundColor Yellow
netlify login

# Construire le projet
Write-Host "Construction du projet..." -ForegroundColor Yellow
cd client
npm ci
npm run build
cd ..

# Deployer sur Netlify
Write-Host "Deploiement sur Netlify..." -ForegroundColor Yellow
netlify deploy --prod

Write-Host "Deploiement termine !" -ForegroundColor Green
Read-Host "`nAppuyez sur Entree pour fermer..."
