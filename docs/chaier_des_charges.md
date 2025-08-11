# Cahier des charges – OrdoLite (Gestion d’ordonnances)

## 1. Présentation du projet

OrdoLite est une application web permettant à un utilisateur de gérer ses ordonnances médicales.  
Elle offre la possibilité de :

- S'inscrire, se connecter, récupérer son compte via mot de passe oublié, et utiliser plusieurs appareils en toute sécurité grâce aux refresh tokens
- Créer une ordonnance
- Ajouter plusieurs médicaments à une ordonnance
- Définir les dates de début/fin, la posologie et les instructions pour chaque médicament
- **Téléverser la photo ou le scan d’une ordonnance** (images/PDF) et l’associer à l’ordonnance
- Consulter facilement la liste des médicaments en cours
- Recevoir des rappels
- Gestion des utilisateurs et des données par un accès administrateur dans une version améliorée.

## 2. Objectifs

- Permettre à un utilisateur de s’inscrire, se connecter, rester connecté (refresh token) et récupérer l’accès en cas d’oubli de mot de passe
- Garantir la sécurité : hachage fort, tokens courts, révocation, limites de débit, validation stricte
- Simplifier la gestion des ordonnances pour éviter les oublis
- Centraliser les informations (texte + image/PDF) dans une interface unique
- Offrir une interface sécurisée et conforme aux bonnes pratiques (protection des données personnelles)

## 3. Public visé

- Utilisateurs ayant plusieurs traitements médicaux à suivre
- Personnes âgées ou leurs proches aidants
- Professionnels de santé souhaitant partager un suivi simplifié dans une version améliorée.

## 4. Fonctionnalités principales

1. **Authentification sécurisée**
   - Inscription / connexion avec hachage de mot de passe (argon2)
   - Authentification via JWT (access token + refresh token)
   - Gestion du mot de passe oublié
   - Gestion multi-appareils via refresh tokens stockés en base

2. **Gestion des ordonnances**
   - CRUD ordonnances
   - Lier une ordonnance à un utilisateur
   - **Pièces jointes** : téléverser plusieurs fichiers (photo/scan) par ordonnance

3. **Gestion des médicaments**
   - Catalogue simple ou saisie libre
   - Association d’un médicament à une ordonnance via table de liaison
   - Informations : posologie, dose, unité, fréquence, dates, instructions

4. **Consultation et suivi**
   - Liste des ordonnances actives
   - Liste des médicaments en cours avec tri par date
   - Historique des ordonnances passées
   - **Visualisation des pièces jointes** (vignettes, téléchargement PDF)

5. **(Optionnel) Notifications**
   - Alerte avant la fin d’une ordonnance
   - Rappel de prise

## 5. Téléversement d’images/PDF

- **Formats autorisés** : `image/jpeg`, `image/png`, `application/pdf`
- **Poids max** : 5 Mo par fichier
- **Nombre max** : 5 fichiers par ordonnance
- **Stockage** :
  - Dev/local : dossier `uploads/` (hors Git)
  - Prod : stockage objet (S3 compatible) avec URLs signées
- **Métadonnées en base** : `id`, `ordonnanceId`, `typeMime`, `tailleOctets`, `cheminFichier|storageKey`, `sha256`, `creeLe`
- **Sécurité** :
  - Accès restreint à l’utilisateur ou admin
  - Validation MIME/poids côté serveur
  - Noms de fichiers nettoyés
- **Sauvegardes** : incluses dans les dumps Postgres et archives `uploads/`

## 7. Contraintes techniques

- **Serveur** : Node.js (ESM) + Express.js
- **Base de données** : PostgreSQL + Sequelize
- **Upload fichiers** : Multer
- **Auth** : JWT Access + Refresh, bcrypt ou argon2
- **Sécurité** : Helmet, CORS, Zod, rate limiting
- **Env** : dotenv
- **Docs** : Swagger (OpenAPI 3.0)
- **Déploiement** : Docker + docker-compose
- **Sauvegardes** : `pg_dump` + archive `uploads/`
- **Tests** : Jest + Supertest
- **Gestion code** : GitHub (workflow branche par feature)

## 8. Contraintes non fonctionnelles

- POO côté back-end
- Règles de nommage respectées
- Code commenté/documenté
- Données protégées RGPD
- Droit à l’effacement complet

## 9. Modèle de données (résumé)

- **Utilisateur**
- **Préscription**
- **Médicament**
- **Ligne_préscription**
- **Piece_jointe**
- **Refresh_token**
- **Reset_password**
- **Notification**

## 10. Livrables

- Code source GitHub
- Documentation technique (Swagger + README)
- Scripts SQL init/sauvegarde/restauration
- Jeu d’essai + tests unitaires
- Procédure de déploiement
- Politique d’upload sécurisée

## 11. Planning prévisionnel

| Semaine | Tâche principale                                                        |
| ------- | ----------------------------------------------------------------------- |
| S1      | MCD/MLD/MRD/MPD + init projet                                           |
| S2      | Auth (register/login/forgot/refresh) + CRUD ordonnances/médocs + upload |
| S3      | Tests unitaires + docs Swagger                                          |
| S4      | Déploiement Docker + sauvegardes                                        |
