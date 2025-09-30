# Configuration de l'environnement
$env:PYTHONIOENCODING = "utf-8"
$env:NODE_ENV = "development"

# Creer le repertoire de logs si necessaire
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
}

# Utiliser un fichier de log unique avec timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "$PSScriptRoot\logs\log_$timestamp.txt"

Write-Host "Transcription demarree, le fichier de sortie est $logFile"
Add-Content -Path $logFile -Value "===== Lancement du projet Alegria - $(Get-Date) ====="

# Se deplacer dans le repertoire du script
Set-Location $PSScriptRoot

# Installer les dependances backend
if (Test-Path "package.json") {
    if (-not (Test-Path "node_modules")) {
        Write-Host "Installation des dependances backend..."
        Add-Content -Path $logFile -Value "Installation des dependances backend..."
        npm install
    }
}

# Installer les dependances frontend
if (-not (Test-Path "client\node_modules")) {
    Write-Host "Installation des dependances frontend..."
    Add-Content -Path $logFile -Value "Installation des dependances frontend..."
    npm --prefix client install
}

# Installer concurrently si necessaire
if (-not (Test-Path "node_modules\concurrently")) {
    Write-Host "Installation de concurrently..."
    Add-Content -Path $logFile -Value "Installation de concurrently..."
    npm install concurrently --save-dev
}

# Nettoyage du cache Vite
if (Test-Path "client\.vite") {
    Write-Host "Nettoyage du cache Vite..."
    Add-Content -Path $logFile -Value "Nettoyage du cache Vite..."
    Remove-Item -Path "client\.vite" -Recurse -Force
}

# Tuer les processus sur le port 5000
Write-Host "Verification des processus sur le port 5000..."
Add-Content -Path $logFile -Value "Verification des processus sur le port 5000..."

$found_processes = $false
$processes = netstat -ano | Select-String ":5000" | Select-String "LISTENING"
if ($processes) {
    $found_processes = $true
    Write-Host "Processus trouves sur le port 5000 :"
    Add-Content -Path $logFile -Value "Processus trouves sur le port 5000 :"
    $processes
    
    foreach ($line in $processes) {
        $parts = $line -split '\s+'
        $pid = $parts[-1]
        Write-Host "Arret des processus avec PIDs : $pid"
        Add-Content -Path $logFile -Value "Arret des processus avec PIDs : $pid"
        
        try {
            Stop-Process -Id $pid -Force -ErrorAction Stop
            Write-Host "Processus $pid arrete"
            Add-Content -Path $logFile -Value "Processus $pid arrete"
        } catch {
            Write-Host "Impossible d'arreter le processus $pid"
            Add-Content -Path $logFile -Value "Impossible d'arreter le processus $pid"
        }
    }
}

if (-not $found_processes) {
    Write-Host "Aucun processus trouve sur le port 5000"
    Add-Content -Path $logFile -Value "Aucun processus trouve sur le port 5000"
}

Start-Sleep -Seconds 2

# Lancer Express + Vite
Write-Host "Lancement du projet Alegria..."
Add-Content -Path $logFile -Value "Lancement du projet Alegria..."

# Executer le serveur et capturer la sortie
Write-Host "Serveur en cours d'execution..."
while ($true) {
    try {
        npx tsx start.ts
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Erreur lors du lancement du projet. Nouvelle tentative dans 5 secondes..."
            Add-Content -Path $logFile -Value "Erreur lors du lancement du projet. Nouvelle tentative dans 5 secondes..."
            Start-Sleep -Seconds 5
        } else {
            break
        }
    } catch {
        Write-Host "Erreur lors du lancement du projet. Nouvelle tentative dans 5 secondes..."
        Add-Content -Path $logFile -Value "Erreur lors du lancement du projet. Nouvelle tentative dans 5 secondes..."
        Start-Sleep -Seconds 5
    }
}

Write-Host ""
Write-Host "Appuyez sur une touche pour fermer..."
Add-Content -Path $logFile -Value "Appuyez sur une touche pour fermer..."
Read-Host | Out-Null

Add-Content -Path $logFile -Value "===== Fin de session - $(Get-Date) ====="
Add-Content -Path $logFile -Value "Session terminee."
