// Configuration centralisée - Gestion des paramètres de l'application
console.log('⚙️ Configuration centralisée chargée');

/**
 * Configuration de l'application
 */
const AppConfig = {
  // Configuration générale
  app: {
    name: 'Portfolio Alegria',
    version: '1.0.0',
    debug: true,
    language: 'fr'
  },

  // Configuration du thème
  theme: {
    default: 'light',
    transitionDuration: 300,
    autoDetect: true,
    localStorageKey: 'portfolio-theme'
  },

  // Configuration audio
  audio: {
    enabled: true,
    volume: 0.3,
    typingSoundEnabled: true,
    backgroundMusicEnabled: false,
    soundEffectsEnabled: true,
    audioContext: null,
    userInteractionRequired: true
  },

  // Configuration du chatbot
  chatbot: {
    enabled: true,
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    apiKey: 'AIzaSyD2PA0w8R2s1X9Qp2g3v4w5x6y7z8a9b0c1', // À remplacer par votre vraie clé API
    systemPrompt: `Tu es un assistant intelligent pour le portfolio de Alegria. 
    Tu dois répondre de manière professionnelle, concise et utile.
    Tu peux parler des projets, compétences, expériences et informations de contact.
    Sois amical et serviable, mais reste professionnel.`,
    maxTokens: 1000,
    temperature: 0.7,
    typingSpeed: 30,
    maxHistory: 10
  },

  // Configuration de la navigation
  navigation: {
    smoothScroll: true,
    scrollDuration: 800,
    scrollOffset: 70,
    activeLinkDetection: true,
    mobileBreakpoint: 768,
    scrollSpy: true
  },

  // Configuration des animations
  animations: {
    enabled: true,
    scrollAnimations: true,
    typingAnimations: true,
    fadeAnimations: true,
    slideAnimations: true,
    intersectionThreshold: 0.1,
    animationDuration: 600,
    staggerDelay: 100
  },

  // Configuration du défilement
  scroll: {
    behavior: 'smooth',
    snapType: 'none',
    overflow: 'visible',
    diagnosticEnabled: true,
    autoFix: true
  },

  // Configuration des performances
  performance: {
    lazyLoading: true,
    imageOptimization: true,
    debounceDelay: 150,
    throttleDelay: 100,
    maxConcurrentAnimations: 5
  },

  // Configuration des chemins
  paths: {
    assets: './assets/',
    images: './assets/images/',
    sounds: './assets/sounds/',
    fonts: './assets/fonts/'
  },

  // Configuration des URLs externes
  external: {
    github: 'https://github.com/votre-username',
    linkedin: 'https://linkedin.com/in/votre-profil',
    email: 'votre.email@example.com'
  }
};

/**
 * Configuration des sélecteurs CSS
 */
const Selectors = {
  // Navigation
  nav: {
    main: 'nav',
    links: 'nav a',
    mobileToggle: '.mobile-nav-toggle',
    mobileMenu: '.mobile-menu'
  },

  // Thème
  theme: {
    toggle: '.theme-toggle',
    lightIcon: '.theme-toggle .light-icon',
    darkIcon: '.theme-toggle .dark-icon'
  },

  // Chatbot
  chatbot: {
    container: '.chatbot-container',
    toggle: '.chatbot-toggle',
    close: '.chatbot-close',
    messages: '.chatbot-messages',
    input: '.chatbot-input',
    sendButton: '.chatbot-send',
    typingIndicator: '.typing-indicator'
  },

  // Animations
  animations: {
    animatedElements: '.animate-on-scroll',
    fadeElements: '.fade-in',
    slideElements: '.slide-in',
    typingElements: '.typing-text'
  },

  // Sections
  sections: {
    hero: '#hero',
    about: '#about',
    skills: '#skills',
    projects: '#projects',
    experience: '#experience',
    education: '#education',
    contact: '#contact'
  },

  // Audio
  audio: {
    typingSound: '#typing-sound',
    backgroundMusic: '#background-music'
  }
};

/**
 * Configuration des classes CSS
 */
const Classes = {
  // Thème
  theme: {
    light: 'light-theme',
    dark: 'dark-theme'
  },

  // Animations
  animations: {
    animated: 'animated',
    visible: 'visible',
    hidden: 'hidden',
    fadeIn: 'fade-in',
    slideIn: 'slide-in',
    typing: 'typing'
  },

  // Navigation
  navigation: {
    active: 'active',
    mobileOpen: 'mobile-menu-open'
  },

  // Chatbot
  chatbot: {
    open: 'chatbot-open',
    message: 'chatbot-message',
    userMessage: 'user-message',
    botMessage: 'bot-message',
    typing: 'typing'
  }
};

