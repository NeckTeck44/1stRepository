// Audio Manager - Gestion centralisée de l'audio
console.log('🎵 Audio Manager chargé');

/**
 * Classe de gestion audio
 */
class AudioManager {
  constructor() {
    this.audioContext = null;
    this.typingAudio = null;
    this.backgroundMusic = null;
    this.soundEffects = {};
    this.userInteracted = false;
    this.isInitialized = false;
    this.volume = ConfigUtils.get('audio.volume') || 0.3;
    this.enabled = ConfigUtils.get('audio.enabled') !== false;
    this.typingSoundEnabled = ConfigUtils.get('audio.typingSoundEnabled') !== false;
    this.backgroundMusicEnabled = ConfigUtils.get('audio.backgroundMusicEnabled') !== false;
    this.soundEffectsEnabled = ConfigUtils.get('audio.soundEffectsEnabled') !== false;
    
    this.init();
  }

  /**
   * Initialise le gestionnaire audio
   */
  async init() {
    if (this.isInitialized) return;
    
    try {
      // Créer le contexte audio
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Charger les sons
      await this.loadSounds();
      
      // Configurer les événements
      this.setupEventListeners();
      
      this.isInitialized = true;
      console.log('✅ Audio Manager initialisé');
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de l\'Audio Manager:', error);
    }
  }

  /**
   * Charge les fichiers audio
   */
  async loadSounds() {
    try {
      // Son de frappe (synthétisé si non disponible)
      this.typingAudio = await this.createTypingSound();
      
      // Musique de fond (optionnelle)
      if (this.backgroundMusicEnabled) {
        this.backgroundMusic = await this.loadBackgroundMusic();
      }
      
      // Effets sonores
      if (this.soundEffectsEnabled) {
        this.soundEffects = {
          click: await this.createClickSound(),
          notification: await this.createNotificationSound(),
          success: await this.createSuccessSound(),
          error: await this.createErrorSound()
        };
      }
      
      console.log('✅ Sons chargés avec succès');
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des sons:', error);
    }
  }

  /**
   * Crée un son de frappe synthétisé
   * @returns {Promise<AudioBuffer>}
   */
  async createTypingSound() {
    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.05; // 50ms
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    
    // Créer un son de clic court
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      data[i] = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 50) * 0.1;
    }
    
    return buffer;
  }

  /**
   * Crée un son de clic
   * @returns {Promise<AudioBuffer>}
   */
  async createClickSound() {
    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.1;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      data[i] = Math.sin(2 * Math.PI * 1000 * t) * Math.exp(-t * 30) * 0.15;
    }
    
    return buffer;
  }

  /**
   * Crée un son de notification
   * @returns {Promise<AudioBuffer>}
   */
  async createNotificationSound() {
    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.3;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      data[i] = Math.sin(2 * Math.PI * 600 * t) * Math.exp(-t * 10) * 0.2;
    }
    
    return buffer;
  }

  /**
   * Crée un son de succès
   * @returns {Promise<AudioBuffer>}
   */
  async createSuccessSound() {
    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.5;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      data[i] = (Math.sin(2 * Math.PI * 523 * t) + Math.sin(2 * Math.PI * 659 * t)) * 0.1 * Math.exp(-t * 5);
    }
    
    return buffer;
  }

  /**
   * Crée un son d'erreur
   * @returns {Promise<AudioBuffer>}
   */
  async createErrorSound() {
    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.4;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      data[i] = Math.sin(2 * Math.PI * 200 * t) * Math.exp(-t * 8) * 0.15;
    }
    
    return buffer;
  }

  /**
   * Charge la musique de fond
   * @returns {Promise<HTMLAudioElement>}
   */
  async loadBackgroundMusic() {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.loop = true;
      audio.volume = this.volume * 0.3; // Plus faible volume pour la musique de fond
      
      // Utiliser une URL par défaut ou charger depuis un fichier
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE'; // Placeholder
      
      audio.addEventListener('canplaythrough', () => {
        resolve(audio);
      });
      
      audio.addEventListener('error', (error) => {
        console.warn('⚠️ Impossible de charger la musique de fond, utilisation d\'un son synthétisé');
        resolve(this.createBackgroundMusicSynth());
      });
    });
  }

  /**
   * Crée une musique de fond synthétisée
   * @returns {HTMLAudioElement}
   */
  createBackgroundMusicSynth() {
    const audio = new Audio();
    // Placeholder - dans une vraie implémentation, vous généreriez un son de fond
    audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE';
    audio.loop = true;
    audio.volume = this.volume * 0.1;
    return audio;
  }

  /**
   * Configure les écouteurs d'événements
   */
  setupEventListeners() {
    // Détecter la première interaction utilisateur
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, () => {
        if (!this.userInteracted) {
          this.userInteracted = true;
          window.userInteracted = true;
          console.log('👤 Interaction utilisateur détectée - Audio activé');
          
          // Démarrer le contexte audio si nécessaire
          if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
          }
        }
      }, { once: true });
    });
  }

  /**
   * Joue un buffer audio
   * @param {AudioBuffer} buffer - Buffer audio à jouer
   * @param {number} volume - Volume (0-1)
   */
  async playBuffer(buffer, volume = 1) {
    if (!this.enabled || !this.userInteracted || !this.audioContext) {
      return;
    }
    
    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      gainNode.gain.value = volume * this.volume;
      
      source.start();
      
      // Émettre un événement
      this.dispatchEvent('play', { type: 'buffer', volume });
      
    } catch (error) {
      console.error('❌ Erreur lors de la lecture du buffer audio:', error);
    }
  }

  /**
   * Joue le son de frappe
   */
  playTypingSound() {
    if (!this.typingSoundEnabled || !this.typingAudio) return;
    
    this.playBuffer(this.typingAudio, 0.5);
  }

  /**
   * Joue un son de clic
   */
  playClickSound() {
    if (!this.soundEffectsEnabled || !this.soundEffects.click) return;
    
    this.playBuffer(this.soundEffects.click, 0.7);
  }

  /**
   * Joue un son de notification
   */
  playNotificationSound() {
    if (!this.soundEffectsEnabled || !this.soundEffects.notification) return;
    
    this.playBuffer(this.soundEffects.notification, 0.6);
  }

  /**
   * Joue un son de succès
   */
  playSuccessSound() {
    if (!this.soundEffectsEnabled || !this.soundEffects.success) return;
    
    this.playBuffer(this.soundEffects.success, 0.8);
  }

  /**
   * Joue un son d'erreur
   */
  playErrorSound() {
    if (!this.soundEffectsEnabled || !this.soundEffects.error) return;
    
    this.playBuffer(this.soundEffects.error, 0.6);
  }

  /**
   * Démarre la musique de fond
   */
  async startBackgroundMusic() {
    if (!this.backgroundMusicEnabled || !this.backgroundMusic) return;
    
    try {
      await this.backgroundMusic.play();
      console.log('🎵 Musique de fond démarrée');
      
      this.dispatchEvent('play', { type: 'background' });
      
    } catch (error) {
      console.error('❌ Erreur lors du démarrage de la musique de fond:', error);
    }
  }

  /**
   * Arrête la musique de fond
   */
  stopBackgroundMusic() {
    if (!this.backgroundMusic) return;
    
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
    console.log('🎵 Musique de fond arrêtée');
    
    this.dispatchEvent('stop', { type: 'background' });
  }

  /**
   * Met en pause la musique de fond
   */
  pauseBackgroundMusic() {
    if (!this.backgroundMusic) return;
    
    this.backgroundMusic.pause();
    console.log('🎵 Musique de fond en pause');
    
    this.dispatchEvent('pause', { type: 'background' });
  }

  /**
   * Reprend la musique de fond
   */
  resumeBackgroundMusic() {
    if (!this.backgroundMusic) return;
    
    this.backgroundMusic.play().catch(error => {
      console.error('❌ Erreur lors de la reprise de la musique de fond:', error);
    });
    
    this.dispatchEvent('play', { type: 'background' });
  }

  /**
   * Définit le volume principal
   * @param {number} volume - Volume (0-1)
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.volume * 0.3;
    }
    
    console.log(`🔊 Volume défini à ${Math.round(this.volume * 100)}%`);
    this.dispatchEvent('volumeChange', { volume: this.volume });
  }

  /**
   * Active ou désactive l'audio
   * @param {boolean} enabled - État de l'audio
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    
    if (!enabled) {
      this.stopBackgroundMusic();
    }
    
    console.log(`🔊 Audio ${enabled ? 'activé' : 'désactivé'}`);
  }

  /**
   * Active ou désactive le son de frappe
   * @param {boolean} enabled - État du son de frappe
   */
  setTypingSoundEnabled(enabled) {
    this.typingSoundEnabled = enabled;
    console.log(`⌨️ Son de frappe ${enabled ? 'activé' : 'désactivé'}`);
  }

  /**
   * Active ou désactive la musique de fond
   * @param {boolean} enabled - État de la musique de fond
   */
  setBackgroundMusicEnabled(enabled) {
    this.backgroundMusicEnabled = enabled;
    
    if (!enabled) {
      this.stopBackgroundMusic();
    }
    
    console.log(`🎵 Musique de fond ${enabled ? 'activée' : 'désactivée'}`);
  }

  /**
   * Active ou désactive les effets sonores
   * @param {boolean} enabled - État des effets sonores
   */
  setSoundEffectsEnabled(enabled) {
    this.soundEffectsEnabled = enabled;
    console.log(`🔔 Effets sonores ${enabled ? 'activés' : 'désactivés'}`);
  }

  /**
   * Émet un événement audio
   * @param {string} type - Type d'événement
   * @param {Object} data - Données de l'événement
   */
  dispatchEvent(type, data = {}) {
    const event = new CustomEvent(Events.audio[type], {
      detail: { ...data, timestamp: Date.now() }
    });
    document.dispatchEvent(event);
  }

  /**
   * Obtient l'état actuel de l'audio
   * @returns {Object}
   */
  getStatus() {
    return {
      enabled: this.enabled,
      volume: this.volume,
      userInteracted: this.userInteracted,
      isInitialized: this.isInitialized,
      typingSoundEnabled: this.typingSoundEnabled,
      backgroundMusicEnabled: this.backgroundMusicEnabled,
      soundEffectsEnabled: this.soundEffectsEnabled,
      backgroundMusicPlaying: this.backgroundMusic && !this.backgroundMusic.paused
    };
  }
}

