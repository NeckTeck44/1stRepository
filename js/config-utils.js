// Configuration Utilities - Gestion centralisée de la configuration
console.log("⚙️  Configuration Utils chargé");

/**
 * Classe utilitaire pour la gestion de la configuration
 */
class ConfigUtils {
  constructor() {
    this.config = {
      theme: {
        autoDetect: true,
        default: "dark",
        transitionDuration: 300,
        localStorageKey: "portfolio-theme",
      },
      navigation: {
        scrollSpy: true,
        smoothScroll: true,
        scrollDuration: 800,
        scrollOffset: 70,
        mobileBreakpoint: 768,
      },
      animations: {
        enabled: true,
        scrollAnimations: true,
        typingAnimations: true,
        fadeAnimations: true,
        slideAnimations: true,
        intersectionThreshold: 0.1,
        animationDuration: 600,
        staggerDelay: 100,
      },
      audio: {
        enabled: true,
        backgroundMusic: true,
        soundEffects: true,
        volume: 0.5,
        localStorageKey: "portfolio-audio-settings",
      },
    };

    // Charger la configuration depuis le localStorage si disponible
    this.loadConfig();
  }

  /**
   * Charger la configuration depuis le localStorage
   */
  loadConfig() {
    try {
      const savedConfig = localStorage.getItem("portfolio-config");
      if (savedConfig) {
        this.config = { ...this.config, ...JSON.parse(savedConfig) };
        console.log("⚙️  Configuration chargée depuis le localStorage");
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la configuration :", error);
    }
  }

  /**
   * Sauvegarder la configuration dans le localStorage
   */
  saveConfig() {
    try {
      localStorage.setItem("portfolio-config", JSON.stringify(this.config));
      console.log("⚙️  Configuration sauvegardée dans le localStorage");
      return true;
    } catch (error) {
      console.error(
        "Erreur lors de la sauvegarde de la configuration :",
        error
      );
      return false;
    }
  }

  /**
   * Obtenir une valeur de configuration
   * @param {string} key - Clé de configuration (ex: 'theme.autoDetect')
   * @param {*} defaultValue - Valeur par défaut si la clé n'existe pas
   * @returns {*} Valeur de configuration ou valeur par défaut
   */
  static get(key, defaultValue = null) {
    const keys = key.split(".");
    let value = ConfigUtils.instance.config;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }

    return value !== undefined ? value : defaultValue;
  }

  /**
   * Définir une valeur de configuration
   * @param {string} key - Clé de configuration (ex: 'theme.autoDetect')
   * @param {*} value - Valeur à définir
   * @param {boolean} save - Si true, sauvegarde la configuration dans le localStorage
   */
  static set(key, value, save = true) {
    const keys = key.split(".");
    const lastKey = keys.pop();
    let obj = ConfigUtils.instance.config;

    for (const k of keys) {
      if (!obj[k] || typeof obj[k] !== "object") {
        obj[k] = {};
      }
      obj = obj[k];
    }

    obj[lastKey] = value;

    if (save) {
      ConfigUtils.instance.saveConfig();
    }
  }

  /**
   * Réinitialiser la configuration aux valeurs par défaut
   */
  static reset() {
    ConfigUtils.instance = new ConfigUtils();
    localStorage.removeItem("portfolio-config");
    console.log("⚙️  Configuration réinitialisée aux valeurs par défaut");
  }
}

// Créer une instance unique (singleton)
ConfigUtils.instance = new ConfigUtils();

// Exporter les fonctions statiques pour une utilisation facile
window.ConfigUtils = {
  get: ConfigUtils.get,
  set: ConfigUtils.set,
  reset: ConfigUtils.reset,
};

console.log("⚙️  Configuration Utils prêt à être utilisé");
