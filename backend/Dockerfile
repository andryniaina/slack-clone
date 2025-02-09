# Étape 1 : Construction de l'application NestJS
FROM node:18-alpine AS build

# Définition du répertoire de travail
WORKDIR /usr/src/app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du reste du code source
COPY . .

# Construction de l'application NestJS
RUN npm run build

# Étape 2 : Création de l'image de production
FROM node:18-alpine

# Définition du répertoire de travail
WORKDIR /usr/src/app

# Copie des dépendances depuis l'étape de construction
COPY --from=build /usr/src/app/node_modules ./node_modules

# Copie du code compilé depuis l'étape de construction
COPY --from=build /usr/src/app/dist ./dist

# Définition de la commande de démarrage de l'application
CMD ["node", "dist/main"]
