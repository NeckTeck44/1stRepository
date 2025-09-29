# Configuration du projet - Vite Build System

## 🚀 Architecture du projet

Ce projet utilise **Vite** comme outil de build final. Toutes les modifications doivent être faites en considérant que la version Vite est la version de production finale.

### 📁 Structure des dossiers

```
Portfolio Alegria - Candidature Formation/
├── client/                    # Fichiers sources
│   ├── index.html            # Page principale
│   ├── css/                  # Styles
│   ├── js/                   # Scripts JavaScript
│   ├── assets/               # Images, sons, etc.
│   └── ...                   # Autres fichiers sources
├── server/                   # Configuration et build
│   └── vite.ts              # Configuration Vite principale
└── ...                       # Autres dossiers
```

### 🔧 Workflow de développement

1. **Toujours modifier les fichiers sources** dans le dossier `client/`
2. **Vérifier la compatibilité Vite** pour chaque changement
3. **Les chemins de fichiers et imports doivent être corrects** pour le build final
4. **La configuration Vite dans `server/vite.ts`** définit comment le projet sera construit et servi

### ✅ Règles importantes à suivre

#### Pour les fichiers JavaScript :
- Utiliser des imports ES6 : `import { func } from './module.js'`
- Éviter les chemins absolus qui pourraient casser au build
- Vérifier que les assets sont correctement importés

#### Pour les chemins d'assets :
- Utiliser des chemins relatifs depuis le dossier `client/`
- S'assurer que les images et sons sont bien dans le dossier `client/`
- Vérifier que les références dans le HTML sont correctes

#### Pour le build final :
- Toujours penser que Vite va optimiser et bundler le code
- Vérifier que les modifications fonctionnent en environnement de développement avant le build
- La version de production est générée par Vite à partir des sources

### 🎯 Commandes utiles

```bash
# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build de production
npm run preview
```

### 📝 Notes importantes

- Le dossier `client/` contient les fichiers sources
- Le dossier `server/` contient la configuration de build
- La version finale est générée par Vite, pas par les fichiers sources directement
- Toujours tester en développement avant de déployer

---

*Document généré le 26/09/2025 - Configuration Vite du projet*
