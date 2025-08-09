# Spécification Technique – OrdoLite API

## 1 Vue d’ensemble

- **Type** : API REST
- **Langage** : Node.js (ESM)
- **Framework** : Express.js
- **Serveur** : Node.js (ESM) + Express.js
- **Base de données** : PostgreSQL + Sequelize
- **Upload fichiers** : Multer
- **Auth** : JWT Access + Refresh, argon2
- **Sécurité** : Helmet, CORS, Zod, rate limiting
- **Env** : dotenv
- **Docs** : Swagger (OpenAPI 3.0)
- **Déploiement** : Docker + docker-compose
- **Sauvegardes** : `pg_dump` + archive `uploads/`
- **Tests** : Jest + Supertest
- **Gestion code** : GitHub (workflow branche par feature)

---

### 2 Architecture logicielle

- **Pattern** : MVC modulaire + services métier
- **Couches** :
  1. **Routes** : mapping URL → contrôleur
  2. **Contrôleurs** : orchestrent services, validation, formatage réponse
  3. **Services métier** : logique métier pure (pas d’HTTP)
  4. **Modèles Sequelize** : mapping BD, associations
  5. **Middlewares** : authRequired, validate, errorHandler, upload
  6. **Utils** : fonctions utilitaires (hash, format date, email)
  7. **Docs** : Swagger auto-généré

---
