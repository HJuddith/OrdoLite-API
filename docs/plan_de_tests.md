# Plan de test – OrdoLite API

## 1. Objectifs & périmètre

- Vérifier que l’API OrdoLite respecte la spécification fonctionnelle et technique (auth, ordonnances, médicaments, pièces jointes).
- Couvrir les exigences de sécurité, de validation des entrées, de confidentialité, de sauvegarde/restauration et de déploiement.
- Inclure tests unitaires, d’intégration, E2E (manuels/automatisés) et de sécurité basique.

## 2. Stratégie de test

- **Unitaires (Jest)** : services, validation Zod, utilitaires (hash, dates).
- **Intégration (Jest + Supertest)** : routes Express avec PostgreSQL de test (migrations appliquées).
- **E2E / Manuel (Postman/Newman)** : scénarios complets (inscription → upload → consultation).
- **Sécurité (basique)** : contrôle d’accès (401/403), rate limiting, upload MIME/poids, tokens.
- **Régression** : déclenchée en CI sur chaque PR.
- **Smoke** en pré-prod : `/health`, endpoints clés OK.

## 3. Environnements & outils

- **Dev/Test local** : Node.js 20+, PostgreSQL 16 (port 5433 pour test), Docker (optionnel).
- **CI** : GitHub Actions (service Postgres + migrations + tests).
- **Outils** : Jest, Supertest, Newman (option), pgAdmin.
- **Jeux de données** : seed minimal (1 admin, 2 users, 5 ordonnances, 10 médicaments).
- **Fichiers de test** : images JPEG/PNG (≤ 200KB), PDF (≤ 200KB) pour uploads.

## 4. Critères d’entrée/sortie

- **Entrée** : Migrations OK; variables `.env.test` configurées; endpoints documentés.
- **Sortie** : 0 test critique en échec; couverture minimale 70% (branches/lines) sur modules métier; rapport de bugs traité/priorisé.

## 5. Cas de test par module (extraits)

### 5.1 Authentification

- **REG-001** Inscription OK (email unique, hash stocké).
- **REG-002** Inscription KO (email invalide → 400).
- **REG-003** Inscription KO (email déjà pris → 409).
- **LOG-001** Connexion OK (retour access + refresh).
- **LOG-002** Connexion KO (mauvais mot de passe → 401).
- **REF-001** Refresh OK (refresh valide → nouveau access).
- **REF-002** Refresh KO (token révoqué/expiré → 401).
- **OUT-001** Logout révoque le refresh (→ 204, refresh inutilisable ensuite).
- **FP-001** Forgot password OK (réponse neutre 200).
- **RP-001** Reset password OK (token valide + rotation refresh → 200).
- **RP-002** Reset password KO (token expiré/invalidé → 401).
- **CP-001** Change password OK (auth, mot de passe actuel correct → 200).
- **CP-002** Change password KO (mot de passe actuel incorrect → 403).
- **SEC-ROLE-001** Accès à `/users` réservé ADMIN (USER → 403).

### 5.2 Ordonnances

- **ORD-001** Créer ordonnance (titre, prescripteur, notes) → 201.
- **ORD-002** Lire mes ordonnances (pagination, tri) → 200.
- **ORD-003** Lire ordonnance d’un autre user → 403.
- **ORD-004** Modifier mes ordonnances (patch partiel) → 200.
- **ORD-005** Supprimer ordonnance → 204 (cascade lignes + pièces jointes).
- **ORD-006** Filtres `from/to` (période) → 200.

### 5.3 Médicaments (catalogue)

- **MED-001** Créer médicament (nomDCI requis) → 201.
- **MED-002** Lister/rechercher (`?search=`) → 200.
- **MED-003** Modifier/Supprimer médicament → 200/204.
- **MED-004** Valider champs longueur/format → 400 si invalide.

### 5.4 Lignes médicament (liaison ordonnance ↔ médicament)

- **LIG-001** Ajouter ligne sur ordonnance (dates/posologie) → 201.
- **LIG-002** `dateDebut > dateFin` → 400 (validation).
- **LIG-003** Lister lignes d’une ordonnance (own) → 200.
- **LIG-004** Modifier ligne (posologie/dates) → 200.
- **LIG-005** Supprimer ligne → 204.
- **LIG-006** Tenter d’ajouter une ligne sur ordonnance d’autrui → 403.

