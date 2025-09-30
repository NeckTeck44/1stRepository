# Portfolio Alegria - NeckTeck

Un portfolio moderne et interactif développé avec HTML, CSS, JavaScript et Express, présentant les compétences, projets et motivations de NeckTeck.

## 🚀 Fonctionnalités

### Correction de Build Netlify
- **Fix du build Netlify** : Les fichiers `scroll-fix.js` et `scroll-diagnostic.js` qui causaient des erreurs ont été supprimés, ainsi que leurs références
- **Configuration Vite optimisée** : Correction de la configuration pour un build réussi
- **Scripts PowerShell améliorés** : Scripts de développement et production avec logging unique et gestion d'erreurs

### Design & Animations
- **Design moderne et épuré** avec une interface utilisateur intuitive
- **Animations fluides** et transitions entre les sections
- **Effets de particules dynamiques** au survol des éléments interactifs
- **Système de thème sombre/clair** avec animations de transition
- **Scroll fluide** avec effet de roulement naturel
- **Animations d'entrée** pour le header et les éléments de navigation

### Expérience Interactive
- **Animation de frappe** synchronisée avec son pour la section "Vision & Motivation"
- **Sons d'animation** futuristes générés avec Web Audio API
- **Effets de survol** avec soulèvement 3D pour les liens de navigation
- **Brand animé** qui change selon la section active
- **Chatbot intégré** pour l'interaction utilisateur

### Sections du Portfolio
1. **Accueil** - Introduction avec appel à l'action
2. **Vision & Motivation** - Présentation des objectifs et aspirations
3. **Projets** - Showcase des réalisations avec animations interactives
4. **Compétences** - Présentation des compétences techniques
5. **Contact** - Formulaire de contact et informations

## 🛠️ Technologies Utilisées

### Frontend
- **HTML5** - Structure sémantique du document
- **CSS3** - Animations et effets visuels avancés
- **JavaScript (ES6+)** - Logique interactive et animations
- **Vite** - Outil de build rapide et moderne
- **Web Audio API** - Génération de sons dynamiques
- **html2canvas** - Capture d'écran pour les thumbnails

### Backend
- **Express.js** - Framework web pour Node.js
- **Node.js** - Environnement d'exécution JavaScript
- **TypeScript** - Typage statique côté serveur

### Développement
- **ESLint** - Linting du code
- **Prettier** - Formatage du code
- **Git** - Contrôle de version

## 📦 Installation

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Cloner le dépôt
```bash
git clone https://github.com/votre-nom/portfolio-alegria.git
cd portfolio-alegria
```

### Installer les dépendances
```bash
# Installer les dépendances du client
cd client
npm install

# Installer les dépendances du serveur
cd ../server
npm install
```

## 🚀 Lancement du Projet

### Mode Développement

#### Option 1: Serveur complet (Express + Vite)
```bash
# Depuis la racine du projet
npm run dev
```

Le projet sera disponible à l'adresse : http://127.0.0.1:5000

#### Option 2: Serveur statique (Live Server)
```bash
# Depuis le dossier client
cd client
npm run dev:static
```

Le projet sera disponible à l'adresse : http://127.0.0.1:5500/client/

### Mode Production
```bash
# Construire le projet
npm run build

# Lancer en production
npm run start
```

## 🎨 Personnalisation

### Couleurs et Thème
Les couleurs du thème sont définies dans les variables CSS :
- `--primary-color`: Couleur principale
- `--accent-color`: Couleur d'accentuation
- `--text-color`: Couleur du texte
- `--bg-color`: Couleur de fond

### Sons d'Animation
Le projet utilise 4 variations de sons futuristes :
1. **Bleep futuriste** - Son court et percutant
2. **Whoosh de transition** - Son doux et progressif
3. **Pop impactant** - Son court et impactant
4. **Chime cristallin** - Son élégant et cristallin

Pour changer la variation, modifier la variable `soundVariation` dans le code JavaScript.

## 📁 Structure du Projet

```
portfolio-alegria/
├── client/                 # Application React
│   ├── src/               # Code source
│   │   ├── components/    # Composants React
│   │   ├── pages/         # Pages de l'application
│   │   ├── styles/        # Fichiers CSS
│   │   └── utils/         # Utilitaires
│   ├── public/            # Fichiers statiques
│   ├── index.html         # Point d'entrée HTML
│   └── package.json       # Dépendances client
├── server/               # Serveur Express
│   ├── src/              # Code source serveur
│   ├── vite.ts           # Configuration Vite serveur
│   └── package.json      # Dépendances serveur
├── config/               # Fichiers de configuration
│   ├── vite.config.ts    # Configuration Vite
│   ├── tailwind.config.cjs # Configuration Tailwind
│   ├── postcss.config.js # Configuration PostCSS
│   ├── tsconfig.json     # Configuration TypeScript
│   ├── drizzle.config.ts # Configuration Drizzle
│   └── netlify.toml      # Configuration Netlify
├── scripts/              # Scripts d'automatisation
│   ├── setup-aliases.ps1 # Configuration des alias PowerShell
│   ├── launch-dev.ps1    # Lancement développement
│   ├── launch-prod.ps1   # Lancement production
│   ├── git-auto.ps1      # Git automatique
│   ├── git-push.ps1      # Git interactif
│   ├── git-snapshot.ps1  # Git avec snapshot
│   ├── netlify-deploy.ps1 # Déploiement Netlify
│   ├── netlify-clean-deploys.ps1 # Nettoyage déploiements Netlify
│   ├── netlify-delete-sites.ps1 # Suppression sites Netlify
│   ├── cleanup-temp-files.ps1 # Nettoyage fichiers temporaires
│   ├── rotate-logs.ps1   # Rotation des logs
│   └── show-urls.ps1     # Affichage URLs
├── README.md             # Documentation
└── package.json          # Scripts du projet
```

