# Veille technologique – OrdoLite (API de gestion d’ordonnances)

## 1. Objectifs de la veille

- Suivre les évolutions technologiques et les bonnes pratiques liées :
  - au développement d’API sécurisées en Node.js
  - à la gestion et protection de fichiers médicaux (images, PDF)
  - à la sécurisation et au déploiement d’applications web de santé
- Identifier les risques et solutions en lien avec la confidentialité (données médicales = données sensibles RGPD)
- Anticiper les mises à jour majeures de bibliothèques critiques (Express, Sequelize, JWT, Multer…)

## 2. Périmètre

- **Backend Node.js** : performances, sécurité, mises à jour.
- **ORM Sequelize** : compatibilité PostgreSQL, nouvelles features.
- **Authentification JWT** : gestion refresh token, rotation, révoquation.
- **Sécurité uploads** : contrôle MIME, taille, anti-virus, stockage sécurisé.
- **Déploiement** : Docker, CI/CD GitHub Actions, backups automatisés.
- **Normes santé** : RGPD, bonnes pratiques OWASP, recommandations CNIL.

## 3. Sources principales

- **Officielles**
  - [Node.js Releases](https://nodejs.org/en/about/releases)
  - [Express.js Blog](https://expressjs.com/en/resources/community/blogs.html)
  - [Sequelize Changelog](https://sequelize.org/releases/)
  - [Multer GitHub](https://github.com/expressjs/multer/releases)
  - [PostgreSQL News](https://www.postgresql.org/about/news/)
- **Sécurité**
  - [OWASP API Security Top 10](https://owasp.org/API-Security/)
  - [NVD - National Vulnerability Database](https://nvd.nist.gov/)
  - [Security advisories GitHub](https://github.com/advisories)
- **Normes & RGPD**
  - [CNIL – données de santé](https://www.cnil.fr/fr/les-donnees-de-sante)
  - [ANSSI – guides sécurité](https://www.ssi.gouv.fr/)

## 4. Méthode de veille

- Abonnements RSS/Newsletters aux sources listées.
- Alertes Google sur : “Node.js security”, “Sequelize vulnerability”, “API healthcare security”.
- Suivi hebdomadaire des dépendances avec `npm outdated` et `npm audit`.
- Tests réguliers avec outils type **Snyk** ou **OWASP ZAP**.
- Documentation des mises à jour dans un changelog interne.

## 5. Exemples de résultats récents

- **[2025-05] Node.js 22 LTS** : amélioration des performances du moteur V8 et nouvelles API web natives → plan de migration prévu après validation compatibilité dépendances.
- **[2025-03] Vulnérabilité JWT** : découverte d’une faille de vérification de signature sur certaines libs → vérification que `jsonwebtoken` est à jour (>9.0.2).
- **[2025-02] PostgreSQL 16.3** : correctifs sécurité → mise à jour programmée en préprod.
- **[2025-01] OWASP API Security** : ajout d’un contrôle supplémentaire sur les champs upload pour prévenir l’upload de fichiers exécutables.

## 6. Actions prévues pour OrdoLite

- Intégrer un scan de vulnérabilités automatisé en CI/CD.
- Mettre en place un **processus de rotation des clés JWT** tous les 6 mois.
- Ajouter un contrôle antivirus (ex. `clamav`) pour les fichiers uploadés.
- Vérifier régulièrement la conformité RGPD (registre de traitements, droits d’accès/suppression).
- Passer en HTTPS strict sur tous les environnements, avec renouvellement automatique des certificats (ex. Let’s Encrypt).

## 7. Conclusion

La veille technologique sur OrdoLite permet de maintenir un haut niveau de sécurité, de garantir la conformité réglementaire et d’assurer la pérennité technique de l’API.  
Elle repose sur un suivi régulier des évolutions logicielles, des vulnérabilités et des recommandations en matière de sécurité des données de santé.
