# Slack Clone

Une application de messagerie en temps réel inspirée de Slack, construite avec NestJS et React.

## Prérequis

- Node.js 18+ ([Télécharger](https://nodejs.org/))
- MongoDB ([Instructions d'installation](database/README.md))
- npm ou yarn

## Structure du Projet

```
slack/
├── backend/    # API NestJS
├── frontend/   # Application React
└── database/   # Configuration MongoDB
```

## Installation

1. **Base de données**
   - Suivez les instructions dans le dossier [database/](database/README.md) pour installer MongoDB
   - Vous pouvez utiliser Docker (recommandé) ou une installation locale

2. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env    # Configurez vos variables d'environnement
   npm run start
   ```
   Le serveur démarrera sur `http://localhost:3000`

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:5173`

## Développement

- Backend : `npm run start:dev` pour le mode watch
- Frontend : `npm run dev` inclut le hot-reload

## Licence

MIT
