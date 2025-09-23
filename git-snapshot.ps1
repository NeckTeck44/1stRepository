[Diagnostics.CodeAnalysis.SuppressMessageAttribute('PSReviewUnusedParameter','', Justification='Script-level parameters are consumed later in the script')]
[Diagnostics.CodeAnalysis.SuppressMessageAttribute('PSUseBOMForUnicodeEncodedFile','', Justification='Project uses UTF-8 (no BOM); hosts support it')]
param(
    [string]$RepoUrl = "",
    [string]$Branch = "main",
    [string]$Tag = "",
    [string]$Message = "Snapshot stable avant nouvelles modifs",
    [switch]$ForceRemote
)

# --- Helpers ---
${InformationPreference} = 'Continue'
function Write-Info($msg) { Write-Information "[i] $msg" }
function Write-Ok($msg) { Write-Information "[OK] $msg" }
function Write-Warn($msg) { Write-Warning $msg }
function Write-Err($msg) { Write-Error $msg }

function Run-Git([string[]]$GitArgs, [switch]$IgnoreError){
    if(-not $GitArgs -or $GitArgs.Count -eq 0){
        throw "Run-Git called with no arguments"
    }
    if($GitArgs -contains $null){
        throw "Run-Git arguments contain a null element: " + ($GitArgs | ForEach-Object { if($_){ $_ } else { '<null>' } } | Out-String)
    }
    $display = "git " + ($GitArgs -join ' ')
    Write-Info $display
    & git @GitArgs
    $exit = $LASTEXITCODE
    if($exit -ne 0 -and -not $IgnoreError){
        throw "Command failed ($exit): $display"
    }
}

# --- Pre-flight ---
try { git --version | Out-Null } catch { Write-Err "Git n'est pas installé ou pas dans le PATH."; exit 1 }

# Aller dans le dossier du script (optionnel)
if ($PSScriptRoot) { Set-Location $PSScriptRoot }

# --- Init repo si nécessaire ---
$gitDir = Join-Path (Get-Location) ".git"
if (!(Test-Path $gitDir)) {
    Write-Info "Initialisation du dépôt git"
    Run-Git @('init')
    Run-Git @('branch','-M', $Branch)
}
else {
    Write-Info ".git existe déjà - dépôt détecté"
}

# --- Remote origin ---
$remoteExists = $false
try {
    $currentRemote = git remote get-url origin 2>$null
    if ($LASTEXITCODE -eq 0 -and $currentRemote) { $remoteExists = $true }
}
catch { }
if ([string]::IsNullOrWhiteSpace($RepoUrl)) {
    if (-not $remoteExists) { Write-Warn "Aucun RepoUrl fourni et aucun remote 'origin' existant. Le push sera ignoré." }
}
else {
    if ($remoteExists) {
        if ($ForceRemote) { Run-Git @('remote','remove','origin') -IgnoreError; Run-Git @('remote','add','origin', $RepoUrl) }
        else { Write-Info "Remote 'origin' déjà configuré: $currentRemote (utilisez -ForceRemote pour le remplacer)" }
    }
    else { Run-Git @('remote','add','origin', $RepoUrl) }
}

# --- Commit ---
# Se placer/créer la branche cible puis autoriser un commit vide
Run-Git @('checkout','-B', $Branch)
Run-Git @('add','.')
Run-Git @('commit','-m', $Message, '--allow-empty') -IgnoreError
Write-Ok "Commit effectué (ou aucun changement à committer)"

# --- Push ---
if (-not [string]::IsNullOrWhiteSpace($RepoUrl) -or $remoteExists) {
    Run-Git @('push','-u','origin', $Branch)
    Write-Ok "Poussé sur 'origin/$Branch'"
}
else {
    Write-Warn "Pas de remote 'origin'. Étape push ignorée."
}

# --- Tag ---
if (-not [string]::IsNullOrWhiteSpace($Tag)) {
    # Crée le tag s'il n'existe pas
    if (-not [string]::IsNullOrWhiteSpace((git tag --list $Tag | Out-String).Trim())) {
        Write-Warn "Le tag '$Tag' existe déjà localement. Il ne sera pas recréé."
    }
    else {
        Run-Git @('tag','-a', $Tag, '-m', $Message)
        Write-Ok "Tag créé: $Tag"
    }
    if (-not [string]::IsNullOrWhiteSpace($RepoUrl) -or $remoteExists) {
        Run-Git @('push','origin', $Tag)
        Write-Ok "Tag poussé: $Tag"
    }
    else {
        Write-Warn "Pas de remote 'origin'. Étape push du tag ignorée."
    }
}

Write-Ok "Terminé."
Write-Host "\nExemples d'utilisation:" -ForegroundColor DarkCyan
Write-Host "  1) Nouveau dépôt + push + tag:" -ForegroundColor DarkCyan
Write-Host "     .\\git-snapshot.ps1 -RepoUrl https://github.com/<user>/<repo>.git -Branch main -Tag v0.1-snapshot -Message 'Snapshot stable'" -ForegroundColor Gray
Write-Host "  2) Dépôt déjà initialisé, juste snapshot + tag:" -ForegroundColor DarkCyan
Write-Host "     .\\git-snapshot.ps1 -Tag v0.2-snapshot -Message 'Avant refonte UI'" -ForegroundColor Gray
Write-Host "  3) Remplacer le remote origin:" -ForegroundColor DarkCyan
Write-Host "     .\\git-snapshot.ps1 -RepoUrl https://github.com/<user>/<repo>.git -ForceRemote" -ForegroundColor Gray
