// Script pour restaurer les améliorations du son de typing
// Ce script doit être ajouté au fichier index.html

// 1. Corriger la vitesse de lecture à 1.35x
const correctPlaybackRate = 1.35;

// 2. Fonction preloadTypingSound() manquante
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
      typingAudio.playbackRate = correctPlaybackRate;
      
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

// 3. Appliquer la correction de vitesse dans les fonctions existantes
// Modifier playTypingSound pour utiliser la bonne vitesse
function applyTypingSoundCorrections() {
  // Corriger la vitesse dans playTypingSound
  const originalPlayTypingSound = window.playTypingSound;
  if (originalPlayTypingSound) {
    window.playTypingSound = function() {
      // Appeler la fonction originale
      originalPlayTypingSound();
      
      // Appliquer la correction de vitesse
      if (typingAudio) {
        typingAudio.playbackRate = correctPlaybackRate;
      }
    };
  }
  
  // Corriger la vitesse dans restartTypingSound
  const originalRestartTypingSound = window.restartTypingSound;
  if (originalRestartTypingSound) {
    window.restartTypingSound = function() {
      // Appeler la fonction originale
      originalRestartTypingSound();
      
      // Appliquer la correction de vitesse
      if (typingAudio) {
        typingAudio.playbackRate = correctPlaybackRate;
      }
    };
  }
}

// 4. Ajouter le préchargement 50ms après le chargement de la page
setTimeout(() => {
  console.log('⏰ Préchargement initial du son de frappe (50ms après chargement)');
  preloadTypingSound();
}, 50);

// 5. Ajouter le préchargement lors de la première interaction utilisateur
document.addEventListener('click', function preloadOnFirstClick() {
  if (!userInteracted) {
    setTimeout(() => {
      console.log('👤 Préchargement du son au premier clic');
      preloadTypingSound();
    }, 10);
  }
}, { once: true });

// 6. Ajouter le préchargement lors du premier scroll
document.addEventListener('scroll', function preloadOnFirstScroll() {
  if (!userInteracted) {
    setTimeout(() => {
      console.log('👤 Préchargement du son au premier scroll');
      preloadTypingSound();
    }, 10);
  }
}, { once: true });

// 7. Appliquer les corrections quand le script est chargé
console.log('🔧 Application des corrections du son de typing...');
applyTypingSoundCorrections();
console.log('✅ Corrections du son de typing appliquées');
