# Règles du Projet

## Structure des Fichiers

- Le code HTML principal se trouve dans `index.html`
- Les styles sont dans le dossier `css/`
- Les scripts JavaScript sont dans le dossier `js/`
- Les images sont stockées dans `assets/images/`
- Les sons sont stockés dans `assets/sounds/`

## Conventions de Code

### HTML

- Utiliser une indentation de 2 espaces
- Les attributs doivent utiliser des guillemets doubles
- Toujours inclure les balises optionnelles de fermeture
- Les noms de classes en kebab-case (ex: `main-container`)

### CSS

- Suivre la méthodologie BEM pour les noms de classe
- Organiser les propriétés par catégorie (position, display, box model, etc.)
- Utiliser des variables CSS pour les couleurs et les tailles réutilisables

### JavaScript

- Utiliser `const` par défaut, `let` si nécessaire, éviter `var`
- Utiliser des fonctions fléchées pour les callbacks
- Nommer les fonctions et variables en camelCase
- Commenter les parties complexes du code

## Workflow Git

- Faire des commits atomiques avec des messages clairs et descriptifs
- Créer des branches pour les nouvelles fonctionnalités (feature/nom-de-la-fonctionnalité)
- Faire des pull requests pour les revues de code

## Bonnes Pratiques

- Vérifier la compatibilité navigateur pour les fonctionnalités utilisées
- Optimiser les images avant de les ajouter au projet
- Minimifier les fichiers CSS et JavaScript en production
- Tester sur différents appareils et tailles d'écran

## Environnement Windows / PowerShell

### Configuration

- Utiliser PowerShell comme terminal par défaut sous Windows
- Configurer l'exécution de scripts si nécessaire :
  ```powershell
  Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
- Pour les chemins de fichiers, utiliser des barres obliques (/) ou des doubles backslashes (\\\)

### Commandes utiles

- Pour lancer un serveur local :
  ```powershell
  python -m http.server 8000
  ```
- Pour vérifier les processus en cours :
  ```powershell
  Get-Process | Where-Object { $_.ProcessName -like "*chrome*" -or $_.ProcessName -like "*node*" }
  ```

## Validation et Qualité du Code

### Vérifications Obligatoires

- Vérifier systématiquement les doublons de code avant toute modification
- S'assurer de la bonne fermeture de toutes les balises HTML/XML
- Valider la syntaxe du code avant de le proposer
- Vérifier les conflits potentiels avec le code existant
- Contrôler l'indentation et le formatage

### Structure du Projet

- Respecter l'architecture des dossiers existante
- Vérifier les dépendances entre les fichiers avant modification
- Maintenir la cohérence des imports et des chemins
- Documenter les nouvelles structures créées

## Directives pour l'IA

### Comportement attendu

- Se concentrer uniquement sur la tâche demandée
- Ne pas apporter de modifications non sollicitées
- Répondre précisément aux questions posées sans supposer d'actions à entreprendre
- Demander une confirmation avant d'effectuer des changements importants
- Expliquer clairement les modifications proposées avant de les appliquer
- Respecter la structure et le style existants du code

### Limitations

- Ne pas inventer de fonctionnalités non demandées
- Ne pas modifier des parties du code non liées à la demande
- Ne pas prendre d'initiative sans validation explicite
- Se limiter aux fichiers et dossiers explicitement mentionnés

## Dépendances

- Documenter toute dépendance externe utilisée
- Maintenir un fichier `package.json` à jour si nécessaire
