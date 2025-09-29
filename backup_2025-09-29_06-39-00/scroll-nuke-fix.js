// NUCLEAR SCROLL FIX - Solution ultime pour forcer le scroll
console.log('☢️ NUCLEAR SCROLL FIX ACTIVÉ - Solution ultime');

// Fonction pour nettoyer TOUT ce qui pourrait bloquer le scroll
function nukeScrollBlockers() {
  console.log('💥 Nuclear strike sur tous les bloqueurs de scroll...');
  
  const html = document.documentElement;
  const body = document.body;
  
  // 1. NETTOYAGE CSS AGRESSIF
  const resetStyles = `
    overflow: visible !important;
    overflow-x: hidden !important;
    overflow-y: scroll !important;
    position: static !important;
    height: auto !important;
    min-height: 100vh !important;
    max-height: none !important;
    width: auto !important;
    max-width: none !important;
    transform: none !important;
    transition: none !important;
    animation: none !important;
    scroll-behavior: auto !important;
    scroll-snap-type: none !important;
    scroll-snap-align: none !important;
    scroll-snap-stop: normal !important;
    scroll-padding: 0 !important;
    scroll-margin: 0 !important;
    overscroll-behavior: auto !important;
    -webkit-overflow-scrolling: touch !important;
    touch-action: auto !important;
    pointer-events: auto !important;
    z-index: auto !important;
    float: none !important;
    clear: none !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  `;
  
  // Appliquer à html et body
  html.style.cssText += resetStyles;
  body.style.cssText += resetStyles;
  
  // 2. NETTOYAGE DE TOUS LES ÉLÉMENTS
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    const currentOverflow = computedStyle.getPropertyValue('overflow');
    const currentOverflowY = computedStyle.getPropertyValue('overflow-y');
    const currentOverflowX = computedStyle.getPropertyValue('overflow-x');
    const currentPosition = computedStyle.getPropertyValue('position');
    const currentHeight = computedStyle.getPropertyValue('height');
    const currentMinHeight = computedStyle.getPropertyValue('min-height');
    
    // Réinitialiser les propriétés problématiques
    if (currentOverflow === 'hidden' || currentOverflowY === 'hidden' || currentOverflowX === 'hidden') {
      element.style.setProperty('overflow', 'visible', 'important');
      element.style.setProperty('overflow-x', 'visible', 'important');
      element.style.setProperty('overflow-y', 'visible', 'important');
    }
    
    if (currentPosition === 'fixed' && element !== document.querySelector('.site-header') && element !== document.querySelector('.music-control')) {
      // Garder seulement les éléments fixes essentiels
      element.style.setProperty('position', 'static', 'important');
    }
    
    if (currentHeight === '100vh' || currentMinHeight === '100vh') {
      // Réduire la hauteur pour permettre le scroll
      element.style.setProperty('min-height', 'auto', 'important');
      element.style.setProperty('height', 'auto', 'important');
    }
  });
  
  // 3. SUPPRESSION DES EVENT LISTENERS PROBLÉMATIQUES
  // On ne peut pas facilement supprimer des event listeners anonymes, donc on va les neutraliser
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'wheel' || type === 'scroll') {
      console.log('🚫 Event listener bloqué:', type);
      return; // Bloquer l'ajout de nouveaux listeners wheel/scroll
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
  
  // 4. FORCER LE SCROLL NATIF
  window.addEventListener('wheel', function(e) {
    // Laisser le navigateur gérer le scroll normalement
    return true;
  }, { passive: true });
  
  // 5. VÉRIFIER ET ÉTENDRE LA HAUTEUR SI NÉCESSAIRE
  setTimeout(() => {
    const windowHeight = window.innerHeight;
    const contentHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.scrollHeight,
      html.offsetHeight,
      document.documentElement.scrollHeight
    );
    
    console.log('📏 Hauteur fenêtre:', windowHeight, 'Hauteur contenu:', contentHeight);
    
    if (contentHeight <= windowHeight + 100) {
      console.log('⚠️ Extension forcée de la hauteur du contenu');
      body.style.minHeight = (windowHeight * 2) + 'px';
      
      // Ajouter du contenu factice si nécessaire
      if (contentHeight <= windowHeight + 50) {
        const spacer = document.createElement('div');
        spacer.style.height = (windowHeight * 1.5) + 'px';
        spacer.style.background = 'transparent';
        spacer.id = 'nuclear-scroll-spacer';
        body.appendChild(spacer);
        console.log('📦 Spacer ajouté pour forcer le scroll');
      }
    }
    
    console.log('✅ Nuclear scroll fix appliqué avec succès');
  }, 200);
}

// Exécuter le fix de manière agressive
function applyNuclearFix() {
  // Exécuter immédiatement
  nukeScrollBlockers();
  
  // Réexécuter après le chargement du DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', nukeScrollBlockers);
  }
  
  // Réexécuter après le chargement complet
  window.addEventListener('load', nukeScrollBlockers);
  
  // Réexécuter périodiquement pour s'assurer que rien ne rétablit les bloqueurs
  setInterval(nukeScrollBlockers, 3000);
}

// Démarrer le fix
applyNuclearFix();

// Raccourci pour réappliquer manuellement
document.addEventListener('keydown', function(e) {
  if (e.key === 'F9') {
    e.preventDefault();
    console.log('🔄 F9 - Réapplication du nuclear fix');
    nukeScrollBlockers();
  }
  
  if (e.key === 'F10') {
    e.preventDefault();
    console.log('🧹 F10 - Nettoyage spacer');
    const spacer = document.getElementById('nuclear-scroll-spacer');
    if (spacer) {
      spacer.remove();
      console.log('🗑️ Spacer supprimé');
    }
  }
});

console.log('🎮 F9 pour réappliquer le nuclear fix');
console.log('🎮 F10 pour supprimer le spacer');
