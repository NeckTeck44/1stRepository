// Script pour ajouter les fonctionnalités de préchargement du son de typing
// Ce script restaure les améliorations qui ont été supprimées

console.log('🔧 Initialisation du préchargement du son de typing...');

// Fonction pour précharger le son de frappe
function preloadTypingSound() {
  console.log('🔊 Préchargement du son de frappe...');
  
  try {
    // Créer l'AudioContext si nécessaire
    if (!window.typingAudioContext) {
      window.typingAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Réactiver le contexte s'il est en état suspendu
    if (window.typingAudioContext.state === 'suspended') {
      window.typingAudioContext.resume();
    }
    
    // Créer et précharger l'élément audio
    if (!window.typingAudio) {
      window.typingAudio = new Audio(window.currentTypingSound);
      window.typingAudio.volume = 0.4;
      window.typingAudio.playbackRate = 1;
      
      // Précharger le son
      window.typingAudio.load();
      
      // Connecter la source audio si nécessaire
      if (window.typingAudioContext) {
        window.typingAudioSource = window.typingAudioContext.createMediaElementSource(window.typingAudio);
        window.typingAudioSource.connect(window.typingAudioContext.destination);
      }
      
      console.log('✅ Son de frappe préchargé avec succès');
    }
  } catch (error) {
    console.log('❌ Erreur lors du préchargement du son:', error);
  }
}

// Préchargement initial 50ms après le chargement de la page
setTimeout(() => {
  console.log('⏰ Préchargement initial du son de frappe (50ms après chargement)');
  preloadTypingSound();
}, 50);

// Préchargement lors de la première interaction utilisateur (clic)
document.addEventListener('click', function preloadOnFirstClick() {
  if (!window.userInteracted) {
    setTimeout(() => {
      console.log('👤 Préchargement du son au premier clic');
      preloadTypingSound();
    }, 10);
  }
}, { once: true });

// Préchargement lors du premier scroll
document.addEventListener('scroll', function preloadOnFirstScroll() {
  if (!window.userInteracted) {
    setTimeout(() => {
      console.log('👤 Préchargement du son au premier scroll');
      preloadTypingSound();
    }, 10);
  }
}, { once: true });

console.log('✅ Script de préchargement du son de typing chargé');
