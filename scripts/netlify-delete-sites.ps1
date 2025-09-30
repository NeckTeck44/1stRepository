#!/usr/bin/env pwsh

# Script pour supprimer les projets Netlify en trop
# Auteur: Cascade AI Assistant
# Date: $(Get-Date -Format "dd/MM/yyyy")

Write-Host "Suppression des projets Netlify en trop..." -ForegroundColor Green

# Verifier la connexion Netlify
Write-Host "Verification de la connexion Netlify..." -ForegroundColor Yellow
netlify status

if ($LASTEXITCODE -ne 0) {
    Write-Host "Veuillez vous connecter a Netlify d'abord !" -ForegroundColor Red
    netlify login
    exit
}

# Lister tous les projets
Write-Host "Liste de vos projets Netlify :" -ForegroundColor Yellow
$sites = netlify sites:list --json | ConvertFrom-Json

if ($sites.Count -le 1) {
    Write-Host "Vous n'avez qu'un seul projet ou aucun. Rien a supprimer." -ForegroundColor Green
    Read-Host "`nAppuyez sur Entree pour fermer..."
    exit
}

# Afficher les projets
for ($i = 0; $i -lt $sites.Count; $i++) {
    Write-Host "$($i+1). $($sites[$i].name) - $($sites[$i].url)" -ForegroundColor Cyan
}

# Demander lesquels supprimer
Write-Host "`nQuels projets voulez-vous SUPPRIMER ?" -ForegroundColor Yellow
Write-Host "Entrez les numeros separes par des virgules (ex: 2,4,6)" -ForegroundColor Yellow
Write-Host "Laissez vide ou entrez 0 pour ne supprimer aucun projet" -ForegroundColor Yellow
$choices = Read-Host "Projets a supprimer"

# Si l'utilisateur ne veut rien supprimer
if ([string]::IsNullOrWhiteSpace($choices) -or $choices -eq "0") {
    Write-Host "Aucun projet ne sera supprime." -ForegroundColor Green
    Read-Host "`nAppuyez sur Entree pour fermer..."
    exit
}

# Convertir les choix en indices
$deleteIndices = @()
$choiceArray = $choices -split ',' | ForEach-Object { $_.Trim() }

foreach ($choice in $choiceArray) {
    if ($choice -match '^\d+$' -and [int]$choice -ge 1 -and [int]$choice -le $sites.Count) {
        $index = [int]$choice - 1
        if ($deleteIndices -notcontains $index) {
            $deleteIndices += $index
        }
    }
}

if ($deleteIndices.Count -gt 0) {
    Write-Host "`nVous allez supprimer les projets suivants :" -ForegroundColor Red
    foreach ($index in $deleteIndices) {
        Write-Host "- $($sites[$index].name) - $($sites[$index].url)" -ForegroundColor Red
    }
    
    $keepCount = $sites.Count - $deleteIndices.Count
    Write-Host "`n$keepCount projets seront conserves." -ForegroundColor Green
    
    $confirmation = Read-Host "Confirmer la suppression de ces projets ? (O/N)"
    
    if ($confirmation -eq "O" -or $confirmation -eq "o") {
        foreach ($index in $deleteIndices) {
            $siteToDelete = $sites[$index]
            Write-Host "Suppression de $($siteToDelete.name) - $($siteToDelete.url)..." -ForegroundColor Red
            netlify sites:delete $siteToDelete.id --force
        }
        
        Write-Host "`nSuppression terminee !" -ForegroundColor Green
        Write-Host "$keepCount projets conserves." -ForegroundColor Green
    } else {
        Write-Host "Operation annulee." -ForegroundColor Yellow
    }
} else {
    Write-Host "Aucun choix valide." -ForegroundColor Red
}

# Afficher les projets restants
Write-Host "`nProjets restants :" -ForegroundColor Yellow
netlify sites:list

Read-Host "`nAppuyez sur Entree pour fermer..."
