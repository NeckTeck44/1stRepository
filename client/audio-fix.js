// SOLUTION AUDIO SIMPLE ET FONCTIONNELLE
// Basé sur les tests réussis dans audio-test.html

// Fonction simple pour jouer un son de clic
function playClickSound() {
    console.log('🔊 Jouer un son de clic...');
    
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
        
        console.log('✅ Son de clic joué avec succès !');
        
    } catch (error) {
        console.log('❌ Erreur lors de la lecture du son:', error);
    }
}

// Fonction pour jouer un son avec le fichier MP3
function playClickSoundMP3() {
    console.log('🔊 Jouer un son de clic MP3...');
    
    try {
        const audio = new Audio('/sounds/2-casual-click-pop-ui-2-262119.mp3');
        audio.volume = 1.0;
        
        audio.play().then(() => {
            console.log('✅ Son MP3 joué avec succès !');
        }).catch(e => {
            console.log('❌ Erreur lecture MP3:', e);
            // Secours avec Web Audio API
            playClickSound();
        });
        
    } catch (error) {
        console.log('❌ Erreur avec MP3:', error);
        // Secours avec Web Audio API
        playClickSound();
    }
}

// Remplacer la fonction playAnimationSound existante
if (typeof window.playAnimationSound !== 'undefined') {
    // Sauvegarder l'ancienne fonction
    window.originalPlayAnimationSound = window.playAnimationSound;
    
    // Remplacer avec la nouvelle version simple
    window.playAnimationSound = function() {
        console.log('🎵 Version simplifiée de playAnimationSound');
        playClickSoundMP3();
    };
    
    console.log('✅ Fonction playAnimationSound remplacée avec la version simple');
} else {
    // Créer la fonction si elle n'existe pas
    window.playAnimationSound = function() {
        console.log('🎵 Nouvelle fonction playAnimationSound créée');
        playClickSoundMP3();
    };
    
    console.log('✅ Nouvelle fonction playAnimationSound créée');
}

// Initialisation audio simplifiée
function initAudioSimple() {
    console.log('🎵 Initialisation audio simplifiée...');
    
    // Créer un contexte audio pour le "débloquer"
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        console.log('✅ Contexte audio prêt, état:', audioCtx.state);
        
        // Jouer un son silencieux pour débloquer
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.001);
        
        console.log('🔓 Contexte audio débloqué');
        
    } catch (error) {
        console.log('❌ Erreur initialisation audio:', error);
    }
}

// Écouteurs d'événements simplifiés
document.addEventListener('click', function() {
    if (!window.userInteracted) {
        window.userInteracted = true;
        console.log('👤 Interaction utilisateur détectée');
        initAudioSimple();
    }
}, { once: true });

document.addEventListener('scroll', function() {
    if (!window.userInteracted) {
        window.userInteracted = true;
        console.log('👤 Interaction utilisateur détectée (scroll)');
        initAudioSimple();
    }
}, { once: true });

console.log('🎵 Audio fix chargé avec succès !');
