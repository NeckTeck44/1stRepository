// Navigation Manager - Gestion centralisée de la navigation
console.log('🧭 Navigation Manager chargé');

/**
 * Classe de gestion de la navigation
 */
class NavigationManager {
  constructor() {
    this.navLinks = [];
    this.sections = [];
    this.currentSection = null;
    this.isScrolling = false;
    this.mobileMenuOpen = false;
    this.scrollSpyActive = ConfigUtils.get('navigation.scrollSpy') !== false;
    this.smoothScrollEnabled = ConfigUtils.get('navigation.smoothScroll') !== false;
    this.scrollDuration = ConfigUtils.get('navigation.scrollDuration') || 800;
    this.scrollOffset = ConfigUtils.get('navigation.scrollOffset') || 70;
    this.mobileBreakpoint = ConfigUtils.get('navigation.mobileBreakpoint') || 768;
    
    // Variables pour la détection de scroll améliorée
    this.lastScrollPosition = 0;
    this.scrollTimeout = null;
    this.isScrollingFast = false;
    this.lastScrollTime = 0;
    this.scrollCheckInterval = null;
    
    this.init();
  }

  /**
   * Initialise le gestionnaire de navigation
   */
  init() {
    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupNavigation());
    } else {
      this.setupNavigation();
    }
  }

  /**
   * Configure la navigation
   */
  setupNavigation() {
    try {
      // Récupérer les éléments de navigation
      this.navLinks = Array.from(document.querySelectorAll(Selectors.nav.links));
      this.sections = Array.from(document.querySelectorAll('section[id]'));
      
      // Configurer les événements
      this.setupEventListeners();
      
      // Initialiser le scroll spy
      if (this.scrollSpyActive) {
        this.setupScrollSpy();
        this.setupEnhancedScrollDetection();
      }
      
      // Mettre à jour les liens actifs
      this.updateActiveLinks();
      
      console.log('✅ Navigation Manager initialisé');
      console.log(`📌 ${this.navLinks.length} liens de navigation trouvés`);
      console.log(`📑 ${this.sections.length} sections trouvées`);
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de la navigation:', error);
    }
  }

  /**
   * Configure les écouteurs d'événements
   */
  setupEventListeners() {
    // Événements de clic sur les liens de navigation
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavLinkClick(e));
    });

    // Événement de défilement
    window.addEventListener('scroll', this.throttle(() => {
      if (this.scrollSpyActive) {
        this.updateActiveLinks();
      }
    }, 100));

    // Événement de redimensionnement
    window.addEventListener('resize', this.debounce(() => {
      this.updateActiveLinks();
    }, 250));

    // Toggle menu mobile
    const mobileToggle = document.querySelector(Selectors.nav.mobileToggle);
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Fermer le menu mobile lors du clic sur un lien
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.mobileMenuOpen) {
          this.closeMobileMenu();
        }
      });
    });

    // Fermer le menu mobile lors du clic en dehors
    document.addEventListener('click', (e) => {
      const mobileMenu = document.querySelector(Selectors.nav.mobileMenu);
      const mobileToggle = document.querySelector(Selectors.nav.mobileToggle);
      
      if (this.mobileMenuOpen && mobileMenu && !mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Gestion des touches clavier
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  /**
   * Gère le clic sur un lien de navigation
   * @param {Event} e - Événement de clic
   */
  handleNavLinkClick(e) {
    e.preventDefault();
    
    const link = e.currentTarget;
    const href = link.getAttribute('href');
    
    if (!href || href === '#') return;
    
    const targetId = href.startsWith('#') ? href.substring(1) : href;
    const targetSection = document.getElementById(targetId);
    
    if (!targetSection) {
      console.warn(`⚠️ Section non trouvée: ${targetId}`);
      return;
    }
    
    // Émettre un événement
    this.dispatchEvent('linkClick', { link, targetId, targetSection });
    
    // Défiler vers la section
    this.scrollToSection(targetSection);
    
    // Jouer un son de clic si l'audio est activé
    if (window.playClickSound) {
      window.playClickSound();
    }
  }

  /**
   * Défile vers une section spécifique
   * @param {HTMLElement} section - Section cible
   * @param {number} duration - Durée du défilement (ms)
   */
  scrollToSection(section, duration = this.scrollDuration) {
    if (!section || this.isScrolling) return;
    
    this.isScrolling = true;
    
    const targetPosition = section.offsetTop - this.scrollOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    
    if (this.smoothScrollEnabled && duration > 0) {
      // Défilement fluide
      const startTime = performance.now();
      
      const animateScroll = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Fonction d'accélération (ease-in-out)
        const easeInOut = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        window.scrollTo(0, startPosition + distance * easeInOut);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          this.isScrolling = false;
          this.updateActiveLinks();
        }
      };
      
      requestAnimationFrame(animateScroll);
    } else {
      // Défilement instantané
      window.scrollTo(0, targetPosition);
      this.isScrolling = false;
      this.updateActiveLinks();
    }
    
    // Émettre un événement
    this.dispatchEvent('scroll', { section, duration });
  }

  /**
   * Configure le scroll spy
   */
  setupScrollSpy() {
    // Créer un Intersection Observer pour détecter les sections visibles
    const observerOptions = {
      root: null,
      rootMargin: `-${this.scrollOffset}px 0px -${window.innerHeight - this.scrollOffset - 150}px 0px`,
      threshold: [0.44]
    };
    
    const observer = new IntersectionObserver((entries) => {
      let bestSection = null;
      let maxVisibility = 0;
      
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const visibilityRatio = entry.intersectionRatio;
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight;
          const centerDistance = Math.abs(rect.top + rect.height/2 - viewportHeight/2);
          const score = visibilityRatio * 2000 - centerDistance;
          
          if (score > maxVisibility) {
            maxVisibility = score;
            bestSection = entry.target;
          }
        }
      });
      
      if (bestSection && bestSection !== this.currentSection) {
        this.currentSection = bestSection;
        this.updateActiveLinks();
      }
    }, observerOptions);
    
    // Observer toutes les sections
    this.sections.forEach(section => {
      observer.observe(section);
    });
  }

  /**
   * Configure un système de détection de scroll amélioré
   */
  setupEnhancedScrollDetection() {
    // Écouteur de scroll avec détection de vitesse
    window.addEventListener('scroll', () => {
      const currentTime = Date.now();
      const currentScrollPosition = window.pageYOffset;
      const scrollDelta = Math.abs(currentScrollPosition - this.lastScrollPosition);
      const timeDelta = currentTime - this.lastScrollTime;
      
      // Détecter si le scroll est rapide
      this.isScrollingFast = timeDelta > 0 && scrollDelta / timeDelta > 2;
      
      this.lastScrollPosition = currentScrollPosition;
      this.lastScrollTime = currentTime;
      
      // Annuler le timeout précédent
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
      
      // Si le scroll est rapide, vérifier plus fréquemment
      if (this.isScrollingFast) {
        this.forceUpdateActiveSection();
        this.scrollTimeout = setTimeout(() => {
          this.forceUpdateActiveSection();
        }, 50);
      } else {
        // Scroll normal - vérifier après un court délai
        this.scrollTimeout = setTimeout(() => {
          this.forceUpdateActiveSection();
        }, 100);
      }
    }, { passive: true });
    
    // Vérification périodique pendant le scroll rapide
    this.startScrollCheckInterval();
  }

  /**
   * Démarre un intervalle de vérification pendant le scroll
   */
  startScrollCheckInterval() {
    if (this.scrollCheckInterval) {
      clearInterval(this.scrollCheckInterval);
    }
    
    this.scrollCheckInterval = setInterval(() => {
      if (this.isScrollingFast) {
        this.forceUpdateActiveSection();
      }
    }, 150);
    
    // Arrêter l'intervalle après 2 secondes d'inactivité
    setTimeout(() => {
      if (this.scrollCheckInterval) {
        clearInterval(this.scrollCheckInterval);
        this.scrollCheckInterval = null;
      }
    }, 2000);
  }

  /**
   * Force la mise à jour de la section active
   */
  forceUpdateActiveSection() {
    if (this.isScrolling) return;
    
    const scrollPosition = window.pageYOffset + this.scrollOffset + 30;
    const viewportHeight = window.innerHeight;
    
    const bestSection = this.sections.reduce((best, section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionBottom + 100) {
        const centerDistance = Math.abs((sectionTop + sectionHeight/2) - (scrollPosition + viewportHeight/2));
        const visibilityScore = 2000 - centerDistance;
        
        if (!best || visibilityScore > best.score) {
          return { section, score: visibilityScore };
        }
      }
      return best;
    }, null)?.section;
    
    if (bestSection && bestSection !== this.currentSection) {
      this.currentSection = bestSection;
      this.updateActiveLinks();
    }
  }

  /**
   * Met à jour les liens de navigation actifs
   */
  updateActiveLinks() {
    if (this.isScrolling) return;
    
    let activeSection = this.currentSection;
    
    // Si aucune section n'est définie, la déterminer par la position de défilement
    if (!activeSection) {
      const scrollPosition = window.pageYOffset + this.scrollOffset + 50;
      const viewportHeight = window.innerHeight;
      
      activeSection = this.sections.reduce((best, section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          const centerDistance = Math.abs((sectionTop + sectionHeight/2) - (scrollPosition + viewportHeight/2));
          const visibilityScore = 1000 - centerDistance;
          
          if (!best || visibilityScore > best.score) {
            return { section, score: visibilityScore };
          }
        }
        return best;
      }, null)?.section;
    }
    
    // Mettre à jour les classes actives
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      
      const targetId = href.startsWith('#') ? href.substring(1) : href;
      
      if (activeSection && activeSection.id === targetId) {
        link.classList.add(Classes.navigation.active);
      } else {
        link.classList.remove(Classes.navigation.active);
      }
    });
  }

  /**
   * Ouvre le menu mobile
   */
  openMobileMenu() {
    const mobileMenu = document.querySelector(Selectors.nav.mobileMenu);
    const mobileToggle = document.querySelector(Selectors.nav.mobileToggle);
    
    if (mobileMenu) {
      mobileMenu.classList.add(Classes.navigation.mobileOpen);
      this.mobileMenuOpen = true;
      
      // Bloquer le défilement du body
      document.body.style.overflow = 'hidden';
      
      // Émettre un événement
      this.dispatchEvent('mobileToggle', { open: true });
      
      console.log('📱 Menu mobile ouvert');
    }
  }

  /**
   * Ferme le menu mobile
   */
  closeMobileMenu() {
    const mobileMenu = document.querySelector(Selectors.nav.mobileMenu);
    const mobileToggle = document.querySelector(Selectors.nav.mobileToggle);
    
    if (mobileMenu) {
      mobileMenu.classList.remove(Classes.navigation.mobileOpen);
      this.mobileMenuOpen = false;
      
      // Réactiver le défilement du body
      document.body.style.overflow = '';
      
      // Émettre un événement
      this.dispatchEvent('mobileToggle', { open: false });
      
      console.log('📱 Menu mobile fermé');
    }
  }

  /**
   * Bascule le menu mobile
   */
  toggleMobileMenu() {
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Vérifie si le menu mobile est ouvert
   * @returns {boolean}
   */
  isMobileMenuOpen() {
    return this.mobileMenuOpen;
  }

  /**
   * Vérifie si l'affichage est mobile
   * @returns {boolean}
   */
  isMobile() {
    return window.innerWidth <= this.mobileBreakpoint;
  }

  /**
   * Obtient la section actuellement active
   * @returns {HTMLElement|null}
   */
  getActiveSection() {
    return this.currentSection;
  }

  /**
   * Obtient le lien de navigation actif
   * @returns {HTMLElement|null}
   */
  getActiveLink() {
    return this.navLinks.find(link => link.classList.contains(Classes.navigation.active)) || null;
  }

  /**
   * Défile vers le haut de la page
   * @param {number} duration - Durée du défilement
   */
  scrollToTop(duration = this.scrollDuration) {
    this.scrollToSection(document.body, duration);
  }

  /**
   * Défile vers le bas de la page
   * @param {number} duration - Durée du défilement
   */
  scrollToBottom(duration = this.scrollDuration) {
    const bottomSection = this.sections[this.sections.length - 1];
    if (bottomSection) {
      this.scrollToSection(bottomSection, duration);
    }
  }

  /**
   * Défile vers une section par son ID
   * @param {string} sectionId - ID de la section
   * @param {number} duration - Durée du défilement
   */
  scrollToSectionById(sectionId, duration = this.scrollDuration) {
    const section = document.getElementById(sectionId);
    if (section) {
      this.scrollToSection(section, duration);
    } else {
      console.warn(`⚠️ Section non trouvée: ${sectionId}`);
    }
  }

  /**
   * Active ou désactive le scroll spy
   * @param {boolean} active - État du scroll spy
   */
  setScrollSpyActive(active) {
    this.scrollSpyActive = active;
    console.log(`🔍 Scroll spy ${active ? 'activé' : 'désactivé'}`);
  }

  /**
   * Active ou désactive le défilement fluide
   * @param {boolean} enabled - État du défilement fluide
   */
  setSmoothScrollEnabled(enabled) {
    this.smoothScrollEnabled = enabled;
    console.log(`🌊 Défilement fluide ${enabled ? 'activé' : 'désactivé'}`);
  }

  /**
   * Définit la durée du défilement
   * @param {number} duration - Durée en millisecondes
   */
  setScrollDuration(duration) {
    this.scrollDuration = Math.max(0, duration);
    console.log(`⏱️ Durée de défilement définie à ${this.scrollDuration}ms`);
  }

  /**
   * Définit l'offset de défilement
   * @param {number} offset - Offset en pixels
   */
  setScrollOffset(offset) {
    this.scrollOffset = Math.max(0, offset);
    console.log(`📏 Offset de défilement défini à ${this.scrollOffset}px`);
  }

  /**
   * Émet un événement de navigation
   * @param {string} type - Type d'événement
   * @param {Object} data - Données de l'événement
   */
  dispatchEvent(type, data = {}) {
    const event = new CustomEvent(Events.navigation[type], {
      detail: { ...data, timestamp: Date.now() }
    });
    document.dispatchEvent(event);
  }

  /**
   * Fonction de debounce
   * @param {Function} func - Fonction à débouncer
   * @param {number} wait - Temps d'attente
   * @returns {Function}
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Fonction de throttle
   * @param {Function} func - Fonction à throttliser
   * @param {number} limit - Limite de temps
   * @returns {Function}
   */
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Obtient l'état actuel de la navigation
   * @returns {Object}
   */
  getStatus() {
    return {
      navLinksCount: this.navLinks.length,
      sectionsCount: this.sections.length,
      currentSection: this.currentSection?.id || null,
      isScrolling: this.isScrolling,
      mobileMenuOpen: this.mobileMenuOpen,
      scrollSpyActive: this.scrollSpyActive,
      smoothScrollEnabled: this.smoothScrollEnabled,
      scrollDuration: this.scrollDuration,
      scrollOffset: this.scrollOffset,
      isMobile: this.isMobile()
    };
  }
}

// Créer une instance globale
let navigationManager;

// Initialiser le gestionnaire de navigation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  navigationManager = new NavigationManager();
  window.navigationManager = navigationManager;
});

// Exporter les fonctions globales pour la compatibilité
window.scrollToSection = (sectionId, duration) => navigationManager?.scrollToSectionById(sectionId, duration);
window.scrollToTop = (duration) => navigationManager?.scrollToTop(duration);
window.scrollToBottom = (duration) => navigationManager?.scrollToBottom(duration);
window.openMobileMenu = () => navigationManager?.openMobileMenu();
window.closeMobileMenu = () => navigationManager?.closeMobileMenu();
window.toggleMobileMenu = () => navigationManager?.toggleMobileMenu();
window.getNavigationStatus = () => navigationManager?.getStatus();

console.log('🧭 Navigation Manager prêt à être initialisé');
