# Étape 1 : Construction de l'application React
FROM node:18-alpine as build

WORKDIR /app

# Copie de package.json et package-lock.json
COPY package.json package-lock.json ./

# Installation des dépendances
RUN npm install

# Copie du reste de l'application
COPY . .

# Construction de l'application
RUN npm run build

# Étape 2 : Servir l'application avec Nginx
FROM nginx:alpine

# Copie des fichiers construits depuis l'étape précédente
COPY --from=build /app/dist /usr/share/nginx/html

# Copie du fichier de configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposition du port 80
EXPOSE 80

# Démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"]