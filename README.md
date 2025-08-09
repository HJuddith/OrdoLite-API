# OrdoLite API

API REST de gestion d'ordonnances médicales.

- **Langage** : Node.js (ESM)
- **Framework** : Express.js
- **Base de données** : PostgreSQL (via Sequelize)
- **Auth** : JWT Access & Refresh
- **Sécurité** : Helmet, CORS, Zod
- **Tests** : Jest + Supertest
- **Documentation API** : Swagger (OpenAPI 3.0)

---

## Sommaire

- [OrdoLite API](#ordolite-api)
  - [Sommaire](#sommaire)
  - [Fonctionnalités](#fonctionnalités)
  - [Prérequis](#prérequis)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Commandes ':'](#commandes-)
  - [Structure du projet ':'](#structure-du-projet-)
  - [Migrations \& Seeds](#migrations--seeds)
    - [Générer une migration](#générer-une-migration)
    - [Appliquer les migrations](#appliquer-les-migrations)
    - [Annuler la dernière migration](#annuler-la-dernière-migration)
    - [Lancer les seeds](#lancer-les-seeds)
  - [API Docs](#api-docs)

---

## Fonctionnalités

- Gestion des utilisateurs (inscription, connexion, rôles)
- Création et gestion d’ordonnances
- Ajout de médicaments et lignes de prescription
- Upload de pièces jointes (ordonnances scannées/image)
- Notifications (rappel de prise, expiration)
- Sécurité renforcée (rate limiting, validation)
- Documentation Swagger (OpenAPI 3.0)

---

## Prérequis

- Node.js >= 20.x
- Express
- npm >= 9.x
- PostgreSQL >= 14
- Socket.io
- Docker (optionnel)

---

## Installation

```bash
git clone https://github.com/HJuddith/OrdoLite-API.git
cd OrdoLite-API
npm install

```

---

## Configuration

Créer un fichier .env à la racine :

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=motdepasse
DB_NAME=ordolite_dev

JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...

## Commandes ':'

npm run dev           # Démarrage en développement (nodemon)
npm start             # Démarrage en production
npm run db:migrate    # Appliquer les migrations
npm run db:seed       # Insérer des données de test
npm test              # Lancer les tests Jest

## Structure du projet ':'

├─ docs/               # Documentation technique
├─ src/                # Code source
│  ├─ app.js           # App Express
│  ├─ server.js        # Entrée serveur
│  ├─ security.js      # Entrée des sécurités de l'application
│  ├─ config/          # Config BD et app
│  ├─ models/          # Modèles Sequelize
│  ├─ routes/          # Routes API
│  ├─ controllers/     # Contrôleurs
│  ├─ middleware/      # Middlewares
│  ├─ validation/      # Schémas Zod
│  └─ db.js            # Connexion BD
├─ tests/              # Tests Jest/Supertest
├─ docker-compose.yml  # Stack Docker
└─ README.md

## Migrations & Seeds

### Générer une migration

npx sequelize-cli migration:generate --name nom-migration

### Appliquer les migrations

npm run db:migrate

### Annuler la dernière migration

npm run db:migrate:undo

### Lancer les seeds

npm run db:seed

## API Docs

[Ouvrir la documentation OrdoLite-API](http://localhost:3000/api-docs)

---
