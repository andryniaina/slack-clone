# Slack Clone

Une application de messagerie en temps réel inspirée de Slack, construite avec NestJS et React.

## Prérequis

- Node.js 18+ ([Télécharger](https://nodejs.org/))
- MongoDB ([Télécharger](https://www.mongodb.com/try/download/community) ou [Instructions d'installation](database/README.md))
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
   - Si MongoDB est déjà installé sur votre machine, vous pouvez passer cette étape
   - Sinon, suivez les instructions dans le dossier [database/](database/README.md) pour installer MongoDB
   - Vous pouvez utiliser Docker (recommandé) ou une installation locale

2. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env    # Optionnel : configurez vos variables d'environnement
   npm run start
   ```
   Le serveur démarrera sur `http://localhost:3000`

   **Note sur la configuration :**
   - Le fichier `.env` est optionnel
   - Sans `.env`, l'application utilisera les valeurs par défaut :
     - PORT=3000
     - DATABASE_URL=mongodb://localhost:27017/slack
     - JWT_SECRET=dev-secret-key
     - JWT_EXPIRES_IN=24h

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
