# Spécification Fonctionnelle – OrdoLite (Gestion d’ordonnances)

## 1) Objectif du système

OrdoLite est une API REST permettant à un utilisateur de gérer ses ordonnances médicales de manière simple et sécurisée, avec possibilité d’ajouter des pièces jointes (photo ou scan), de gérer la liste des médicaments prescrits, et de retrouver rapidement les informations nécessaires à la prise de traitement.

---

## 2) Acteurs

- **Utilisateur** : crée et consulte ses ordonnances et médicaments.
- **Administrateur** : gère les utilisateurs et supervise le système.
- **Système** : gère l’authentification, la persistance des données, et applique les règles de sécurité.

---

## 3) Cas d’utilisation principaux

### 3.1 Authentification

- **S’inscrire** (register) avec email, mot de passe et nom affiché.
- **Se connecter** (login) pour obtenir un token d’accès.
- **Rester connecté** grâce au refresh token.
- **Réinitialiser mot de passe** en cas d’oubli (via email).
- **Changer de mot de passe** depuis un compte connecté.
- **Se déconnecter** (révoquer refresh token).

### 3.2 Gestion des ordonnances

- Créer une nouvelle ordonnance.
- Lire la liste des ordonnances (avec pagination, tri, filtres).
- Consulter le détail d’une ordonnance.
- Modifier les informations d’une ordonnance.
- Supprimer une ordonnance.

### 3.3 Gestion des médicaments

- Ajouter un médicament au catalogue (facultatif si saisie libre).
- Associer un ou plusieurs médicaments à une ordonnance.
- Définir pour chaque médicament :
  - Date de début et de fin de traitement.
  - Posologie (texte libre ou structurée).
  - Dose et unité.
  - Fréquence par jour.
  - Instructions spécifiques.
- Modifier ou supprimer un médicament d’une ordonnance.

### 3.4 Gestion des pièces jointes

- **Uploader** un fichier image (`jpg/png`) ou PDF lié à une ordonnance.
- Lister toutes les pièces jointes d’une ordonnance.
- Télécharger ou visualiser une pièce jointe.
- Supprimer une pièce jointe.

### 3.5 Consultation et suivi

- Lister les ordonnances actives avec leurs médicaments.
- Afficher les ordonnances passées (historique).
- (Optionnel) Recevoir des notifications/rappels de prise ou d’expiration.

---

## 4) Règles de gestion

### 4.1 Authentification

- L’email doit être unique.
- Le mot de passe doit respecter une complexité minimale (≥ 8 caractères, chiffres et lettres).
- Le refresh token est stocké en base et peut être révoqué à tout moment.
- Les tokens d’accès expirent au bout de 15 minutes.

### 4.2 Ordonnances et médicaments

- Une ordonnance appartient à un seul utilisateur.
- Un médicament peut être lié à plusieurs ordonnances (table de liaison).
- La date de début doit être ≤ à la date de fin.
- Les champs facultatifs (`notes`, `instructions`) sont limités en taille (ex: 1000 caractères max).

### 4.3 Pièces jointes

- Types autorisés : WEBP, JPEG, PNG, PDF.
- Taille max : 5 Mo par fichier.
- Max 5 fichiers par ordonnance.
- Les fichiers sont accessibles uniquement au propriétaire de l’ordonnance ou à un administrateur.

---

## 5) Interfaces (API REST)

| Méthode | Endpoint                            | Description                        |
| ------- | ----------------------------------- | ---------------------------------- |
| POST    | /api/v1/auth/register               | Inscription                        |
| POST    | /api/v1/auth/login                  | Connexion                          |
| POST    | /api/v1/auth/refresh                | Rafraîchir token                   |
| POST    | /api/v1/auth/logout                 | Déconnexion                        |
| POST    | /api/v1/auth/forgot-password        | Mot de passe oublié                |
| POST    | /api/v1/auth/reset-password         | Réinitialisation mot de passe      |
| POST    | /api/v1/auth/change-password        | Changer mot de passe               |
| GET     | /api/v1/ordonnances                 | Liste des ordonnances              |
| POST    | /api/v1/ordonnances                 | Créer ordonnance                   |
| GET     | /api/v1/ordonnances/:id             | Détail ordonnance                  |
| PATCH   | /api/v1/ordonnances/:id             | Modifier ordonnance                |
| DELETE  | /api/v1/ordonnances/:id             | Supprimer ordonnance               |
| GET     | /api/v1/ordonnances/:id/medicaments | Liste médicaments d’une ordonnance |
| POST    | /api/v1/ordonnances/:id/medicaments | Ajouter médicament                 |
| PATCH   | /api/v1/lignes-medicaments/:id      | Modifier ligne médicament          |
| DELETE  | /api/v1/lignes-medicaments/:id      | Supprimer ligne médicament         |
| POST    | /api/v1/ordonnances/:id/pieces      | Upload pièce jointe                |
| GET     | /api/v1/ordonnances/:id/pieces      | Liste pièces jointes               |
| GET     | /api/v1/pieces/:pieceId             | Télécharger pièce jointe           |
| DELETE  | /api/v1/pieces/:pieceId             | Supprimer pièce jointe             |

---

## 6) Sécurité

- **Authentification JWT** avec access/refresh tokens.
- **Hachage des mots de passe** avec bcrypt (ou Argon2).
- **Rate limiting** sur les endpoints sensibles.
- **Validation des entrées** avec Zod.
- **Filtrage MIME** et contrôle taille pour les uploads.
- **Propriétaire uniquement** pour lecture/écriture d’ordonnances.

---

## 7) Contraintes techniques

- **Back-end** : Node.js 20+, Express.js, Sequelize.
- **Base de données** : PostgreSQL.
- **Stockage fichiers** : local en dev, S3/équivalent en prod (optionnel).
- **Documentation** : Swagger UI.
- **Tests** : Jest + Supertest.
- **Conteneurisation** : Docker + docker-compose.
- **Sauvegardes** : `pg_dump` + archive `uploads/`.

---

## 8) Critères d’acceptation (MVP)

- L’utilisateur peut créer un compte et se connecter.
- L’utilisateur peut créer une ordonnance avec médicaments.
- L’utilisateur peut téléverser et consulter des pièces jointes.
- Les données sont sécurisées et privées.
- Les tests unitaires et d’intégration passent en CI.
