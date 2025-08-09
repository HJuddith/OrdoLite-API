# Endpoints de l'API OrdoLite

## Authentification

POST   /api/v1/auth/register          # Inscription
POST   /api/v1/auth/login             # Connexion
POST   /api/v1/auth/refresh           # Rafraîchir access token
POST   /api/v1/auth/logout            # Déconnexion (révocation refresh token)
POST   /api/v1/auth/forgot-password   # Demander un lien de réinitialisation
POST   /api/v1/auth/reset-password    # Réinitialiser le mot de passe
POST   /api/v1/auth/change-password   # Modifier son mot de passe (auth requis)

## Utilisateurs (Admin)

GET    /api/v1/users                  # Lister tous les utilisateurs
GET    /api/v1/users/:id              # Détail utilisateur
PATCH  /api/v1/users/:id              # Modifier un utilisateur
DELETE /api/v1/users/:id              # Supprimer un utilisateur

## Ordonnances

POST   /api/v1/ordonnances            # Créer une ordonnance
GET    /api/v1/ordonnances            # Lister les ordonnances de l'utilisateur
GET    /api/v1/ordonnances/:id        # Obtenir une ordonnance
PATCH  /api/v1/ordonnances/:id        # Modifier une ordonnance
DELETE /api/v1/ordonnances/:id        # Supprimer une ordonnance

## Médicaments

POST   /api/v1/medicaments            # Ajouter un médicament au catalogue
GET    /api/v1/medicaments            # Lister les médicaments du catalogue
GET    /api/v1/medicaments/:id        # Obtenir un médicament
PATCH  /api/v1/medicaments/:id        # Modifier un médicament
DELETE /api/v1/medicaments/:id        # Supprimer un médicament

## Lignes de médicaments (association ordonnance ↔ médicament)

POST   /api/v1/ordonnances/:id/medicaments       # Ajouter un médicament à une ordonnance
GET    /api/v1/ordonnances/:id/medicaments       # Lister les médicaments d’une ordonnance
PATCH  /api/v1/lignes-medicaments/:id            # Modifier une ligne de médicament
DELETE /api/v1/lignes-medicaments/:id            # Supprimer une ligne de médicament

## Pièces jointes (ordonnances)

POST   /api/v1/ordonnances/:id/pieces            # Upload d’une pièce jointe (image/PDF)
GET    /api/v1/ordonnances/:id/pieces            # Lister les pièces jointes
GET   /api/v1/pieces/:pieceId                   # Télécharger une pièce jointe
DELETE /api/v1/pieces/:pieceId                   # Supprimer une pièce jointe
