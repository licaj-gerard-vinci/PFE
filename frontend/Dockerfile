# Utilise l'image Node.js pour construire le projet Angular
FROM node:18 AS build

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le projet Angular dans le conteneur
COPY . .

# Compile l'application Angular pour production
RUN npm run build --prod

# Étape 2 : Serveur Nginx pour déployer le frontend
FROM nginx:alpine

# Copie les fichiers compilés dans le dossier Nginx
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Expose le port 80
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]