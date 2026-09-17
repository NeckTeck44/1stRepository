# Portfolio Statique

Ce dossier contient une version autonome et portable de votre portfolio. Il est prêt à être déployé sur n'importe quel hébergeur de fichiers statiques (Netlify, Vercel, GitHub Pages, etc.).

## Structure des dossiers

```
portfolio-static/
├── assets/               # Ressources statiques
│   ├── images/           # Toutes les images
│   └── sounds/           # Fichiers audio
├── css/                  # Feuilles de style
│   └── styles.min.css    # CSS principal
├── js/                   # Fichiers JavaScript
│   ├── config-utils.js   # Configuration
│   ├── theme-manager.js  # Gestion des thèmes
│   └── audio-manager.js  # Gestion de l'audio
└── index.html            # Page principale
```

## Comment l'utiliser

1. **En local** : 
   - Double-cliquez sur `index.html` pour l'ouvrir dans votre navigateur
   - Ou utilisez Live Server dans VS Code

2. **En production** :
   - Téléversez simplement le contenu du dossier sur votre hébergeur préféré
   - Aucune dépendance serveur requise

## Personnalisation

- **Images** : Remplacez les fichiers dans `assets/images/`
- **Styles** : Modifiez `css/styles.min.css`
- **Contenu** : Éditez `index.html` directement

## Fonctionnalités

- Design responsive
- Mode sombre/clair
- Effets d'animation
- Gestion audio intégrée
- Compatible avec tous les navigateurs modernes
