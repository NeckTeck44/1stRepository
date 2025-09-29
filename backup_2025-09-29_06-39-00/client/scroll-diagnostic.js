// Scroll Diagnostic Tool - Outil de diagnostic optimisé pour le défilement
console.log('🔍 Outil de diagnostic scroll activé (mode non-intrusif)');

/**
 * Classe de diagnostic scroll
 */
class ScrollDiagnostic {
  constructor() {
    this.isActive = false;
    this.diagnosticData = {};
  }

  /**
   * Exécute un diagnostic complet du scroll
   * @param {boolean} verbose - Mode verbeux
   */
  diagnose(verbose = false) {
    if (verbose) {
      console.log('🔍 DÉBUT DU DIAGNOSTIC SCROLL...');
    }

    const html = document.documentElement;
    const body = document.body;

    // Collecte des données
    this.diagnosticData = {
      timestamp: new Date().toISOString(),
      window: {
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        scrollY: window.scrollY,
        pageYOffset: window.pageYOffset
      },
      html: this.getElementStyles(html),
      body: this.getElementStyles(body),
      scrollInfo: this.getScrollInfo(html, body),
      issues: this.detectIssues(html, body)
    };

    if (verbose) {
      this.displayResults();
    }

    return this.diagnosticData;
  }

  /**
   * Récupère les styles CSS d'un élément
   * @param {HTMLElement} element
   * @returns {Object}
   */
  getElementStyles(element) {
    const style = window.getComputedStyle(element);
    return {
      overflow: style.overflow,
      overflowX: style.overflowX,
      overflowY: style.overflowY,
      height: style.height,
      minHeight: style.minHeight,
      maxHeight: style.maxHeight,
      position: style.position,
      scrollBehavior: style.scrollBehavior,
      scrollSnapType: style.scrollSnapType
    };
  }

  /**
   * Récupère les informations de scroll
   * @param {HTMLElement} html
   * @param {HTMLElement} body
   * @returns {Object}
   */
  getScrollInfo(html, body) {
    const canScroll = html.scrollHeight > window.innerHeight || body.scrollHeight > window.innerHeight;
    return {
      canScroll: canScroll,
      heightDifference: Math.max(html.scrollHeight, body.scrollHeight) - window.innerHeight,
      htmlScrollHeight: html.scrollHeight,
      htmlOffsetHeight: html.offsetHeight,
      htmlClientHeight: html.clientHeight,
      bodyScrollHeight: body.scrollHeight,
      bodyOffsetHeight: body.offsetHeight,
      bodyClientHeight: body.clientHeight
    };
  }

  /**
   * Détecte les problèmes potentiels
   * @param {HTMLElement} html
   * @param {HTMLElement} body
   * @returns {Array}
   */
  detectIssues(html, body) {
    const issues = [];
    const htmlStyle = window.getComputedStyle(html);
    const bodyStyle = window.getComputedStyle(body);

    // Vérifier les overflow cachés
    if (htmlStyle.overflow === 'hidden' || htmlStyle.overflowY === 'hidden') {
      issues.push({
        type: 'overflow_hidden',
        element: 'html',
        severity: 'high',
        message: 'Overflow caché sur l\'élément html'
      });
    }

    if (bodyStyle.overflow === 'hidden' || bodyStyle.overflowY === 'hidden') {
      issues.push({
        type: 'overflow_hidden',
        element: 'body',
        severity: 'high',
        message: 'Overflow caché sur l\'élément body'
      });
    }

    // Vérifier si le scroll est possible
    const canScroll = html.scrollHeight > window.innerHeight || body.scrollHeight > window.innerHeight;
    if (!canScroll) {
      issues.push({
        type: 'no_scroll_possible',
        element: 'document',
        severity: 'medium',
        message: 'Le contenu est trop court pour permettre le scroll'
      });
    }

    return issues;
  }

  /**
   * Affiche les résultats du diagnostic
   */
  displayResults() {
    console.log('📊 RÉSULTATS DU DIAGNOSTIC:');
    console.log('================================');
    
    console.log('📏 Dimensions:');
    console.log('  Window innerHeight:', this.diagnosticData.window.innerHeight);
    console.log('  HTML scrollHeight:', this.diagnosticData.scrollInfo.htmlScrollHeight);
    console.log('  BODY scrollHeight:', this.diagnosticData.scrollInfo.bodyScrollHeight);
    console.log('  Scroll possible:', this.diagnosticData.scrollInfo.canScroll);
    
    console.log('🎨 Styles HTML:');
    Object.entries(this.diagnosticData.html).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
    
    console.log('🎨 Styles BODY:');
    Object.entries(this.diagnosticData.body).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
    
    if (this.diagnosticData.issues.length > 0) {
      console.log('⚠️ Problèmes détectés:');
      this.diagnosticData.issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. [${issue.severity.toUpperCase()}] ${issue.message} (${issue.element})`);
      });
    } else {
      console.log('✅ Aucun problème détecté');
    }
    
    console.log('================================');
  }

  /**
   * Applique des corrections de base
   */
  applyBasicFixes() {
    console.log('🔧 Application des corrections de base...');
    
    const html = document.documentElement;
    const body = document.body;
    
    // Corrections minimales et non-intrusives
    const fixes = {
      overflow: 'visible',
      overflowX: 'hidden',
      overflowY: 'visible',
      height: 'auto',
      minHeight: '100vh'
    };
    
    Object.entries(fixes).forEach(([property, value]) => {
      html.style[property] = value;
      body.style[property] = value;
    });
    
    console.log('✅ Corrections de base appliquées');
  }

  /**
   * Exporte les données du diagnostic
   * @returns {Object}
   */
  exportData() {
    return {
      ...this.diagnosticData,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }
}

// Créer une instance globale
window.scrollDiagnostic = new ScrollDiagnostic();

// Fonctions globales pour faciliter l'utilisation
window.diagnoseScroll = (verbose = true) => window.scrollDiagnostic.diagnose(verbose);
window.fixScroll = () => window.scrollDiagnostic.applyBasicFixes();
window.exportScrollData = () => window.scrollDiagnostic.exportData();

// Diagnostic automatique au chargement (mode silencieux)
document.addEventListener('DOMContentLoaded', () => {
  const data = window.scrollDiagnostic.diagnose(false);
  
  // Appliquer des corrections seulement si des problèmes sont détectés
  if (data.issues.length > 0) {
    console.log('⚠️ Problèmes de scroll détectés, application des corrections...');
    window.scrollDiagnostic.applyBasicFixes();
  } else {
    console.log('✅ Aucun problème de scroll détecté');
  }
});

// Raccourcis clavier
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'd') {
    e.preventDefault();
    console.log('🔄 Ctrl+D - Diagnostic scroll détaillé');
    window.diagnoseScroll(true);
  } else if (e.ctrlKey && e.key === 'f') {
    e.preventDefault();
    console.log('🔧 Ctrl+F - Application des corrections scroll');
    window.fixScroll();
  }
});

console.log('🎮 Raccourcis clavier:');
console.log('   Ctrl+D - Diagnostic scroll détaillé');
console.log('   Ctrl+F - Application des corrections scroll');
console.log('💡 Fonctions disponibles:');
console.log('   diagnoseScroll(true/false) - Exécute le diagnostic');
console.log('   fixScroll() - Applique les corrections de base');
console.log('   exportScrollData() - Exporte les données du diagnostic');
