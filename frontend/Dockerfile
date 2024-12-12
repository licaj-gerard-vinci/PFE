# Étape 1 : Utiliser une image de base Node.js
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Installer Angular CLI globalement
RUN npm install -g @angular/cli

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source de l'application Angular
COPY . .

# Exposer le port par défaut du serveur Angular (4200)
EXPOSE 4200

# Commande par défaut pour démarrer le serveur Angular
CMD ["ng", "serve", "--host", "0.0.0.0"]