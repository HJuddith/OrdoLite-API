# ---------- Stage 1: deps (installe TOUTES les deps pour builder) ----------
FROM node:22-alpine AS deps
WORKDIR /app

# Copie uniquement les manifestes pour profiter du cache
COPY package*.json ./
# Si tu as un lockfile: npm ci est plus déterministe et plus rapide
RUN npm ci

# ---------- Stage 2: prune (ne garde que les deps prod) ----------
FROM node:22-alpine AS prune
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
# Supprime les devDependencies pour l'image finale
RUN npm prune --omit=dev

# ---------- Stage 3: runtime (image finale) ----------
FROM node:22-alpine
WORKDIR /app

# ENV par défaut (surclassables par compose/.env)
ENV NODE_ENV=production \
    PORT=3000

# (Optionnel) dépendances système minimales (ex: openssl/ca-certificates)
# RUN apk add --no-cache ca-certificates

# Copie uniquement les deps prod prunées
COPY --from=prune /app/node_modules ./node_modules

# Copie du code applicatif
COPY . .

# Santé: endpoint HTTP (change /health si besoin)
HEALTHCHECK --interval=10s --timeout=5s --retries=12 CMD \
  node -e "require('http').get('http://localhost:${process.env.PORT||3000}/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

# Sécurité: exécuter en user non-root
# Le user 'node' existe déjà dans l'image officielle
RUN mkdir -p /app/uploads && chown -R node:node /app
USER node

# Déclare le dossier d'uploads comme volume (persistance)
VOLUME ["/app/uploads"]

EXPOSE 3000

CMD ["node", "src/server.js"]