/**
 * Configuration des événements personnalisés
 */
const Events = {
  // Thème
  theme: {
    changed: 'theme-changed',
    lightMode: 'light-mode-activated',
    darkMode: 'dark-mode-activated'
  },

  // Navigation
  navigation: {
    scroll: 'navigation-scroll',
    linkClick: 'navigation-link-click',
    mobileToggle: 'mobile-navigation-toggle'
  },

  // Chatbot
  chatbot: {
    open: 'chatbot-open',
    close: 'chatbot-close',
    message: 'chatbot-message',
    typing: 'chatbot-typing',
    response: 'chatbot-response'
  },

  // Audio
  audio: {
    play: 'audio-play',
    pause: 'audio-pause',
    stop: 'audio-stop',
    volumeChange: 'audio-volume-change'
  },

  // Animations
  animations: {
    start: 'animation-start',
    complete: 'animation-complete',
    interrupt: 'animation-interrupt'
  }
};

/**
 * Configuration des messages et textes
 */
const Messages = {
  // Chatbot
  chatbot: {
    welcome: 'Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider ?',
    typing: 'En train d\'écrire...',
    error: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
    offline: 'Je suis actuellement hors ligne. Veuillez réessayer plus tard.'
  },

  // Navigation
  navigation: {
    scrollError: 'Erreur lors du défilement vers la section',
    sectionNotFound: 'Section non trouvée'
  },

  // Thème
  theme: {
    lightMode: 'Mode clair activé',
    darkMode: 'Mode sombre activé'
  },

  // Audio
  audio: {
    playError: 'Erreur lors de la lecture du son',
    loadError: 'Erreur lors du chargement du son',
    interactionRequired: 'Interaction utilisateur requise pour activer le son'
  }
};

/**
 * Configuration des délais et durées
 */
const Delays = {
  // Animations
  animations: {
    fadeIn: 600,
    slideIn: 800,
    typing: 30,
    stagger: 100,
    scrollTrigger: 200
  },

  // Chatbot
  chatbot: {
    typingDelay: 500,
    messageDelay: 1000,
    responseDelay: 1500,
    autoClose: 30000
  },

  // Navigation
  navigation: {
    scrollDuration: 800,
    mobileMenuDelay: 300,
    activeLinkUpdate: 100
  },

  // Thème
  theme: {
    transitionDuration: 300,
    autoDetectDelay: 100
  },

  // Audio
  audio: {
    typingSoundDelay: 50,
    backgroundMusicFade: 1000,
    soundEffectDuration: 200
  }
};

/**
 * Configuration des breakpoints responsive
 */
const Breakpoints = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1440
};

/**
 * Fonctions utilitaires de configuration
 */
const ConfigUtils = {
  /**
   * Récupère une valeur de configuration
   * @param {string} path - Chemin de la configuration (ex: 'app.name')
   * @returns {*} Valeur de configuration
   */
  get: function(path) {
    const keys = path.split('.');
    let current = AppConfig;
    
    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`⚠️ Configuration non trouvée: ${path}`);
        return null;
      }
      current = current[key];
    }
    
    return current;
  },

  /**
   * Met à jour une valeur de configuration
   * @param {string} path - Chemin de la configuration
   * @param {*} value - Nouvelle valeur
   */
  set: function(path, value) {
    const keys = path.split('.');
    let current = AppConfig;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (current[key] === undefined) {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
    console.log(`✅ Configuration mise à jour: ${path} =`, value);
  },

  /**
   * Vérifie si une configuration existe
   * @param {string} path - Chemin de la configuration
   * @returns {boolean}
   */
  has: function(path) {
    return this.get(path) !== null;
  },

  /**
   * Exporte toute la configuration
   * @returns {Object}
   */
  export: function() {
    return {
      app: AppConfig,
      selectors: Selectors,
      classes: Classes,
      events: Events,
      messages: Messages,
      delays: Delays,
      breakpoints: Breakpoints
    };
  }
};

// Exporter les configurations globalement
window.AppConfig = AppConfig;
window.Selectors = Selectors;
window.Classes = Classes;
window.Events = Events;
window.Messages = Messages;
window.Delays = Delays;
window.Breakpoints = Breakpoints;
window.ConfigUtils = ConfigUtils;

console.log('✅ Configuration centralisée initialisée');
console.log('💡 Utilisez ConfigUtils.get("chemin") pour accéder aux configurations');
