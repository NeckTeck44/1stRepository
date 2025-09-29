// Animation Manager - Gestion centralisée des animations
console.log('🎬 Animation Manager chargé');

/**
 * Classe de gestion des animations
 */
class AnimationManager {
  constructor() {
    this.animations = new Map();
    this.intersectionObservers = new Map();
    this.animationQueue = [];
    this.isAnimating = false;
    this.enabled = ConfigUtils.get('animations.enabled') !== false;
    this.scrollAnimations = ConfigUtils.get('animations.scrollAnimations') !== false;
    this.typingAnimations = ConfigUtils.get('animations.typingAnimations') !== false;
    this.fadeAnimations = ConfigUtils.get('animations.fadeAnimations') !== false;
    this.slideAnimations = ConfigUtils.get('animations.slideAnimations') !== false;
    this.intersectionThreshold = ConfigUtils.get('animations.intersectionThreshold') || 0.1;
    this.animationDuration = ConfigUtils.get('animations.animationDuration') || 600;
    this.staggerDelay = ConfigUtils.get('animations.staggerDelay') || 100;
    this.maxConcurrentAnimations = ConfigUtils.get('performance.maxConcurrentAnimations') || 5;
    
    this.init();
  }

  /**
   * Initialise le gestionnaire d'animations
   */
  init() {
    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
    } else {
      this.setupAnimations();
    }
  }

  /**
   * Configure les animations
   */
  setupAnimations() {
    try {
      if (!this.enabled) {
        console.log('🎬 Animations désactivées');
        return;
      }
      
      // Configurer les animations de défilement
      if (this.scrollAnimations) {
        this.setupScrollAnimations();
      }
      
      // Configurer les animations de frappe
      if (this.typingAnimations) {
        this.setupTypingAnimations();
      }
      
      // Configurer les animations de fondu
      if (this.fadeAnimations) {
        this.setupFadeAnimations();
      }
      
      // Configurer les animations de glissement
      if (this.slideAnimations) {
        this.setupSlideAnimations();
      }
      
      // Configurer le gestionnaire de file d'attente
      this.setupAnimationQueue();
      
      console.log('✅ Animation Manager initialisé');
      console.log(`🎬 ${this.animations.size} animations configurées`);
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation des animations:', error);
    }
  }

  /**
   * Configure les animations de défilement
   */
  setupScrollAnimations() {
    const elements = document.querySelectorAll(Selectors.animations.animatedElements);
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: this.intersectionThreshold
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    elements.forEach(element => {
      observer.observe(element);
      this.intersectionObservers.set(element, observer);
    });
    
    console.log(`📜 ${elements.length} éléments d'animation de défilement configurés`);
  }

  /**
   * Configure les animations de frappe
   */
  setupTypingAnimations() {
    const elements = document.querySelectorAll(Selectors.animations.typingElements);
    
    elements.forEach(element => {
      const text = element.getAttribute('data-text') || element.textContent;
      const speed = parseInt(element.getAttribute('data-speed')) || this.typingSpeed || 30;
      
      this.animations.set(element, {
        type: 'typing',
        text: text,
        speed: speed,
        originalText: element.textContent
      });
      
      // Masquer le texte original
      element.textContent = '';
      element.style.visibility = 'hidden';
    });
    
    console.log(`⌨️ ${elements.length} éléments d'animation de frappe configurés`);
  }

  /**
   * Configure les animations de fondu
   */
  setupFadeAnimations() {
    const elements = document.querySelectorAll(Selectors.animations.fadeElements);
    
    elements.forEach(element => {
      element.style.opacity = '0';
      element.style.transition = `opacity ${this.animationDuration}ms ease-in-out`;
      
      this.animations.set(element, {
        type: 'fade',
        duration: this.animationDuration
      });
    });
    
    console.log(`🌫️ ${elements.length} éléments d'animation de fondu configurés`);
  }

  /**
   * Configure les animations de glissement
   */
  setupSlideAnimations() {
    const elements = document.querySelectorAll(Selectors.animations.slideElements);
    
    elements.forEach(element => {
      const direction = element.getAttribute('data-direction') || 'up';
      const distance = parseInt(element.getAttribute('data-distance')) || 50;
      
      // Configurer la position initiale
      let transform = '';
      switch (direction) {
        case 'up':
          transform = `translateY(${distance}px)`;
          break;
        case 'down':
          transform = `translateY(-${distance}px)`;
          break;
        case 'left':
          transform = `translateX(${distance}px)`;
          break;
        case 'right':
          transform = `translateX(-${distance}px)`;
          break;
      }
      
      element.style.opacity = '0';
      element.style.transform = transform;
      element.style.transition = `all ${this.animationDuration}ms ease-in-out`;
      
      this.animations.set(element, {
        type: 'slide',
        direction: direction,
        distance: distance,
        duration: this.animationDuration
      });
    });
    
    console.log(`➡️ ${elements.length} éléments d'animation de glissement configurés`);
  }

  /**
   * Configure le gestionnaire de file d'attente
   */
  setupAnimationQueue() {
    // Traiter la file d'attente d'animations
    setInterval(() => {
      if (this.animationQueue.length > 0 && !this.isAnimating) {
        const nextAnimation = this.animationQueue.shift();
        this.executeAnimation(nextAnimation);
      }
    }, 50);
  }

  /**
   * Anime un élément
   * @param {HTMLElement} element - Élément à animer
   * @param {Object} options - Options d'animation
   */
  animateElement(element, options = {}) {
    const animation = this.animations.get(element) || options;
    
    if (!animation) {
      console.warn('⚠️ Aucune animation trouvée pour l\'élément:', element);
      return;
    }
    
    // Ajouter à la file d'attente
    this.animationQueue.push({
      element: element,
      animation: animation,
      timestamp: Date.now()
    });
  }

  /**
   * Exécute une animation
   * @param {Object} animationData - Données de l'animation
   */
  executeAnimation(animationData) {
    const { element, animation } = animationData;
    
    this.isAnimating = true;
    
    // Émettre un événement
    this.dispatchEvent('start', { element, animation });
    
    switch (animation.type) {
      case 'typing':
        this.executeTypingAnimation(element, animation);
        break;
      case 'fade':
        this.executeFadeAnimation(element, animation);
        break;
      case 'slide':
        this.executeSlideAnimation(element, animation);
        break;
      default:
        console.warn('⚠️ Type d\'animation inconnu:', animation.type);
        this.completeAnimation(element, animation);
    }
  }

  /**
   * Exécute une animation de frappe
   * @param {HTMLElement} element - Élément à animer
   * @param {Object} animation - Configuration de l'animation
   */
  executeTypingAnimation(element, animation) {
    element.style.visibility = 'visible';
    let index = 0;
    
    const type = () => {
      if (index < animation.text.length) {
        element.textContent += animation.text.charAt(index);
        index++;
        
        // Jouer un son de frappe
        if (index % 3 === 0 && window.playTypingSound) {
          window.playTypingSound();
        }
        
        setTimeout(type, animation.speed);
      } else {
        this.completeAnimation(element, animation);
      }
    };
    
    type();
  }

  /**
   * Exécute une animation de fondu
   * @param {HTMLElement} element - Élément à animer
   * @param {Object} animation - Configuration de l'animation
   */
  executeFadeAnimation(element, animation) {
    element.style.opacity = '1';
    
    setTimeout(() => {
      this.completeAnimation(element, animation);
    }, animation.duration);
  }

  /**
   * Exécute une animation de glissement
   * @param {HTMLElement} element - Élément à animer
   * @param {Object} animation - Configuration de l'animation
   */
  executeSlideAnimation(element, animation) {
    element.style.opacity = '1';
    element.style.transform = 'translateX(0) translateY(0)';
    
    setTimeout(() => {
      this.completeAnimation(element, animation);
    }, animation.duration);
  }

  /**
   * Termine une animation
   * @param {HTMLElement} element - Élément animé
   * @param {Object} animation - Configuration de l'animation
   */
  completeAnimation(element, animation) {
    // Ajouter la classe d'animation terminée
    element.classList.add(Classes.animations.animated);
    element.classList.add(Classes.animations.visible);
    
    // Émettre un événement
    this.dispatchEvent('complete', { element, animation });
    
    // Réinitialiser l'état
    this.isAnimating = false;
    
    console.log(`✅ Animation terminée pour:`, element);
  }

  /**
   * Ajoute une animation personnalisée
   * @param {HTMLElement} element - Élément à animer
   * @param {Object} animation - Configuration de l'animation
   */
  addAnimation(element, animation) {
    this.animations.set(element, animation);
    console.log('📝 Animation personnalisée ajoutée pour:', element);
  }

  /**
   * Supprime une animation
   * @param {HTMLElement} element - Élément dont l'animation doit être supprimée
   */
  removeAnimation(element) {
    this.animations.delete(element);
    
    // Arrêter l'observation
    const observer = this.intersectionObservers.get(element);
    if (observer) {
      observer.unobserve(element);
      this.intersectionObservers.delete(element);
    }
    
    console.log('🗑️ Animation supprimée pour:', element);
  }

  /**
   * Anime un texte avec effet de frappe
   * @param {HTMLElement} element - Élément cible
   * @param {string} text - Texte à animer
   * @param {number} speed - Vitesse de frappe
   * @param {Function} callback - Fonction de rappel
   */
  typeText(element, text, speed = 30, callback = null) {
    const animation = {
      type: 'typing',
      text: text,
      speed: speed,
      callback: callback
    };
    
    this.animateElement(element, animation);
  }

  /**
   * Anime un fondu
   * @param {HTMLElement} element - Élément cible
   * @param {number} duration - Durée de l'animation
   * @param {Function} callback - Fonction de rappel
   */
  fadeIn(element, duration = this.animationDuration, callback = null) {
    const animation = {
      type: 'fade',
      duration: duration,
      callback: callback
    };
    
    this.animateElement(element, animation);
  }

  /**
   * Anime un glissement
   * @param {HTMLElement} element - Élément cible
   * @param {string} direction - Direction du glissement
   * @param {number} distance - Distance du glissement
   * @param {number} duration - Durée de l'animation
   * @param {Function} callback - Fonction de rappel
   */
  slideIn(element, direction = 'up', distance = 50, duration = this.animationDuration, callback = null) {
    const animation = {
      type: 'slide',
      direction: direction,
      distance: distance,
      duration: duration,
      callback: callback
    };
    
    this.animateElement(element, animation);
  }

  /**
   * Anime plusieurs éléments avec un décalage
   * @param {NodeList} elements - Éléments à animer
   * @param {string} animationType - Type d'animation
   * @param {number} staggerDelay - Délai entre chaque animation
   * @param {Object} options - Options d'animation
   */
  staggerAnimate(elements, animationType, staggerDelay = this.staggerDelay, options = {}) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        switch (animationType) {
          case 'fade':
            this.fadeIn(element, options.duration, options.callback);
            break;
          case 'slide':
            this.slideIn(element, options.direction, options.distance, options.duration, options.callback);
            break;
          case 'typing':
            this.typeText(element, options.text, options.speed, options.callback);
            break;
        }
      }, index * staggerDelay);
    });
  }

  /**
   * Active ou désactive les animations
   * @param {boolean} enabled - État des animations
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    console.log(`🎬 Animations ${enabled ? 'activées' : 'désactivées'}`);
  }

  /**
   * Définit la durée des animations
   * @param {number} duration - Durée en millisecondes
   */
  setAnimationDuration(duration) {
    this.animationDuration = Math.max(100, duration);
    console.log(`⏱️ Durée des animations définie à ${this.animationDuration}ms`);
  }

  /**
   * Définit le délai de décalage
   * @param {number} delay - Délai en millisecondes
   */
  setStaggerDelay(delay) {
    this.staggerDelay = Math.max(0, delay);
    console.log(`⏱️ Délai de décalage défini à ${this.staggerDelay}ms`);
  }

  /**
   * Définit le seuil d'intersection
   * @param {number} threshold - Seuil (0-1)
   */
  setIntersectionThreshold(threshold) {
    this.intersectionThreshold = Math.max(0, Math.min(1, threshold));
    console.log(`📏 Seuil d'intersection défini à ${this.intersectionThreshold}`);
  }

  /**
   * Définit le nombre maximum d'animations concurrentes
   * @param {number} max - Nombre maximum
   */
  setMaxConcurrentAnimations(max) {
    this.maxConcurrentAnimations = Math.max(1, max);
    console.log(`🔄 Nombre maximum d'animations concurrentes défini à ${this.maxConcurrentAnimations}`);
  }

  /**
   * Obtient l'état actuel des animations
   * @returns {Object}
   */
  getStatus() {
    return {
      enabled: this.enabled,
      animationsCount: this.animations.size,
      queueLength: this.animationQueue.length,
      isAnimating: this.isAnimating,
      scrollAnimations: this.scrollAnimations,
      typingAnimations: this.typingAnimations,
      fadeAnimations: this.fadeAnimations,
      slideAnimations: this.slideAnimations,
      animationDuration: this.animationDuration,
      staggerDelay: this.staggerDelay,
      maxConcurrentAnimations: this.maxConcurrentAnimations
    };
  }

  /**
   * Réinitialise toutes les animations
   */
  reset() {
    // Arrêter tous les observateurs
    this.intersectionObservers.forEach((observer, element) => {
      observer.unobserve(element);
    });
    this.intersectionObservers.clear();
    
    // Vider la file d'attente
    this.animationQueue = [];
    
    // Réinitialiser les éléments
    this.animations.forEach((animation, element) => {
      element.classList.remove(Classes.animations.animated);
      element.classList.remove(Classes.animations.visible);
      
      // Réinitialiser les styles
      switch (animation.type) {
        case 'fade':
          element.style.opacity = '0';
          break;
        case 'slide':
          element.style.opacity = '0';
          element.style.transform = '';
          break;
        case 'typing':
          element.textContent = '';
          element.style.visibility = 'hidden';
          break;
      }
    });
    
    this.isAnimating = false;
    console.log('🔄 Animations réinitialisées');
  }

  /**
   * Émet un événement d'animation
   * @param {string} type - Type d'événement
   * @param {Object} data - Données de l'événement
   */
  dispatchEvent(type, data = {}) {
    const event = new CustomEvent(Events.animations[type], {
      detail: { ...data, timestamp: Date.now() }
    });
    document.dispatchEvent(event);
  }
}

// Créer une instance globale
let animationManager;

// Initialiser le gestionnaire d'animations quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  animationManager = new AnimationManager();
  window.animationManager = animationManager;
});

// Exporter les fonctions globales pour la compatibilité
window.animateElement = (element, options) => animationManager?.animateElement(element, options);
window.typeText = (element, text, speed, callback) => animationManager?.typeText(element, text, speed, callback);
window.fadeIn = (element, duration, callback) => animationManager?.fadeIn(element, duration, callback);
window.slideIn = (element, direction, distance, duration, callback) => animationManager?.slideIn(element, direction, distance, duration, callback);
window.staggerAnimate = (elements, animationType, staggerDelay, options) => animationManager?.staggerAnimate(elements, animationType, staggerDelay, options);
window.addAnimation = (element, animation) => animationManager?.addAnimation(element, animation);
window.removeAnimation = (element) => animationManager?.removeAnimation(element);
window.resetAnimations = () => animationManager?.reset();
window.getAnimationStatus = () => animationManager?.getStatus();

console.log('🎬 Animation Manager prêt à être initialisé');
