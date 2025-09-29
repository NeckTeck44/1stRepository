// Theme Manager - Gestion centralisée du thème
console.log('🎨 Theme Manager chargé');

/**
 * Classe de gestion du thème
 */
class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.systemTheme = null;
    this.themeToggle = null;
    this.isInitialized = false;
    this.autoDetectEnabled = ConfigUtils.get('theme.autoDetect') !== false;
    this.defaultTheme = ConfigUtils.get('theme.default') || 'light';
    this.transitionDuration = ConfigUtils.get('theme.transitionDuration') || 300;
    this.localStorageKey = ConfigUtils.get('theme.localStorageKey') || 'portfolio-theme';
    
    this.init();
  }

  /**
   * Initialise le gestionnaire de thème
   */
  init() {
    if (this.isInitialized) return;
    
    try {
      // Attendre que le DOM soit chargé
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setupTheme());
      } else {
        this.setupTheme();
      }
      
      this.isInitialized = true;
      console.log('✅ Theme Manager initialisé');
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation du Theme Manager:', error);
    }
  }

  /**
   * Configure le thème
   */
  setupTheme() {
    try {
      // Récupérer les éléments DOM
      this.themeToggle = document.querySelector(Selectors.theme.toggle);
      
      // Détecter le thème système
      this.detectSystemTheme();
      
      // Appliquer le thème initial
      this.applyInitialTheme();
      
      // Configurer les événements
      this.setupEventListeners();
      
      // Observer les changements de thème système
      if (this.autoDetectEnabled) {
        this.setupSystemThemeObserver();
      }
      
      console.log('✅ Thème configuré avec succès');
      console.log(`🎨 Thème actuel: ${this.currentTheme}`);
      console.log(`🖥️  Thème système: ${this.systemTheme}`);
      console.log(`🔧 Auto-détection: ${this.autoDetectEnabled ? 'activée' : 'désactivée'}`);
      
    } catch (error) {
      console.error('❌ Erreur lors de la configuration du thème:', error);
    }
  }

  /**
   * Détecte le thème système
   */
  detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.systemTheme = 'dark';
    } else {
      this.systemTheme = 'light';
    }
  }

  /**
   * Applique le thème initial
   */
  applyInitialTheme() {
    // Récupérer le thème sauvegardé
    const savedTheme = this.getSavedTheme();
    
    // Déterminer le thème à appliquer
    let themeToApply;
    
    if (savedTheme) {
      themeToApply = savedTheme;
    } else if (this.autoDetectEnabled) {
      themeToApply = this.systemTheme;
    } else {
      themeToApply = this.defaultTheme;
    }
    
    // Appliquer le thème
    this.setTheme(themeToApply, false);
  }

  /**
   * Récupère le thème sauvegardé dans le localStorage
   */
  getSavedTheme() {
    try {
      return localStorage.getItem(this.localStorageKey);
    } catch (error) {
      console.warn('⚠️ Impossible d\'accéder au localStorage:', error);
      return null;
    }
  }

  /**
   * Sauvegarde le thème dans le localStorage
   */
  saveTheme(theme) {
    try {
      localStorage.setItem(this.localStorageKey, theme);
      console.log(`💾 Thème sauvegardé: ${theme}`);
    } catch (error) {
      console.warn('⚠️ Impossible de sauvegarder le thème:', error);
    }
  }

  /**
   * Définit le thème
   */
  setTheme(theme, save = true) {
    if (!theme || (theme !== 'light' && theme !== 'dark')) {
      console.warn('⚠️ Thème invalide:', theme);
      return;
    }
    
    const previousTheme = this.currentTheme;
    this.currentTheme = theme;
    
    // Appliquer les classes CSS
    this.applyThemeClasses(theme);
    
    // Mettre à jour l'interface
    this.updateThemeToggle(theme);
    
    // Sauvegarder le thème
    if (save) {
      this.saveTheme(theme);
    }
    
    // Déclencher les événements
    this.dispatchThemeEvents(theme, previousTheme);
    
    // Mettre à jour les propriétés CSS personnalisées
    this.updateCSSVariables(theme);
    
    console.log(`🎨 Thème appliqué: ${theme}`);
  }

  /**
   * Applique les classes CSS pour le thème
   */
  applyThemeClasses(theme) {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // Supprimer les classes de thème existantes
    htmlElement.classList.remove(Classes.theme.light, Classes.theme.dark);
    bodyElement.classList.remove(Classes.theme.light, Classes.theme.dark);
    
    // Ajouter la classe du thème actuel
    const themeClass = Classes.theme[theme];
    if (themeClass) {
      htmlElement.classList.add(themeClass);
      bodyElement.classList.add(themeClass);
    }
    
    // Appliquer la transition
    this.applyThemeTransition();
  }

  /**
   * Applique la transition de thème
   */
  applyThemeTransition() {
    const style = document.createElement('style');
    style.textContent = `
      * {
        transition: background-color ${this.transitionDuration}ms ease,
                    color ${this.transitionDuration}ms ease,
                    border-color ${this.transitionDuration}ms ease,
                    box-shadow ${this.transitionDuration}ms ease !important;
      }
    `;
    
    document.head.appendChild(style);
    
    // Supprimer le style après la transition
    setTimeout(() => {
      document.head.removeChild(style);
    }, this.transitionDuration);
  }

  /**
   * Met à jour le bouton de basculement de thème
   */
  updateThemeToggle(theme) {
    if (!this.themeToggle) return;
    
    const lightIcon = this.themeToggle.querySelector(Selectors.theme.lightIcon);
    const darkIcon = this.themeToggle.querySelector(Selectors.theme.darkIcon);
    
    if (lightIcon && darkIcon) {
      if (theme === 'light') {
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'block';
      } else {
        lightIcon.style.display = 'block';
        darkIcon.style.display = 'none';
      }
    }
    
    // Mettre à jour l'attribut aria-label
    this.themeToggle.setAttribute('aria-label', `Basculer vers le thème ${theme === 'light' ? 'sombre' : 'clair'}`);
  }

  /**
   * Met à jour les propriétés CSS personnalisées
   */
  updateCSSVariables(theme) {
    const root = document.documentElement;
    
    // Définir les variables CSS en fonction du thème
    const themeVariables = {
      light: {
        '--bg-primary': '#ffffff',
        '--bg-secondary': '#f8f9fa',
        '--bg-tertiary': '#e9ecef',
        '--text-primary': '#212529',
        '--text-secondary': '#6c757d',
        '--text-tertiary': '#adb5bd',
        '--accent-primary': '#007bff',
        '--accent-secondary': '#0056b3',
        '--border-primary': '#dee2e6',
        '--border-secondary': '#ced4da',
        '--shadow-primary': 'rgba(0, 0, 0, 0.1)',
        '--shadow-secondary': 'rgba(0, 0, 0, 0.05)'
      },
      dark: {
        '--bg-primary': '#1a1a1a',
        '--bg-secondary': '#2d2d2d',
        '--bg-tertiary': '#404040',
        '--text-primary': '#ffffff',
        '--text-secondary': '#b0b0b0',
        '--text-tertiary': '#808080',
        '--accent-primary': '#4dabf7',
        '--accent-secondary': '#339af0',
        '--border-primary': '#404040',
        '--border-secondary': '#525252',
        '--shadow-primary': 'rgba(0, 0, 0, 0.3)',
        '--shadow-secondary': 'rgba(0, 0, 0, 0.2)'
      }
    };
    
    const variables = themeVariables[theme];
    if (variables) {
      Object.entries(variables).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
    }
  }

  /**
   * Bascule le thème
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Configure les écouteurs d'événements
   */
  setupEventListeners() {
    // Écouteur pour le bouton de basculement
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleTheme();
      });
      
      console.log('🎛️  Écouteur de thème configuré');
    } else {
      console.warn('⚠️ Bouton de thème non trouvé');
    }
    
    // Écouteur pour les raccourcis clavier
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + D pour basculer le thème
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }

  /**
   * Configure l'observateur de thème système
   */
  setupSystemThemeObserver() {
    if (!window.matchMedia) return;
    
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Écouteur pour les changements de thème système
    darkModeQuery.addEventListener('change', (e) => {
      this.systemTheme = e.matches ? 'dark' : 'light';
      
      // Appliquer le thème système seulement si aucun thème n'est manuellement sélectionné
      const savedTheme = this.getSavedTheme();
      if (!savedTheme) {
        this.setTheme(this.systemTheme, false);
        console.log(`🖥️  Thème système changé: ${this.systemTheme}`);
      }
    });
    
    console.log('👁️  Observateur de thème système configuré');
  }

  /**
   * Déclenche les événements de thème
   */
  dispatchThemeEvents(newTheme, previousTheme) {
    // Événement général de changement de thème
    const themeChangedEvent = new CustomEvent(Events.theme.changed, {
      detail: {
        newTheme,
        previousTheme,
        timestamp: Date.now()
      }
    });
    document.dispatchEvent(themeChangedEvent);
    
    // Événements spécifiques au thème
    const themeSpecificEvent = new CustomEvent(
      newTheme === 'light' ? Events.theme.lightMode : Events.theme.darkMode,
      {
        detail: {
          theme: newTheme,
          timestamp: Date.now()
        }
      }
    );
    document.dispatchEvent(themeSpecificEvent);
    
    console.log(`📡 Événement de thème déclenché: ${Events.theme.changed}`);
  }

  /**
   * Réinitialise le thème par défaut
   */
  resetTheme() {
    localStorage.removeItem(this.localStorageKey);
    this.applyInitialTheme();
    console.log('🔄 Thème réinitialisé');
  }

  /**
   * Active ou désactive l'auto-détection
   */
  setAutoDetect(enabled) {
    this.autoDetectEnabled = enabled;
    
    if (enabled) {
      this.setupSystemThemeObserver();
      
      // Appliquer le thème système si aucun thème n'est sauvegardé
      const savedTheme = this.getSavedTheme();
      if (!savedTheme) {
        this.setTheme(this.systemTheme, false);
      }
    }
    
    console.log(`🔧 Auto-détection ${enabled ? 'activée' : 'désactivée'}`);
  }

  /**
   * Obtient le thème actuel
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Obtient le thème système
   */
  getSystemTheme() {
    return this.systemTheme;
  }

  /**
   * Vérifie si le thème sombre est actif
   */
  isDarkMode() {
    return this.currentTheme === 'dark';
  }

  /**
   * Vérifie si le thème clair est actif
   */
  isLightMode() {
    return this.currentTheme === 'light';
  }

  /**
   * Obtient les informations de thème
   */
  getThemeInfo() {
    return {
      current: this.currentTheme,
      system: this.systemTheme,
      autoDetect: this.autoDetectEnabled,
      saved: this.getSavedTheme(),
      default: this.defaultTheme
    };
  }
}

// Créer une instance globale
let themeManager;

// Initialiser le gestionnaire de thème quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  themeManager = new ThemeManager();
  window.themeManager = themeManager;
});

// Exporter les fonctions globales pour la compatibilité
window.toggleTheme = () => themeManager?.toggleTheme();
window.setTheme = (theme) => themeManager?.setTheme(theme);
window.getTheme = () => themeManager?.getCurrentTheme();
window.resetTheme = () => themeManager?.resetTheme();
window.setAutoDetect = (enabled) => themeManager?.setAutoDetect(enabled);
window.isDarkMode = () => themeManager?.isDarkMode();
window.isLightMode = () => themeManager?.isLightMode();
window.getThemeInfo = () => themeManager?.getThemeInfo();

// Exporter la classe pour une utilisation avancée
window.ThemeManager = ThemeManager;

console.log('🎨 Theme Manager prêt à être utilisé');
