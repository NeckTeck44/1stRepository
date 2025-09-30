# Lancer le projet Alegria en mode PRODUCTION
# Configuration de l'environnement
$env:PYTHONIOENCODING = "utf-8"
$env:NODE_ENV = "production"

# Creer le repertoire de logs si necessaire
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
}

# Utiliser un fichier de log unique avec timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "$PSScriptRoot\logs\prod_$timestamp.txt"

Write-Host "Transcription demarree, le fichier de sortie est $logFile"
Add-Content -Path $logFile -Value "===== Lancement du projet Alegria en PRODUCTION - $(Get-Date) ====="

Set-Location -Path "$PSScriptRoot"

Write-Host " Lancement du projet Alegria en mode PRODUCTION..." -ForegroundColor Green
Add-Content -Path $logFile -Value "Lancement du projet Alegria en mode PRODUCTION..."

# Verifier et installer les dependances backend si necessaire
if (Test-Path ".\package.json") {
    $shouldInstallBackend = $false
    
    # Verifier si node_modules existe
    if (!(Test-Path ".\node_modules")) {
        Write-Host " Dossier node_modules manquant, installation des dependances backend..." -ForegroundColor Yellow
        Add-Content -Path $logFile -Value "Dossier node_modules manquant, installation des dependances backend..."
        $shouldInstallBackend = $true
    }
    else {
        # Verifier si les dependances principales sont installees
        try {
            $packageJson = Get-Content ".\package.json" | ConvertFrom-Json
            $missingDeps = @()
            
            if ($packageJson.dependencies) {
                foreach ($dep in $packageJson.dependencies.PSObject.Properties.Name) {
                    if (!(Test-Path ".\node_modules\$dep")) {
                        $missingDeps += $dep
                    }
                }
            }
            
            if ($missingDeps.Count -gt 0) {
                Write-Host " Dependance manquantes detectees : $($missingDeps -join ', ')" -ForegroundColor Yellow
                Write-Host " Installation des dependances backend..." -ForegroundColor Yellow
                Add-Content -Path $logFile -Value "Dependance manquantes detectees : $($missingDeps -join ', ')"
                Add-Content -Path $logFile -Value "Installation des dependances backend..."
                $shouldInstallBackend = $true
            }
        }
        catch {
            Write-Host " Erreur lors de la lecture du package.json, installation des dependances..." -ForegroundColor Yellow
            Add-Content -Path $logFile -Value "Erreur lors de la lecture du package.json, installation des dependances..."
            $shouldInstallBackend = $true
        }
    }
    
    if ($shouldInstallBackend) {
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host " Erreur lors de l'installation des dependances backend !" -ForegroundColor Red
            Add-Content -Path $logFile -Value "Erreur lors de l'installation des dependances backend !"
            Write-Host "`nAppuyez sur Entree pour fermer..."
            Read-Host
            exit 1
        }
        Write-Host " Dependances backend installees avec succes !" -ForegroundColor Green
        Add-Content -Path $logFile -Value "Dependances backend installees avec succes !"
    }
    else {
        Write-Host " Dependances backend deja a jour" -ForegroundColor Cyan
        Add-Content -Path $logFile -Value "Dependances backend deja a jour"
    }
}

# Demander a l'utilisateur s'il veut forcer un rebuild clean
$forceRebuild = Read-Host "Forcer un rebuild complet ? (O/N) [defaut: N]"
Add-Content -Path $logFile -Value "Rebuild force demande : $forceRebuild"
if ($forceRebuild -match "^[OoYy]$") {
    Write-Host " Nettoyage complet avant rebuild..." -ForegroundColor Yellow
    Add-Content -Path $logFile -Value "Nettoyage complet avant rebuild..."
    if (Test-Path ".\client\dist") {
        Remove-Item -Recurse -Force ".\client\dist" -ErrorAction SilentlyContinue
    }
    if (Test-Path ".\client\.vite") {
        Remove-Item -Recurse -Force ".\client\.vite" -ErrorAction SilentlyContinue
    }
    if (Test-Path ".\client\node_modules") {
        Remove-Item -Recurse -Force ".\client\node_modules" -ErrorAction SilentlyContinue
    }
}

