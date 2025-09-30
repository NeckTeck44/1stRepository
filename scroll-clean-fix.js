// CLEAN SCROLL FIX - Solution minimaliste et fiable
console.log('🧼 CLEAN SCROLL FIX - Solution minimaliste');

// Fonction de nettoyage simple et efficace
function applyCleanScrollFix() {
  console.log('🔧 Application du clean scroll fix...');
  
  const html = document.documentElement;
  const body = document.body;
  
  // 1. Appliquer les styles de base pour le scroll
  const cleanStyles = `
    overflow-y: scroll !important;
    overflow-x: hidden !important;
    height: auto !important;
    min-height: 100vh !important;
    scroll-behavior: auto !important;
    scroll-snap-type: none !important;
  `;
  
  html.style.cssText += cleanStyles;
  body.style.cssText += cleanStyles;
  
  // 2. S'assurer que le contenu a assez de hauteur
  setTimeout(() => {
    const windowHeight = window.innerHeight;
    const contentHeight = Math.max(
      body.scrollHeight,
      html.scrollHeight,
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    
    console.log('📏 Hauteur fenêtre:', windowHeight, 'Hauteur contenu:', contentHeight);
    
    // Si le contenu est trop court, l'étendre
    if (contentHeight <= windowHeight + 100) {
      console.log('📏 Extension de la hauteur du contenu');
      body.style.minHeight = (windowHeight + 300) + 'px';
    }
    
    console.log('✅ Clean scroll fix appliqué');
  }, 100);
}

// Appliquer le fix au bon moment
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyCleanScrollFix);
} else {
  applyCleanScrollFix();
}

// Réappliquer après le chargement complet
window.addEventListener('load', applyCleanScrollFix);

// Raccourci pour réappliquer
document.addEventListener('keydown', function(e) {
  if (e.key === 'F8') {
    e.preventDefault();
    console.log('🔄 F8 - Réapplication du clean fix');
    applyCleanScrollFix();
  }
});

console.log('🎮 F8 pour réappliquer le clean fix');
