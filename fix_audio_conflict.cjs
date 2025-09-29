const fs = require('fs');
const path = 'c:\\Users\\catel\\Downloads\\Portfolio Alegria - Candidature Formation\\client\\index.html';

// Lire le fichier
let content = fs.readFileSync(path, 'utf8');

// Remplacer la condition du son de navigation
const oldCondition = 'if (userInteracted && (now - lastSoundTriggerTime) >= MIN_TRIGGER_INTERVAL) {';
const newCondition = 'if (userInteracted && (now - lastSoundTriggerTime) >= MIN_TRIGGER_INTERVAL && !window.typewriterAnimationActive) {';

content = content.replace(oldCondition, newCondition);

// Ajouter le message de log pour l'animation de frappe active
const oldElse = '} else if ((now - lastSoundTriggerTime) < MIN_TRIGGER_INTERVAL) {';
const newElse = '} else if ((now - lastSoundTriggerTime) < MIN_TRIGGER_INTERVAL) {\n                } else if (window.typewriterAnimationActive) {\n                    console.log("⏸️ Animation de frappe en cours - son de navigation ignoré pour éviter les conflits");';

content = content.replace(oldElse, newElse);

// Mettre à jour le commentaire
const oldComment = '// Jouer le son si l\'utilisateur a interagi ET si le délai minimum est respecté';
const newComment = '// Jouer le son si l\'utilisateur a interagi ET si le délai minimum est respecté ET si l\'animation de frappe n\'est pas active';

content = content.replace(oldComment, newComment);

// Écrire le fichier corrigé
fs.writeFileSync(path, content, 'utf8');

console.log('✅ Fichier corrigé avec succès !');
