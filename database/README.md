# Configuration de la Base de Données

Ce document décrit les différentes options pour configurer MongoDB pour le projet Slack Clone.

## Option 1 : Utilisation de Docker

### Prérequis
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation avec Docker

1. Lancez MongoDB avec Docker Compose :
```bash
docker-compose up -d
```

2. Vérifiez que le conteneur est en cours d'exécution :
```bash
docker ps
```

3. Connectez-vous à MongoDB :
```bash
# URL de connexion
mongodb://localhost:27017/slack
```

### Arrêt du conteneur
```bash
docker-compose down
```

## Option 2 : Installation Locale de MongoDB

Si vous préférez une installation native de MongoDB :

1. Téléchargez et installez MongoDB Community Server :
   - [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Suivez les [instructions d'installation officielles](https://www.mongodb.com/docs/manual/installation/)

2. Démarrez le service MongoDB :
   - Windows : Le service démarre automatiquement
   - macOS : `brew services start mongodb-community`
   - Linux : `sudo systemctl start mongod`

3. Vérifiez l'installation :
```bash
mongosh
```

## Configuration de l'Application

Mettez à jour votre fichier `.env` avec l'URL de connexion :

```env
DATABASE_URL=mongodb://localhost:27017/slack
```

## Sauvegarde des Données

Les données Docker sont persistées dans un volume nommé `slack-mongodb-data`. Pour une installation locale, référez-vous à la [documentation MongoDB sur les sauvegardes](https://www.mongodb.com/docs/manual/core/backups/).
