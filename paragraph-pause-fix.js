// Script pour gérer les pauses du son en fin de paragraphe
// Ce script modifie la fonction typeWriter pour arrêter le son pendant les sauts de ligne

console.log('🔧 Application des corrections pour les pauses de son en fin de paragraphe...');

// Sauvegarder la fonction typeWriter originale
const originalTypeWriter = window.typeWriter;

// Remplacer la fonction typeWriter avec une version améliorée
window.typeWriter = function() {
  if (index < text.length) {
    const raw = text.charAt(index);
    
    // Gérer les retours à la ligne
    if (raw === '\n') {
      currentWord = document.createElement('div');
      currentWord.className = 'word';
      paragraph.appendChild(currentWord);
      index++;
      
      // Pause longue pour le saut de ligne et gestion du son
      console.log('📄 Saut de ligne détecté - Pause longue du son');
      pauseTypingSound();
      
      setTimeout(() => {
        console.log('▶️ Redémarrage du son après saut de ligne');
        resumeTypingSound();
        typeWriter();
      }, 700); // Pause de 700ms pour le saut de ligne
      
      return;
    }
    
    // Créer l'élément span pour le caractère
    if (raw !== ' ') {
      const escaped = raw
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const span = document.createElement('span');
      span.className = 'char';
      span.innerHTML = escaped;
      currentWord.appendChild(span);
    }

    const ch = raw;
    index++;

    // Jouer le son de frappe pour chaque caractère (pas seulement au début)
    if (ch !== ' ' && ch !== '\n') {
      playTypingSound();
    }

    // Natural typing rhythm: base + jitter + punctuation pauses
    const base = 25;  // Rythme de base rapide
    const jitter = Math.floor(Math.random() * 15) - 7; // -7..+7 ms
    let extra = 0;
    let shouldPauseAudio = false;
    let pauseDuration = 0;

    // Gestion des pauses naturelles
    if (ch === ' ') {
      extra += 50;  // Petite pause pour les espaces
    }
    if (ch === ',' || ch === ';' || ch === ':') {
      extra += 250;  // Pause naturelle pour virgules
      shouldPauseAudio = true;
      pauseDuration = 250;
    }
    if (ch === '.' || ch === '!' || ch === '?') {
      extra += 500;  // Pause plus longue en fin de phrase
      shouldPauseAudio = true;
      pauseDuration = 500;
    }

    // Gérer les pauses du son pour la ponctuation
    if (shouldPauseAudio) {
      console.log(`⏸️ Pause du son de frappe pendant ${pauseDuration}ms (caractère: ${ch})`);
      pauseTypingSound();
      
      // Redémarrer le son après la pause
      setTimeout(() => {
        if (index < text.length) {
          console.log('▶️ Redémarrage du son de frappe');
          resumeTypingSound();
        }
      }, pauseDuration);
    }

    const delay = Math.max(5, base + jitter + extra);
    console.log(`Prochain caractère dans ${delay}ms (base: ${base}, jitter: ${jitter}, extra: ${extra})`);
    setTimeout(typeWriter, delay);
  } else {
    console.log('Animation terminée');
    // Arrêter le son quand l'animation est finie
    stopTypingSound();
  }
};

console.log('✅ Corrections pour les pauses de son en fin de paragraphe appliquées');
