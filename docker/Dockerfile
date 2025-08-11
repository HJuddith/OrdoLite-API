# Étape 1 : build des dépendances
FROM node:22-alpine AS deps
WORKDIR /app

# Copie uniquement les fichiers de dépendances
COPY package*.json ./

# Installation (sans dépendances dev si on est en prod)
RUN npm install --production=false

# Étape 2 : image finale
FROM node:22-alpine
WORKDIR /app

# Variables d'environnement par défaut
ENV NODE_ENV=production \
    PORT=3000

# Copie node_modules depuis l'étape deps
COPY --from=deps /app/node_modules ./node_modules

# Copie du reste du projet
COPY . .

# Expose le port de l'API
EXPOSE 3000

# Commande de démarrage
CMD ["node", "src/server.js"]
