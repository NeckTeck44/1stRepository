# Portfolio Alegria - Candidature Formation

Portfolio professionnel full-stack moderne avec React, TypeScript et Express.

## 🏗️ Architecture du Projet

### Structure Globale
```
Portfolio Alegria/
├── client/          # Application React/TypeScript (Frontend)
├── server/          # Serveur Express API (Backend)
├── shared/          # Code partagé entre frontend et backend
└── package.json     # Configuration du projet
```

### Frontend (React/TypeScript)
- **Framework**: React 19 avec TypeScript
- **Build Tool**: Vite avec Hot Module Replacement
- **Routing**: Wouter (router léger)
- **State Management**: React Query pour la gestion d'état serveur
- **Forms**: React Hook Form + Zod pour la validation
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS avec thème clair/sombre

### Backend (Express/TypeScript)
- **Framework**: Express 5 avec TypeScript
- **Database**: PostgreSQL avec Drizzle ORM
- **Authentication**: Prêt pour l'authentification
- **API**: RESTful API endpoints
- **Security**: Helmet, CORS configuré

### Design System
- **Typography**: Inter (body) + Playfair Display (headlines)
- **Colors**: Palette HSL avec support thème clair/sombre
- **Spacing**: Système modulaire (4, 8, 12, 16 units)
- **Animations**: Effets subtils et smooth scroll
- **Responsive**: Mobile-first avec container max-width 6xl

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone <votre-repo-url>
cd "Portfolio Alegria - Candidature Formation"

# Installer les dépendances
npm install
```

### Développement
```bash
# Lancer le serveur de développement complet
npm start

# Ou utiliser le script PowerShell (recommandé)
.\launch-dev.ps1
```

L'application sera disponible à `http://localhost:5000`

### Build Production
```bash
# Build du frontend
cd client
npm run build

# Retour à la racine pour le serveur production
cd ..
npm start
```

## 📁 Structure des Dossiers

### `/client` - Frontend React
```
client/
├── src/                    # Code source React
│   ├── components/         # Composants UI
│   ├── pages/             # Pages de l'application
│   ├── hooks/             # Custom hooks
│   ├── assets/            # Images et assets
│   └── utils/             # Utilitaires
├── public/                # Fichiers statiques
├── vite.config.ts         # Configuration Vite
└── package.json           # Dépendances frontend
```

### `/server` - Backend Express
```
server/
├── index.ts              # Point d'entrée du serveur
├── routes/               # Définition des routes API
├── middleware/           # Middleware Express
├── db/                   # Configuration base de données
└── package.json          # Dépendances backend
```

## 🎨 Fonctionnalités

### Frontend
- ✅ Thème clair/sombre avec persistance
- ✅ Animations fluides et interactions
- ✅ Design responsive mobile-first
- ✅ Composants accessibles (a11y)
- ✅ Optimisation des performances
- ✅ Hot Module Replacement (HMR)

### Backend
- ✅ API RESTful structurée
- ✅ Validation des données avec Zod
- ✅ Gestion des erreurs centralisée
- ✅ Logging des requêtes API
- ✅ Sécurité HTTP avec Helmet
- ✅ Support CORS configuré

### Base de Données
- ✅ ORM Drizzle avec TypeScript
- ✅ Migrations structurées
- ✅ Schéma de validation Zod
- ✅ Prêt pour PostgreSQL

## 🔧 Dépendances Principales

### Core Framework
- `react` & `react-dom` - Framework UI
- `express` - Serveur backend
- `typescript` - Typage statique
- `vite` - Build tool et dev server

### Frontend
- `@tanstack/react-query` - Gestion d'état serveur
- `wouter` - Routing léger
- `react-hook-form` - Gestion de formulaires
- `zod` - Validation de schémas
- `@radix-ui/*` - Composants UI accessibles
- `tailwindcss` - Framework CSS
- `lucide-react` - Icônes modernes

### Backend
- `drizzle-orm` - ORM TypeScript
- `helmet` - Sécurité HTTP
- `cors` - Support Cross-Origin
- `@neondatabase/serverless` - Driver PostgreSQL

### Development
- `tsx` - Exécution TypeScript
- `concurrently` - Exécution parallèle
- `postcss` - Processing CSS

## 🚀 Déploiement

### Options de Déploiement

#### Frontend Seulement (Statique)
```bash
cd client
npm run build
# Deployer le dossier client/dist/
```
- **Netlify**: Pointer vers `client/dist`
- **Vercel**: Pointer vers `client/dist`
- **GitHub Pages**: Publier `client/dist`

#### Application Complète (Full-stack)
- **Render.com**: Déployer avec Docker
- **Railway**: Platform as a Service
- **Heroku**: Platform as a Service
- **Digital Ocean**: Droplet avec Node.js

### Configuration Environment
Créer un fichier `.env` à la racine :
```env
# Database
DATABASE_URL="postgresql://..."

# Server
PORT=5000
NODE_ENV=development

# Frontend
VITE_API_URL="http://localhost:5000"
```

## 🛠️ Scripts Utiles

### Depuis la racine
```bash
npm start          # Lance le serveur de développement
npm run build      # Build le projet complet
npm run dev        # Alias pour npm start
```

### Depuis le client
```bash
npm run dev        # Développement frontend seul
npm run build      # Build production frontend
npm run preview    # Prévisualisation du build
```

### Depuis le server
```bash
npm run dev        # Développement backend seul
npm start          # Production backend
```

## 📝 Notes de Développement

### Hot Reload
- Le frontend bénéficie du Hot Module Replacement
- Les changements sont reflétés instantanément
- Le backend redémarre automatiquement

### Base de Données
- Le schéma est géré par Drizzle ORM
- Les migrations sont automatiques en développement
- La validation est cohérente entre frontend et backend

### Performance
- Code splitting automatique avec Vite
- Optimisation des assets et images
- Caching intelligent avec React Query

## 🤝 Contribuer

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commiter vos changements (`git commit -m 'Add amazing feature'`)
4. Pusher la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour les détails

## 🙏 Remerciements

- **React Team** pour le framework incroyable
- **Vite Team** pour l'outil de build ultra-rapide
- **Tailwind CSS** pour le framework CSS utilitaire
- **Radix UI** pour les composants accessibles
