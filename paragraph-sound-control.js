// Paragraph Sound Control - Gestion améliorée du son par paragraphe
console.log('🔧 Activation du contrôle du son par paragraphe...');

// Variables globales pour la gestion du son
window.typingSoundEnabled = true;
window.currentTypingAudio = null;

/**
 * Arrête le son de frappe en cours
 */
function stopTypingSound() {
  if (window.typingAudio && !window.typingAudio.paused) {
    window.typingAudio.pause();
    window.typingAudio.currentTime = 0;
    console.log('⏹️ Son de frappe arrêté');
  }
}

/**
 * Démarre le son de frappe
 */
function startTypingSound() {
  if (window.typingSoundEnabled && window.userInteracted && window.typingAudio) {
    window.typingAudio.play().catch(e => console.log('❌ Erreur démarrage son:', e));
    console.log('▶️ Son de frappe démarré');
  }
}

/**
 * Met en pause le son de frappe
 */
function pauseTypingSound() {
  if (window.typingAudio && !window.typingAudio.paused) {
    window.typingAudio.pause();
    console.log('⏸️ Son de frappe en pause');
  }
}

/**
 * Reprend le son de frappe
 */
function resumeTypingSound() {
  if (window.typingSoundEnabled && window.userInteracted && window.typingAudio && window.typingAudio.paused) {
    window.typingAudio.play().catch(e => console.log('❌ Erreur reprise son:', e));
    console.log('▶️ Son de frappe repris');
  }
}

/**
 * Active ou désactive le son de frappe
 * @param {boolean} enabled - État du son
 */
function setTypingSoundEnabled(enabled) {
  window.typingSoundEnabled = enabled;
  console.log(`🔊 Son de frappe ${enabled ? 'activé' : 'désactivé'}`);
  
  if (!enabled) {
    stopTypingSound();
  }
}

/**
 * Gère les pauses de son pour les sauts de ligne et la ponctuation
 * @param {string} character - Caractère courant
 * @param {Function} callback - Fonction de rappel après la pause
 */
function handleCharacterPause(character, callback) {
  let pauseDuration = 0;
  let shouldPauseSound = false;
  
  switch (character) {
    case '\n':
      pauseDuration = 150;
      shouldPauseSound = true;
      console.log('📄 Saut de ligne détecté');
      break;
    case ',':
    case ';':
    case ':':
      pauseDuration = 100;
      break;
    case '.':
    case '!':
    case '?':
      pauseDuration = 200;
      break;
    case ' ':
      pauseDuration = 30;
      break;
  }
  
  if (shouldPauseSound) {
    pauseTypingSound();
  }
  
  if (pauseDuration > 0) {
    setTimeout(() => {
      if (shouldPauseSound) {
        // Vérifier si l'animation est encore en cours avant de reprendre le son
        if (window.typewriterAnimationActive !== false) {
          resumeTypingSound();
        } else {
          console.log('🔇 Animation terminée, pas de reprise du son');
        }
      }
      if (callback) callback();
    }, pauseDuration);
  } else if (callback) {
    callback();
  }
}

// Exporter les fonctions globalement seulement si elles n'existent pas déjà
if (!window.stopTypingSound) window.stopTypingSound = stopTypingSound;
if (!window.startTypingSound) window.startTypingSound = startTypingSound;
if (!window.pauseTypingSound) window.pauseTypingSound = pauseTypingSound;
if (!window.resumeTypingSound) window.resumeTypingSound = resumeTypingSound;
if (!window.setTypingSoundEnabled) window.setTypingSoundEnabled = setTypingSoundEnabled;
if (!window.handleCharacterPause) window.handleCharacterPause = handleCharacterPause;

console.log('✅ Contrôle du son par paragraphe activé');
console.log('💡 Fonctions disponibles :');
console.log('   stopTypingSound() - Arrête le son');
console.log('   startTypingSound() - Démarre le son');
console.log('   setTypingSoundEnabled(true/false) - Active/désactive le son');
console.log('   handleCharacterPause(char, callback) - Gère les pauses');
