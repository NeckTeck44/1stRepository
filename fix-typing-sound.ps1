# Script PowerShell pour restaurer les améliorations du son de typing
# Ce script va modifier le fichier index.html pour ajouter les fonctionnalités manquantes

$filePath = "c:\Users\catel\Downloads\Portfolio Alegria - Candidature Formation\client\index.html"

# Lire le contenu du fichier
$content = Get-Content -Path $filePath -Raw

Write-Host "🔧 Application des corrections du son de typing..." -ForegroundColor Yellow

# 1. Corriger la vitesse de lecture de 1.20 à 1.35
$content = $content -replace 'const playbackRate = 1\.20;.*', 'const playbackRate = 1.35; // Vitesse de lecture 1.35x pour un effet plus dynamique'
Write-Host "✅ Vitesse de lecture corrigée à 1.35x" -ForegroundColor Green

# 2. Ajouter la fonction preloadTypingSound() après la configuration du son
$preloadFunction = @'

        // Fonction pour précharger le son de frappe
        function preloadTypingSound() {
          console.log('🔊 Préchargement du son de frappe...');
          
          try {
            // Créer l'AudioContext si nécessaire
            if (!typingAudioContext) {
              typingAudioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            // Réactiver le contexte s'il est en état suspendu
            if (typingAudioContext.state === 'suspended') {
              typingAudioContext.resume();
            }
            
            // Créer et précharger l'élément audio
            if (!typingAudio) {
              typingAudio = new Audio(currentTypingSound);
              typingAudio.volume = 0.3;
              typingAudio.playbackRate = playbackRate;
              
              // Précharger le son
              typingAudio.load();
              
              // Connecter la source audio si nécessaire
              if (typingAudioContext) {
                typingAudioSource = typingAudioContext.createMediaElementSource(typingAudio);
                typingAudioSource.connect(typingAudioContext.destination);
              }
              
              console.log('✅ Son de frappe préchargé avec succès');
            }
          } catch (error) {
            console.log('❌ Erreur lors du préchargement du son:', error);
          }
        }

'@

# Insérer la fonction après la configuration du son
$content = $content -replace '(const playbackRate = 1\.35;.*\n)', "`$1$preloadFunction"
Write-Host "✅ Fonction preloadTypingSound() ajoutée" -ForegroundColor Green

# 3. Ajouter le préchargement 50ms après le chargement de la page
$preloadInitial = @'

        // Préchargement initial du son de frappe 50ms après le chargement de la page
        setTimeout(() => {
          console.log('⏰ Préchargement initial du son de frappe (50ms après chargement)');
          preloadTypingSound();
        }, 50);

'@

# Trouver où insérer ce code (après la déclaration des variables globales)
$content = $content -replace '(let typingAudioSource = null;\n)', "`$1$preloadInitial"
Write-Host "✅ Préchargement initial ajouté" -ForegroundColor Green

# 4. Ajouter le préchargement dans le premier gestionnaire de clic
# Trouver le gestionnaire de clic existant et ajouter le préchargement
$clickHandlerPattern = '(document\.addEventListener\("click", function firstUserClick\(\) \{[^}]*)(\}\s*,\s*\{ once: true \}\);)'
$clickHandlerReplacement = "`$1          // Préchargement du son au premier clic          setTimeout(() => {            console.log('👤 Préchargement du son au premier clic');            preloadTypingSound();          }, 10);        `$2"
$content = $content -replace $clickHandlerPattern, $clickHandlerReplacement
Write-Host "✅ Préchargement au premier clic ajouté" -ForegroundColor Green

# 5. Ajouter le préchargement dans le premier gestionnaire de scroll
$scrollHandlerPattern = '(document\.addEventListener\("scroll", function firstUserScroll\(\) \{[^}]*)(\}\s*,\s*\{ once: true \}\);)'
$scrollHandlerReplacement = "`$1          // Préchargement du son au premier scroll          setTimeout(() => {            console.log('👤 Préchargement du son au premier scroll');            preloadTypingSound();          }, 10);        `$2"
$content = $content -replace $scrollHandlerPattern, $scrollHandlerReplacement
Write-Host "✅ Préchargement au premier scroll ajouté" -ForegroundColor Green

# Écrire le contenu modifié dans le fichier
$content | Set-Content -Path $filePath -Encoding UTF8

Write-Host "🎉 Toutes les améliorations du son de typing ont été restaurées !" -ForegroundColor Cyan
Write-Host "📁 Fichier modifié: $filePath" -ForegroundColor White
Write-Host "🔍 Vérifiez la console du navigateur pour voir les messages de préchargement" -ForegroundColor Yellow