# Verifier si le build existe deja
if (!(Test-Path ".\client\dist\index.html")) {
    Write-Host " Build du frontend requis..." -ForegroundColor Yellow
    Add-Content -Path $logFile -Value "Build du frontend requis..."
    
    # Installer les dependances frontend si necessaire
    if (!(Test-Path ".\client\node_modules")) {
        Write-Host " Installation des dependances frontend..."
        Add-Content -Path $logFile -Value "Installation des dependances frontend..."
        npm --prefix client install
        if ($LASTEXITCODE -ne 0) {
            Write-Host " Erreur lors de l'installation des dependances frontend !" -ForegroundColor Red
            Add-Content -Path $logFile -Value "Erreur lors de l'installation des dependances frontend !"
            Write-Host "`nAppuyez sur Entree pour fermer..."
            Read-Host
            exit 1
        }
    }
    
    # Verifier specifiquement que vite est installe
    if (!(Test-Path ".\client\node_modules\.bin\vite*")) {
        Write-Host "Vite non detecte, nettoyage du cache et installation specifique..." -ForegroundColor Yellow
        Add-Content -Path $logFile -Value "Vite non detecte, nettoyage du cache et installation specifique..."
        
        # Nettoyer le cache Vite corrompu
        if (Test-Path ".\client\.vite") {
            Remove-Item -Recurse -Force ".\client\.vite" -ErrorAction SilentlyContinue
        }
        if (Test-Path ".\client\node_modules\.vite-temp") {
            Remove-Item -Recurse -Force ".\client\node_modules\.vite-temp" -ErrorAction SilentlyContinue
        }
        
        # Forcer la reinstallation de Vite
        npm --prefix client install vite@7.1.7 --save-dev --force
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Erreur lors de l'installation de vite !" -ForegroundColor Red
            Add-Content -Path $logFile -Value "Erreur lors de l'installation de vite !"
            Write-Host "`nAppuyez sur Entree pour fermer..."
            Read-Host
            exit 1
        }
        Write-Host "Vite installe avec succes !" -ForegroundColor Green
        Add-Content -Path $logFile -Value "Vite installe avec succes !"
    }
    
    # Build du frontend
    Write-Host " Build du frontend en cours..."
    Add-Content -Path $logFile -Value "Build du frontend en cours..."
    Set-Location client
    npm run build
    $buildSuccess = $LASTEXITCODE -eq 0
    Set-Location ..
    
    if ($buildSuccess -and (Test-Path ".\client\dist\index.html")) {
        Write-Host " Build reussi !" -ForegroundColor Green
        Add-Content -Path $logFile -Value "Build reussi !"
    }
    else {
        Write-Host " Erreur lors du build !" -ForegroundColor Red
        Add-Content -Path $logFile -Value "Erreur lors du build !"
        Write-Host "`nAppuyez sur Entree pour fermer..."
        Read-Host
        exit 1
    }
}
else {
    Write-Host " Build deja existant, utilisation de la version actuelle" -ForegroundColor Cyan
    Add-Content -Path $logFile -Value "Build deja existant, utilisation de la version actuelle"
}

# Nettoyage du cache si necessaire
if (Test-Path ".\client\.vite") {
    Write-Host " Nettoyage du cache Vite..."
    Add-Content -Path $logFile -Value "Nettoyage du cache Vite..."
    Remove-Item -Recurse -Force ".\client\.vite" -ErrorAction SilentlyContinue
}

# Lancer le serveur en mode production sur le port 5000
$port = 5000
Write-Host " Demarrage du serveur PRODUCTION sur le port $port..." -ForegroundColor Green
Add-Content -Path $logFile -Value "Demarrage du serveur PRODUCTION sur le port $port..."

# Fonction pour arreter le processus utilisant le port 5000
function Stop-ProcessOnPort {
    param([int]$port)
    
    try {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connections) {
            foreach ($conn in $connections) {
                $processId = $conn.OwningProcess
                $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Host " Arret du processus $($process.Name) (PID: $($process.Id)) utilisant le port $port..." -ForegroundColor Yellow
                    Add-Content -Path $logFile -Value "Arret du processus $($process.Name) (PID: $($process.Id)) utilisant le port $port..."
                    Stop-Process -Id $process.Id -Force
                    Start-Sleep -Seconds 1
                    return $true
                }
            }
        }
    }
    catch {
        Add-Content -Path $logFile -Value "Erreur lors de l'arret du processus sur le port $port : $_"
    }
    return $false
}

# Verifier si le port est utilise et tuer le processus si necessaire
$netstatResult = netstat -ano | findstr ":$port"
if ($netstatResult -and $netstatResult -match "LISTENING") {
    Write-Host "  Le port $port est deja utilise. Tentative de liberation automatique..." -ForegroundColor Yellow
    Add-Content -Path $logFile -Value "Le port $port est deja utilise. Tentative de liberation automatique..."
    $killed = Stop-ProcessOnPort -port $port
    if ($killed) {
        Write-Host " Port libere avec succes !" -ForegroundColor Green
        Add-Content -Path $logFile -Value "Port libere avec succes !"
        Start-Sleep -Seconds 2
    }
    else {
        Write-Host " Impossible de liberer le port automatiquement. Veuillez le faire manuellement." -ForegroundColor Red
        Add-Content -Path $logFile -Value "Impossible de liberer le port automatiquement. Veuillez le faire manuellement."
        Write-Host "`nAppuyez sur Entree pour fermer..."
        Read-Host
        exit 1
    }
}

try {
    npx tsx start.ts
}
catch {
    Write-Host " Erreur lors du demarrage du serveur : $_" -ForegroundColor Red
    Add-Content -Path $logFile -Value "Erreur lors du demarrage du serveur : $_"
}

Add-Content -Path $logFile -Value "===== Fin de session PRODUCTION - $(Get-Date) ====="
Write-Host "`nAppuyez sur Entree pour fermer..."
Add-Content -Path $logFile -Value "Appuyez sur Entree pour fermer..."
Read-Host