## 🔧 Scripts Disponibles

### Client
```bash
npm run dev          # Lance le client en mode développement
npm run build        # Construit le client pour la production
npm run preview      # Prévisualise le build de production
npm run dev:static   # Lance le client en mode statique
```

### Serveur
```bash
npm run dev          # Lance le serveur en mode développement
npm run build        # Construit le serveur pour la production
npm run start        # Lance le serveur en production
```

### Racine
```bash
npm run dev          # Lance le projet complet (client + serveur)
npm run build        # Construit tout le projet
npm run start        # Lance le projet en production
```

## 🚀 Scripts d'Automatisation

### Scripts PowerShell
Pour faciliter le développement et le déploiement, plusieurs scripts PowerShell sont disponibles :

### Raccourcis de lancement
Vous avez plusieurs options pour lancer les scripts facilement :

#### Option 1: Script rapide (recommandé)
```bash
./r.ps1 git-auto      # Git automatique
./r.ps1 launch-dev    # Lancement développement
./r.ps1 launch-prod   # Lancement production
./r.ps1 cleanup       # Nettoyage fichiers
./r.ps1 show-urls     # Afficher URLs
```

#### Option 2: Alias permanents (déjà configurés)
Les alias sont maintenant permanents et fonctionnent depuis n'importe quel dossier :
```bash
git-auto                     # Git automatique
launch-dev                   # Lancement développement
launch-prod                  # Lancement production
cleanup                      # Nettoyage fichiers
show-urls                    # Afficher URLs
git-push                     # Git interactif
git-snapshot                 # Git avec snapshot
netlify-deploy               # Déploiement Netlify
```

> **Note** : Les alias sont configurés dans votre profil PowerShell et s'activent automatiquement à chaque nouvelle session.

#### Option 2bis: Configuration manuelle (si nécessaire)
```bash
./scripts/setup-aliases.ps1   # Configure les alias pour la session actuelle
./r.ps1 setup-aliases         # Ou avec le script rapide
```

#### Option 3: Chemin complet
```bash
./scripts/git-auto.ps1
./scripts/launch-dev.ps1
./scripts/launch-prod.ps1
```

#### Déploiement en Production
```bash
./scripts/launch-prod.ps1
```
- Nettoie et reconstruit tout le projet
- Installe les dépendances si nécessaires
- Lance le serveur de production sur le port 5000
- Idéal pour le déploiement local

#### Git Automatique
```bash
./scripts/git-auto.ps1
```
- Ajoute tous les fichiers modifiés (`git add .`)
- Crée un commit avec message automatique
- Envoie les changements vers le dépôt distant
- Parfait pour les sauvegardes rapides

#### Git Interactif
```bash
./scripts/git-push.ps1
```
- Permet de personnaliser le message de commit
- Affiche l'état Git avant de commit
- Plus sécurisé et descriptif
- Recommandé pour les commits importants

## 🌐 Déploiement

### Vercel (Recommandé)
1. Connectez votre dépôt GitHub à Vercel
2. Configurez les variables d'environnement si nécessaire
3. Déployez automatiquement à chaque push

### Netlify
1. Connectez votre dépôt GitHub à Netlify
2. Configurez la commande de build : `npm run build`
3. Configurez le dossier de publication : `dist`
4. Déployez automatiquement

### Serveur Personnalisé
```bash
# Construire le projet
npm run build

# Lancer le serveur de production
npm run start
```

## 🤝 Contribuer

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Push sur la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est sous license MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👤 Auteur

**NeckTeck**
- Portfolio : [Portfolio Alegria](https://votre-portfolio.com)
- GitHub : [@votre-nom](https://github.com/votre-nom)
- LinkedIn : [votre-profil](https://linkedin.com/in/votre-profil)

## 🙏 Remerciements

- Merci à toute l'équipe qui a contribué à ce projet
- Inspiré par les meilleurs portfolios modernes
- Conçu avec passion et attention aux détails

---

**Portfolio Alegria** - Une vitrine numérique moderne et interactive pour présenter votre talent et votre créativité.
