# Slack Backend

API backend NestJS pour l'application de messagerie d'entreprise, construite avec une architecture hexagonale et des principes SOLID.

## 🚀 Démarrage rapide

### Prérequis
- Node.js >= 18.x
- npm >= 9.x
- MongoDB >= 6.0

### Variables d'environnement
```bash
# Créer un fichier .env à la racine
cp .env.example .env

# Variables requises
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/slack
JWT_SECRET=dev-secret-key
JWT_EXPIRES_IN=24h
```

### Installation et développement
```bash
# Installation des dépendances
npm install

# Développement avec hot-reload
npm run start
```

Une fois lancée, le serveur est accessible à l'adresse : http://localhost:3000

## 🏗️ Architecture du projet

```
src/
├── auth/           # Authentification et autorisation
├── channel/        # Gestion des canaux de discussion
├── config/         # Configuration de l'application
├── message/        # Gestion des messages
├── seeder/         # Données initiales
├── user/           # Gestion des utilisateurs
```

## 🛠️ Stack technique

### Core
- **NestJS** - Framework Node.js progressif
- **TypeScript** - Typage statique strict
- **MongoDB** - Base de données NoSQL avec Mongoose

### Authentification & Sécurité
- **JWT** - Authentification avec refresh tokens
- **bcrypt** - Hashage sécurisé des mots de passe
- **class-validator** - Validation des DTOs
- **helmet** - Sécurité des headers HTTP

### WebSocket
- **Socket.IO** - Communication bidirectionnelle temps réel