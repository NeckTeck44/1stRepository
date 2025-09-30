#!/usr/bin/env pwsh

# Script pour nettoyer les anciens deploiements Netlify
# Auteur: Cascade AI Assistant
# Date: $(Get-Date -Format "dd/MM/yyyy")

Write-Host "Nettoyage des deploiements Netlify..." -ForegroundColor Green

# Verifier la connexion Netlify
Write-Host "Verification de la connexion Netlify..." -ForegroundColor Yellow
netlify status

if ($LASTEXITCODE -ne 0) {
    Write-Host "Veuillez vous connecter a Netlify d'abord !" -ForegroundColor Red
    netlify login
    exit
}

# Lister tous les deploiements
Write-Host "Liste des deploiements actuels :" -ForegroundColor Yellow
netlify deploys:list

# Demander confirmation
Write-Host "`nATTENTION : Cette action va supprimer des deploiements !" -ForegroundColor Red
$confirmation = Read-Host "Voulez-vous continuer ? (O/N)"

if ($confirmation -eq "O" -or $confirmation -eq "o") {
    # Obtenir la liste des deploiements
    $deploys = netlify deploys:list --json | ConvertFrom-Json
    
    if ($deploys.Count -gt 1) {
        Write-Host "Suppression des anciens deploiements..." -ForegroundColor Yellow
        
        # Garder seulement le deploiement le plus recent (published)
        $latestDeploy = $deploys | Where-Object { $_.state -eq "published" } | Sort-Object -Property created_at -Descending | Select-Object -First 1
        
        foreach ($deploy in $deploys) {
            if ($deploy.id -ne $latestDeploy.id) {
                Write-Host "Suppression du deploiement $($deploy.id) ($($deploy.created_at))" -ForegroundColor Red
                netlify deploys:delete --id $deploy.id
            }
        }
        
        Write-Host "`nNettoyage termine !" -ForegroundColor Green
        Write-Host "Deploiement principal conserve : $($latestDeploy.id)" -ForegroundColor Green
    } else {
        Write-Host "Aucun deploiement supplementaire a supprimer." -ForegroundColor Green
    }
} else {
    Write-Host "Operation annulee." -ForegroundColor Yellow
}

# Afficher les deploiements restants
Write-Host "`nDeploiements restants :" -ForegroundColor Yellow
netlify deploys:list

Read-Host "`nAppuyez sur Entree pour fermer..."