### 5.5 Pièces jointes (upload/affichage/téléchargement)

- **UP-001** Upload JPEG valide (<= 5 Mo) → 201, métadonnées OK.
- **UP-002** Upload type interdit (exe) → 415.
- **UP-003** Upload trop lourd (> 5 Mo) → 413.
- **UP-004** Lister pièces jointe d’une ordonnance (own) → 200.
- **UP-005** Afficher inline (GET `/pieces/:id`) → `Content-Disposition: inline`.
- **UP-006** Forcer téléchargement (`?download=true`) → `attachment`.
- **UP-007** Supprimer pièce jointe (fichier + BD) → 204.
- **UP-008** Accéder à la pièce d’autrui → 403.
- **UP-009** Lien pièce inexistante → 404.

### 5.6 Sécurité & robustesse

- **SEC-001** Accès sans JWT → 401.
- **SEC-002** JWT expiré → 401.
- **SEC-003** Injections (XSS dans `notes`) → sanitization OK, pas d’exécution.
- **SEC-004** Rate-limit sur `/login` après N tentatives → 429.
- **SEC-005** Exposition d’IDs : interdiction d’accéder à ressources d’autrui (403 systématique).
- **SEC-006** En-têtes de sécurité Helmet présents.

### 5.7 Sauvegardes / Restitution

- **BKP-001** Script backup crée `.dump` et archive `uploads/`.
- **BKP-002** Restauration DB via `pg_restore` → schéma + données OK.
- **BKP-003** Restauration fichiers → pièces lisibles.
- **BKP-004** Démarrage post-restauration : /health = 200, scénarios de base OK.

### 5.8 Déploiement (prod-like)

- **DEP-001** Build image Docker OK.
- **DEP-002** Démarrage via `docker-compose.prod.yml` (migrations auto) → OK.
- **DEP-003** /api-docs accessible; /health = 200.
- **DEP-004** Variables d’environnement obligatoires présentes (sinon fail contrôlé).
- **DEP-005** Persistance : volumes DB + uploads fonctionnels.

## 6. Données de test (exemple)

- **Users** : `admin@ex.com` (ADMIN), `alice@ex.com` (USER), `bob@ex.com` (USER).
- **Médicaments** : Paracétamol 500 mg, Ibuprofène 200 mg, Amoxicilline 1g.
- **Ordonnances** :
  
  - Alice : Ordo A (2 lignes), Ordo B (1 ligne).
  - Bob : Ordo C (1 ligne).
- **Fichiers** : `ordo_a.jpg`, `ordo_b.pdf` (valides), `bad.exe` (interdit).

## 7. Traçabilité (exemples)

- Exigence **“Upload pièces jointes PDF/JPEG/PNG ≤ 5 Mo”** → Tests **UP-001/002/003**.
- Exigence **“Protection ressources par ownership”** → **ORD-003**, **UP-008**, **SEC-005**.
- Exigence **“Mot de passe oublié”** → **FP-001**, **RP-001/002**.
- Exigence **“Sécurité tokens JWT/Refresh”** → **REF-001/002**, **OUT-001**, **SEC-001/002**.

## 8. Priorisation & sévérité

- **Bloquant (P0)** : Auth, accès 401/403, migrations, upload sécurité.
- **Majeur (P1)** : Dates/posologie, suppression cascade, sauvegarde/restauration.
- **Mineur (P2)** : Messages d’erreur, pagination/tri.

## 9. Reporting & gestion des anomalies

- Outil : Issues GitHub (labels `bug`, `severity:P0/P1/P2`, `area:auth/ordo/upload`).
- Rapport de test : résumé exécutions CI + capture des échecs (logs Jest).
- Règle : un bug P0 bloque la mise en prod.

## 10. Planning de test

- **J+7** : Unitaires (auth/services) 100% green.
- **J+10** : Intégration (auth/ordonnances/lignes) ≥ 80% green.
- **J+12** : Upload + sécurité basique.
- **J+14** : Régression complète + smoke pré-prod + sauvegarde/restauration.
