@echo off
chcp 65001 >nul
set PYTHONIOENCODING=utf-8
set NODE_ENV=development

:: Créer le répertoire de logs si nécessaire
if not exist "logs" mkdir logs

:: Démarrer la transcription
echo Transcription demarree, le fichier de sortie est %~dp0log.txt
echo. >> log.txt
echo ===== Lancement du projet Alegria - %date% %time% ===== >> log.txt

:: Se déplacer dans le répertoire du script
cd /d "%~dp0"

:: Installer les dépendances backend
if exist "package.json" (
    if not exist "node_modules" (
        echo Installation des dependances backend...
        echo Installation des dependances backend... >> log.txt
        npm install
    )
)

:: Installer les dépendances frontend
if not exist "client\node_modules" (
    echo Installation des dependances frontend...
    echo Installation des dependances frontend... >> log.txt
    npm --prefix client install
)

:: Installer concurrently si nécessaire
if not exist "node_modules\concurrently" (
    echo Installation de concurrently...
    echo Installation de concurrently... >> log.txt
    npm install concurrently --save-dev
)

:: Nettoyage du cache Vite
if exist "client\.vite" (
    echo Nettoyage du cache Vite...
    echo Nettoyage du cache Vite... >> log.txt
    rmdir /s /q "client\.vite"
)

:: Tuer les processus sur le port 5000
echo Verification des processus sur le port 5000...
echo Verification des processus sur le port 5000... >> log.txt

set found_processes=0
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000" ^| findstr "LISTENING"') do (
    set found_processes=1
    echo Processus trouves sur le port 5000 :
    echo Processus trouves sur le port 5000 : >> log.txt
    netstat -ano ^| findstr ":5000" ^| findstr "LISTENING"
    echo Arret des processus avec PIDs : %%a
    echo Arret des processus avec PIDs : %%a >> log.txt
    taskkill /F /PID %%a >nul 2>&1
    if !errorlevel! equ 0 (
        echo Processus %%a arrete
        echo Processus %%a arrete >> log.txt
    ) else (
        echo Impossible d'arreter le processus %%a
        echo Impossible d'arreter le processus %%a >> log.txt
    )
)

if %found_processes% equ 0 (
    echo Aucun processus trouve sur le port 5000
    echo Aucun processus trouve sur le port 5000 >> log.txt
)

timeout /t 2 /nobreak >nul

:: Lancer Express + Vite
echo Lancement du projet Alegria...
echo Lancement du projet Alegria... >> log.txt

:: Exécuter le serveur et capturer la sortie
echo Serveur en cours d'execution...
:server_loop
npx tsx start.ts
if %errorlevel% neq 0 (
    echo Erreur lors du lancement du projet. Nouvelle tentative dans 5 secondes...
    echo Erreur lors du lancement du projet. Nouvelle tentative dans 5 secondes... >> log.txt
    timeout /t 5 /nobreak >nul
    goto server_loop
)

echo.
echo Appuyez sur une touche pour fermer...
echo Appuyez sur une touche pour fermer... >> log.txt
pause >nul

echo ===== Fin de session - %date% %time% ===== >> log.txt
echo Session terminee. >> log.txt
