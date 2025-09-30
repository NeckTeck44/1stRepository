[Diagnostics.CodeAnalysis.SuppressMessageAttribute('PSReviewUnusedParameter', '', Justification = 'Script-level parameters are consumed later in the script')]
[Diagnostics.CodeAnalysis.SuppressMessageAttribute('PSUseBOMForUnicodeEncodedFile', '', Justification = 'Project uses UTF-8 (no BOM); hosts support it')]
[Diagnostics.CodeAnalysis.SuppressMessageAttribute('PSAvoidUsingWriteHost', '', Justification = 'Write-Host is used intentionally for colored help examples at the end of the script')]
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

function Invoke-GitCommand([string[]]$GitArgs, [switch]$IgnoreError) {
    if (-not $GitArgs -or $GitArgs.Count -eq 0) {
        throw "Invoke-GitCommand called with no arguments"
    }
    if ($GitArgs -contains $null) {
        throw "Invoke-GitCommand arguments contain a null element: " + ($GitArgs | ForEach-Object { if ($_) { $_ } else { '<null>' } } | Out-String)
    }
    $display = "git " + ($GitArgs -join ' ')
    Write-Info $display
    & git @GitArgs
    $exit = $LASTEXITCODE
    if ($exit -ne 0 -and -not $IgnoreError) {
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
    Invoke-GitCommand @('init')
    Invoke-GitCommand @('branch', '-M', $Branch)
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
catch {
    # Silencieux : si git remote get-url échoue, c'est normal (remote n'existe pas)
    # On ne veut pas interrompre le script pour cette erreur attendue
    Write-Verbose "Remote 'origin' non trouvé (attendu si dépôt non configuré)"
}
if ([string]::IsNullOrWhiteSpace($RepoUrl)) {
    if (-not $remoteExists) { Write-Warn "Aucun RepoUrl fourni et aucun remote 'origin' existant. Le push sera ignoré." }
}
else {
    if ($remoteExists) {
        if ($ForceRemote) { Invoke-GitCommand @('remote', 'remove', 'origin') -IgnoreError; Invoke-GitCommand @('remote', 'add', 'origin', $RepoUrl) }
        else { Write-Info "Remote 'origin' déjà configuré: $currentRemote (utilisez -ForceRemote pour le remplacer)" }
    }
    else { Invoke-GitCommand @('remote', 'add', 'origin', $RepoUrl) }
}

# --- Commit ---
# Se placer/créer la branche cible puis autoriser un commit vide
Invoke-GitCommand @('checkout', '-B', $Branch)
Invoke-GitCommand @('add', '.')
Invoke-GitCommand @('commit', '-m', $Message, '--allow-empty') -IgnoreError
Write-Ok "Commit effectué (ou aucun changement à committer)"

# --- Push ---
if (-not [string]::IsNullOrWhiteSpace($RepoUrl) -or $remoteExists) {
    Invoke-GitCommand @('push', '-u', 'origin', $Branch)
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
        Invoke-GitCommand @('tag', '-a', $Tag, '-m', $Message)
        Write-Ok "Tag créé: $Tag"
    }
    if (-not [string]::IsNullOrWhiteSpace($RepoUrl) -or $remoteExists) {
        Invoke-GitCommand @('push', 'origin', $Tag)
        Write-Ok "Tag poussé: $Tag"
    }
    else {
        Write-Warn "Pas de remote 'origin'. Étape push du tag ignorée."
    }
}

Write-Ok "Terminé."
Write-Information "\nExemples d'utilisation:"
Write-Information "  1) Nouveau dépôt + push + tag:"
Write-Information "     .\\git-snapshot.ps1 -RepoUrl https://github.com/<user>/<repo>.git -Branch main -Tag v0.1-snapshot -Message 'Snapshot stable'"
Write-Information "  2) Dépôt déjà initialisé, juste snapshot + tag:"
Write-Information "     .\\git-snapshot.ps1 -Tag v0.2-snapshot -Message 'Avant refonte UI'"
Write-Information "  3) Remplacer le remote origin:"
Write-Information "     .\\git-snapshot.ps1 -RepoUrl https://github.com/<user>/<repo>.git -ForceRemote"
