# Lancer le projet Alegria en mode PRODUCTION
Start-Transcript -Path "$PSScriptRoot\log-prod.txt" -Append

Set-Location -Path "$PSScriptRoot"

Write-Host " Lancement du projet Alegria en mode PRODUCTION..." -ForegroundColor Green

# Vérifier et installer les dépendances backend si nécessaire
if (Test-Path ".\package.json") {
    $shouldInstallBackend = $false
    
    # Vérifier si node_modules existe
    if (!(Test-Path ".\node_modules")) {
        Write-Host " Dossier node_modules manquant, installation des dépendances backend..." -ForegroundColor Yellow
        $shouldInstallBackend = $true
    }
    else {
        # Vérifier si les dépendances principales sont installées
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
                Write-Host " Dépendances manquantes détectées : $($missingDeps -join ', ')" -ForegroundColor Yellow
                Write-Host " Installation des dépendances backend..." -ForegroundColor Yellow
                $shouldInstallBackend = $true
            }
        }
        catch {
            Write-Host " Erreur lors de la lecture du package.json, installation des dépendances..." -ForegroundColor Yellow
            $shouldInstallBackend = $true
        }
    }
    
    if ($shouldInstallBackend) {
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Erreur lors de l'installation des dépendances backend !" -ForegroundColor Red
            Stop-Transcript
            Write-Host "`nAppuyez sur Entree pour fermer..."
            Read-Host
            exit 1
        }
        Write-Host "✅ Dépendances backend installées avec succès !" -ForegroundColor Green
    }
    else {
        Write-Host "✅ Dépendances backend déjà à jour" -ForegroundColor Cyan
    }
}

# Demander à l'utilisateur s'il veut forcer un rebuild clean
$forceRebuild = Read-Host "Forcer un rebuild complet ? (O/N) [défaut: N]"
if ($forceRebuild -match "^[OoYy]$") {
    Write-Host " Nettoyage complet avant rebuild..." -ForegroundColor Yellow
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

# Vérifier si le build existe déjà
if (!(Test-Path ".\client\dist\index.html")) {
    Write-Host " Build du frontend requis..." -ForegroundColor Yellow
    
    # Installer les dépendances frontend si nécessaire
    if (!(Test-Path ".\client\node_modules")) {
        Write-Host " Installation des dépendances frontend..."
        npm --prefix client install
        if ($LASTEXITCODE -ne 0) {
            Write-Host " Erreur lors de l'installation des dépendances frontend !" -ForegroundColor Red
            Stop-Transcript
            Write-Host "`nAppuyez sur Entree pour fermer..."
            Read-Host
            exit 1
        }
    }
    
    # Vérifier spécifiquement que vite est installé
    if (!(Test-Path ".\client\node_modules\.bin\vite*")) {
        Write-Host "Vite non detecte, nettoyage du cache et installation specifique..." -ForegroundColor Yellow
        
        # Nettoyer le cache Vite corrompu
        if (Test-Path ".\client\.vite") {
            Remove-Item -Recurse -Force ".\client\.vite" -ErrorAction SilentlyContinue
        }
        if (Test-Path ".\client\node_modules\.vite-temp") {
            Remove-Item -Recurse -Force ".\client\node_modules\.vite-temp" -ErrorAction SilentlyContinue
        }
        
        # Forcer la réinstallation de Vite
        npm --prefix client install vite@7.1.7 --save-dev --force
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Erreur lors de l'installation de vite !" -ForegroundColor Red
            Stop-Transcript
            Write-Host "`nAppuyez sur Entree pour fermer..."
            Read-Host
            exit 1
        }
        Write-Host "Vite installe avec succes !" -ForegroundColor Green
    }
    
    # Build du frontend
    Write-Host " Build du frontend en cours..."
    Set-Location client
    npm run build
    $buildSuccess = $LASTEXITCODE -eq 0
    Set-Location ..
    
    if ($buildSuccess -and (Test-Path ".\client\dist\index.html")) {
        Write-Host " Build réussi !" -ForegroundColor Green
    }
    else {
        Write-Host " Erreur lors du build !" -ForegroundColor Red
        Stop-Transcript
        Write-Host "`nAppuyez sur Entree pour fermer..."
        Read-Host
        exit 1
    }
}
else {
    Write-Host " Build déjà existant, utilisation de la version actuelle" -ForegroundColor Cyan
}

# Nettoyage du cache si nécessaire
if (Test-Path ".\client\.vite") {
    Write-Host " Nettoyage du cache Vite..."
    Remove-Item -Recurse -Force ".\client\.vite" -ErrorAction SilentlyContinue
}

# Lancer le serveur en mode production sur le port 5000
$port = 5000
Write-Host " Démarrage du serveur PRODUCTION sur le port $port..." -ForegroundColor Green

# Fonction pour arrêter le processus utilisant le port 5000
function Stop-ProcessOnPort {
    param([int]$port)
    
    try {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connections) {
            foreach ($conn in $connections) {
                $processId = $conn.OwningProcess
                $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Host " Arrêt du processus $($process.Name) (PID: $($process.Id)) utilisant le port $port..." -ForegroundColor Yellow
                    Stop-Process -Id $process.Id -Force
                    Start-Sleep -Seconds 1
                    return $true
                }
            }
        }
    }
    catch {
        # Erreur silencieuse
    }
    return $false
}

# Vérifier si le port est utilisé et tuer le processus si nécessaire
$netstatResult = netstat -ano | findstr ":$port"
if ($netstatResult -and $netstatResult -match "LISTENING") {
    Write-Host "  Le port $port est déjà utilisé. Tentative de libération automatique..." -ForegroundColor Yellow
    $killed = Stop-ProcessOnPort -port $port
    if ($killed) {
        Write-Host " Port libéré avec succès !" -ForegroundColor Green
        Start-Sleep -Seconds 2
    }
    else {
        Write-Host " Impossible de libérer le port automatiquement. Veuillez le faire manuellement." -ForegroundColor Red
        Stop-Transcript
        Write-Host "`nAppuyez sur Entree pour fermer..."
        Read-Host
        exit 1
    }
}

$env:NODE_ENV = "production"
try {
    npx tsx start.ts
}
catch {
    Write-Host " Erreur lors du démarrage du serveur : $_" -ForegroundColor Red
}

Stop-Transcript
Write-Host "`nAppuyez sur Entree pour fermer..."
Read-Host



