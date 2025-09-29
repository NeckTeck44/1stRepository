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

if (!(Test-Path ".\node_modules\concurrently")) {
  Write-Host "Installation de concurrently..."
  npm install concurrently --save-dev
}

# Nettoyage du cache Vite
if (Test-Path ".\client\.vite") {
  Write-Host "Nettoyage du cache Vite..."
  Remove-Item -Recurse -Force ".\client\.vite"
}

# Tuer les processus sur le port 5000
Write-Host "Vérification des processus sur le port 5000..."
$processes = netstat -ano | findstr ":5000"
if ($processes) {
  Write-Host "Processus trouvés sur le port 5000 :"
  Write-Host $processes
  $processIds = $processes | ForEach-Object { if ($_ -match '\s+(\d+)\s*$') { $matches[1] } } | Select-Object -Unique
  if ($processIds) {
    Write-Host "Arrêt des processus avec PIDs : $processIds"
    foreach ($processId in $processIds) {
      try {
        Stop-Process -Id $processId -Force
        Write-Host "Processus $processId arrêté"
      } catch {
        Write-Host "Impossible d'arrêter le processus $processId"
      }
    }
    Start-Sleep -Seconds 2
  }
} else {
  Write-Host "Aucun processus trouvé sur le port 5000"
}

# Lancer Express + Vite
Write-Host "Lancement du projet Alegria..."
npx tsx start.ts

Stop-Transcript
Write-Host "`nAppuyez sur Entrée pour fermer..."
Read-Host