// Créer une instance globale
let audioManager;

// Initialiser le gestionnaire audio quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  audioManager = new AudioManager();
  window.audioManager = audioManager;
});

// Exporter les fonctions globales pour la compatibilité
window.playTypingSound = () => audioManager?.playTypingSound();
window.playClickSound = () => audioManager?.playClickSound();
window.playNotificationSound = () => audioManager?.playNotificationSound();
window.playSuccessSound = () => audioManager?.playSuccessSound();
window.playErrorSound = () => audioManager?.playErrorSound();
window.startBackgroundMusic = () => audioManager?.startBackgroundMusic();
window.stopBackgroundMusic = () => audioManager?.stopBackgroundMusic();
window.pauseBackgroundMusic = () => audioManager?.pauseBackgroundMusic();
window.resumeBackgroundMusic = () => audioManager?.resumeBackgroundMusic();
window.setAudioVolume = (volume) => audioManager?.setVolume(volume);
window.setAudioEnabled = (enabled) => audioManager?.setEnabled(enabled);
window.setTypingSoundEnabled = (enabled) => audioManager?.setTypingSoundEnabled(enabled);
window.setBackgroundMusicEnabled = (enabled) => audioManager?.setBackgroundMusicEnabled(enabled);
window.setSoundEffectsEnabled = (enabled) => audioManager?.setSoundEffectsEnabled(enabled);
window.getAudioStatus = () => audioManager?.getStatus();

console.log('🎵 Audio Manager prêt à être initialisé');
