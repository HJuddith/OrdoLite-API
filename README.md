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
  - [Commandes :](#commandes-)
    - [Démarrage en développement (nodemon)](#démarrage-en-développement-nodemon)
    - [Démarrage en production](#démarrage-en-production)
    - [Lancer les tests Jest](#lancer-les-tests-jest)
  - [Structure du projet :](#structure-du-projet-)
  - [Migrations \& Seeds](#migrations--seeds)
  - [Réinitialiser la base en développement](#réinitialiser-la-base-en-développement)
  - [Réinitialiser la base en test](#réinitialiser-la-base-en-test)
    - [Lancer les tests](#lancer-les-tests)
  - [Lancer le serveur en développement](#lancer-le-serveur-en-développement)
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

## Commandes :

### Démarrage en développement (nodemon)

```bash
npm run dev 
```

### Démarrage en production

npm run prod

### Lancer les tests Jest

npm test

## Structure du projet :

```plaintext

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
├─ docker/             # Stack Docker
└─ README.md

```

## Migrations & Seeds

## Réinitialiser la base en développement  

(drop + recreate + seed de démo)

```bash
npm run sync:dev
```

## Réinitialiser la base en test

(drop + recreate + seed de démo)

```bash
npm run sync:test
```

### Lancer les tests

(réinitialise la base en test puis exécute Jest)

```bash
npm test
```

## Lancer le serveur en développement

```bash
npm run dev
```

## API Docs

[Ouvrir la documentation OrdoLite-API](http://localhost:3000/api-docs)

---
