# Slack Frontend

Application de messagerie d'entreprise construite avec des technologies modernes et une architecture robuste.

## 🚀 Démarrage rapide

### Prérequis
- Node.js >= 18.x
- npm >= 9.x

### Installation et développement
```bash
# Installation des dépendances avec une gestion stricte des versions
npm ci

# Lancement en mode développement avec HMR
npm run dev
```

Une fois lancée, l'application est accessible à l'adresse : http://localhost:5073

## 🏗️ Architecture du projet

```src/
├── assets/         # Ressources statiques (images, fonts)
├── config/         # Configuration de l'application
├── contexts/       # Contextes React (auth, websocket)
├── data/           # Types, DTOs et interfaces
├── hooks/          # Hooks React personnalisés
├── routes/         # Routes de l'application
├── services/       # Services d'API et logique métier
├── utils/          # Utilitaires et helpers
└── views/          # Pages et composants spécifiques aux vues
    ├── components/ # Composants spécifiques aux vues
    ├── layouts/    # Layouts de l'application
    └── pages/      # Pages principales
```

## 🛠️ Stack technique

### Core
- **React 19** - Framework UI avec support des Hooks et du Concurrent Mode
- **TypeScript** - Typage statique strict pour une meilleure maintenabilité
- **Vite** - Build tool ultra-rapide avec HMR instantané

### State Management & Data Fetching
- **TanStack Query** (React Query v5) - Gestion du state serveur avec cache intelligent
- **React Context** - State management local avec patterns optimisés

### Styling & UI
- **Tailwind CSS** - Utilitaires CSS avec JIT pour un bundle optimisé
- **Lucide Icons** - Icons SVG optimisés et cohérents
- **clsx** - Gestion conditionnelle des classes CSS

### Websocket
- **Socket.IO Client** - Communication temps réel bidirectionnelle

### Routing
- **React Router v6** - Routing déclaratif avec support du code splitting

### Sécurité & Auth
- **JWT** - Authentification stateless avec refresh token
- **Secure HTTP-only cookies** - Stockage sécurisé des tokens

### Dev Tools
- **ESLint** - Linting avec règles strictes pour TypeScript et React
- **Prettier** - Formatage de code consistant
- **TypeScript** - Configuration stricte pour une type safety maximale