// Scroll Fix - Gestion optimisée du défilement et correction des barres de scroll
console.log("🔧 Scroll Fix activé");

// S'assurer que le défilement fonctionne correctement
document.addEventListener("DOMContentLoaded", () => {
  // Activer le défilement fluide
  document.documentElement.style.scrollBehavior = "smooth";
  document.body.style.scrollBehavior = "smooth";

  // Corriger le problème de scroll horizontal
  fixHorizontalScroll();

  // S'assurer qu'il n'y a pas de blocage de défilement vertical
  document.documentElement.style.overflowY = "visible";
  document.body.style.overflowY = "visible";

  // Corriger les problèmes potentiels avec les sections
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    section.style.scrollSnapAlign = "start";
    section.style.scrollMarginTop = "70px"; // Compensation pour le header fixe

    // S'assurer que les sections ne dépassent pas la largeur
    section.style.maxWidth = "100%";
    section.style.overflowX = "hidden";
    section.style.boxSizing = "border-box";
  });

  // Corriger les images et autres éléments qui pourraient causer du scroll horizontal
  fixOverflowElements();

  console.log("✅ Défilement optimisé et scroll horizontal corrigé");
});

// Fonction pour corriger le scroll horizontal
function fixHorizontalScroll() {
  // Appliquer des styles pour empêcher le scroll horizontal
  document.documentElement.style.overflowX = "hidden";
  document.body.style.overflowX = "hidden";

  // S'assurer que le body ne dépasse pas la largeur de l'écran
  document.body.style.maxWidth = "100vw";
  document.body.style.width = "100%";
  document.body.style.boxSizing = "border-box";

  // Corriger les marges et paddings qui pourraient causer des dépassements
  document.body.style.margin = "0";
  document.body.style.padding = "0";

  console.log("📏 Scroll horizontal désactivé");
}

// Fonction pour corriger les éléments qui causent des dépassements
function fixOverflowElements() {
  // Corriger les images
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    img.style.objectFit = "contain";
  });

  // Corriger les iframes
  const iframes = document.querySelectorAll("iframe");
  iframes.forEach((iframe) => {
    iframe.style.maxWidth = "100%";
    iframe.style.height = "auto";
  });

  // Corriger les tableaux
  const tables = document.querySelectorAll("table");
  tables.forEach((table) => {
    table.style.maxWidth = "100%";
    table.style.overflowX = "auto";
    table.style.display = "block";
  });

  // Corriger les éléments avec position absolute ou fixed
  const positionedElements = document.querySelectorAll(
    '*[style*="position: absolute"], *[style*="position: fixed"]'
  );
  positionedElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      element.style.left = "auto";
      element.style.right = "0";
    }
  });

  // Corriger les éléments qui pourraient avoir une largeur fixe trop grande
  const allElements = document.querySelectorAll("*");
  allElements.forEach((element) => {
    const computedStyle = window.getComputedStyle(element);
    const width = computedStyle.width;

    // Si l'élément a une largeur fixe en pixels qui dépasse la fenêtre
    if (width.includes("px")) {
      const widthValue = parseInt(width);
      if (widthValue > window.innerWidth) {
        element.style.maxWidth = "100%";
        element.style.width = "auto";
      }
    }
  });

  console.log("🔧 Éléments causant des dépassements corrigés");
}

// Gestion des événements de défilement
window.addEventListener(
  "scroll",
  () => {
    // S'assurer que le défilement n'est pas bloqué
    if (document.body.style.overflowY === "hidden") {
      document.body.style.overflowY = "visible";
      console.log("🔓 Déblocage du défilement vertical");
    }
  },
  { passive: true }
);

// Surveiller les changements de taille de fenêtre
window.addEventListener("resize", () => {
  // Recorriger les éléments quand la fenêtre est redimensionnée
  setTimeout(() => {
    fixHorizontalScroll();
    fixOverflowElements();
    console.log("📐 Redimensionnement - corrections appliquées");
  }, 100);
});

// Fonction pour vérifier et corriger le scroll horizontal manuellement
function checkAndFixHorizontalScroll() {
  if (
    document.documentElement.scrollWidth > document.documentElement.clientWidth
  ) {
    console.warn("⚠️ Scroll horizontal détecté - application des corrections");
    fixHorizontalScroll();
    fixOverflowElements();
    return true;
  }
  return false;
}

// Exporter les fonctions pour un accès externe
window.fixHorizontalScroll = fixHorizontalScroll;
window.fixOverflowElements = fixOverflowElements;
window.checkAndFixHorizontalScroll = checkAndFixHorizontalScroll;

console.log("🖱️ Scroll natif activé avec corrections automatiques");
