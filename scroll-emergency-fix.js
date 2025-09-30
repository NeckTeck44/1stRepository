// FIX D'URGENCE - Forcer le scroll à fonctionner
console.log('🚨 FIX D\'URGENCE POUR LE SCROLL');

// Appliquer immédiatement les corrections
function forceScrollNow() {
  console.log('🔧 Application des corrections d\'urgence...');
  
  const html = document.documentElement;
  const body = document.body;
  
  // 1. Forcer les styles de scroll
  html.style.cssText += `
    overflow: visible !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    scroll-behavior: auto !important;
    scroll-snap-type: none !important;
    height: auto !important;
    min-height: 100% !important;
  `;
  
  body.style.cssText += `
    overflow: visible !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    scroll-behavior: auto !important;
    scroll-snap-type: none !important;
    height: auto !important;
    min-height: 100vh !important;
  `;
  
  // 2. Supprimer tous les event listeners sur wheel (si possible)
  // On va ajouter un listener qui permet le scroll natif
  window.addEventListener('wheel', function(e) {
    // Laisser le scroll natif se produire
    return true;
  }, { passive: true });
  
  // 3. S'assurer que le document a assez de hauteur
  setTimeout(() => {
    const windowHeight = window.innerHeight;
    const contentHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    
    if (contentHeight <= windowHeight + 100) {
      console.log('⚠️ Extension forcée de la hauteur');
      body.style.minHeight = (windowHeight + 200) + 'px';
    }
    
    console.log('✅ Scroll d\'urgence appliqué');
  }, 100);
}

// Exécuter le fix immédiatement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', forceScrollNow);
} else {
  forceScrollNow();
}

// Exécuter aussi après le chargement complet
window.addEventListener('load', forceScrollNow);

// Raccourci pour réappliquer le fix
document.addEventListener('keydown', function(e) {
  if (e.key === 'F4') {
    e.preventDefault();
    console.log('🔄 F4 - Réapplication du fix d\'urgence');
    forceScrollNow();
  }
});

console.log('🎮 F4 pour réappliquer le fix d\'urgence');
