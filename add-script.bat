@echo off
setlocal enabledelayedexpansion

set "file=index.html"
set "tempfile=temp_index.html"
set "scriptToAdd=  ^<script src='debug-animation.js'^>^</script^>"

REM Copier le contenu jusqu'à la ligne avant </body>
findstr /n "^" "%file%" > temp_lines.txt
set "found=0"

for /f "tokens=1* delims=:" %%a in (temp_lines.txt) do (
    set "line=%%b"
    if "!line!"=="</body>" (
        echo %scriptToAdd% >> "%tempfile%"
        echo !line! >> "%tempfile%"
        set "found=1"
    ) else (
        echo !line! >> "%tempfile%"
    )
)

if %found%==1 (
    move /y "%tempfile%" "%file%" >nul
    echo Script ajouté avec succès
) else (
    del "%tempfile%" >nul 2>&1
    echo Balise </body> non trouvée
)

del temp_lines.txt >nul 2>&1
