/**
 * Gestionnaire de thème pour le portfolio
 * Permet de basculer entre les thèmes clair et sombre
 */

document.addEventListener("DOMContentLoaded", function () {
  // Vérifier le thème sauvegardé ou utiliser le thème par défaut
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  // Mettre à jour l'icône du bouton de thème
  updateThemeToggleButton(savedTheme);

  // Ajouter un gestionnaire d'événements pour le bouton de basculement de thème
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
});

/**
 * Bascule entre les thèmes clair et sombre
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  // Appliquer le nouveau thème
  document.documentElement.setAttribute("data-theme", newTheme);

  // Sauvegarder le thème
  localStorage.setItem("theme", newTheme);

  // Mettre à jour l'icône du bouton
  updateThemeToggleButton(newTheme);
}

/**
 * Met à jour l'icône du bouton de basculement de thème
 * @param {string} theme - Le thème actuel ('light' ou 'dark')
 */
function updateThemeToggleButton(theme) {
  const themeToggle = document.querySelector(".theme-toggle");
  if (!themeToggle) return;

  if (theme === "light") {
    themeToggle.innerHTML = "☾"; // Icône de lune pour le thème clair
  } else {
    themeToggle.innerHTML = "☼"; // Icône de soleil pour le thème sombre
  }
}

// Exposer la fonction de basculement de thème globalement
window.toggleTheme = toggleTheme;
