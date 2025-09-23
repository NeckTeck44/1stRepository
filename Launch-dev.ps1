# Lancer le projet Alegria (Express + Vite)
Start-Transcript -Path "$PSScriptRoot\log.txt" -Append

Set-Location -Path "$PSScriptRoot"

# Installer les dépendances backend
if ((Test-Path ".\package.json") -and !(Test-Path ".\node_modules")) {
  Write-Host "Installation des dépendances backend..."
  npm install
}

# Installer les dépendances frontend
if (!(Test-Path ".\client\node_modules")) {
  Write-Host "Installation des dépendances frontend..."
  npm --prefix client install
}

# Installer concurrently si absent
if (!(Test-Path ".\node_modules\concurrently")) {
  Write-Host "Installation de concurrently..."
  npm install concurrently --save-dev
}

# Nettoyage du cache Vite
if (Test-Path ".\client\.vite") {
  Write-Host "Nettoyage du cache Vite..."
  Remove-Item -Recurse -Force ".\client\.vite"
}

# Lancer Express + Vite
Write-Host "Lancement du projet Alegria..."
npx tsx start.ts

Stop-Transcript
Write-Host "`nAppuyez sur Entrée pour fermer..."
Read-Host