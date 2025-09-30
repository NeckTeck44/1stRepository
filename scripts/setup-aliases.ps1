# Script pour configurer des alias PowerShell pour les scripts du projet
# Exécuter une fois: .\setup-aliases.ps1

Write-Host "Configuration des alias pour les scripts du projet..." -ForegroundColor Green

# Créer les alias
Set-Alias -Name "git-auto" -Value "./scripts/git-auto.ps1"
Set-Alias -Name "git-push" -Value "./scripts/git-push.ps1" 
Set-Alias -Name "git-snapshot" -Value "./scripts/git-snapshot.ps1"
Set-Alias -Name "launch-dev" -Value "./scripts/launch-dev.ps1"
Set-Alias -Name "launch-prod" -Value "./scripts/launch-prod.ps1"
Set-Alias -Name "netlify-deploy" -Value "./scripts/netlify-deploy.ps1"
Set-Alias -Name "cleanup" -Value "./scripts/cleanup-temp-files.ps1"
Set-Alias -Name "show-urls" -Value "./scripts/show-urls.ps1"

Write-Host "Alias configurés !" -ForegroundColor Green
Write-Host "Vous pouvez maintenant utiliser:" -ForegroundColor Yellow
Write-Host "  git-auto, git-push, git-snapshot" -ForegroundColor Cyan
Write-Host "  launch-dev, launch-prod" -ForegroundColor Cyan
Write-Host "  netlify-deploy, cleanup, show-urls" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: Ces alias ne sont valables que pour la session PowerShell actuelle." -ForegroundColor Red
Write-Host "Pour les rendre permanents, ajoutez-les à votre profil PowerShell:" -ForegroundColor Red
Write-Host "  notepad \$PROFILE" -ForegroundColor Red
