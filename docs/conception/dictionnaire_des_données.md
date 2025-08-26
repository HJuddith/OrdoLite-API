# Dictionnaire des données – OrdoLite API

---

## Utilisateur (`user`)

| Code       | Désignation             | Nature       | Type         | Commentaires / Contraintes         |
| ---------- | ----------------------- | ------------ | ------------ | ---------------------------------- |
| user_id    | Identifiant utilisateur | Clé primaire | Entier       | Auto-incrémentée                   |
| first_name | Prénom                  | Attribut     | Chaîne(50)   | Obligatoire                        |
| last_name  | Nom                     | Attribut     | Chaîne(50)   | Obligatoire                        |
| email      | Adresse e-mail          | Attribut     | Chaîne(100)  | Unique, utilisée pour la connexion |
| password   | Mot de passe (haché)    | Attribut     | Texte        | Stocké haché (argon2)       |
| role       | Rôle                    | Attribut     | Chaîne(20)   | Enum conseillée : `USER`, `ADMIN`  |
| created_at | Date de création        | Attribut     | Date & heure | Défaut : now()                     |
| updated_at | Date de mise à jour     | Attribut     | Date & heure | Défaut : now()                     |

---

## Ordonnance (`prescription`)

| Code            | Désignation            | Nature        | Type         | Commentaires / Contraintes              |
| --------------- | ---------------------- | ------------- | ------------ | --------------------------------------- |
| prescription_id | Identifiant ordonnance | Clé primaire  | Entier       | Auto-incrémentée                        |
| title           | Titre                  | Attribut      | Chaîne(100)  | Optionnel                               |
| prescriber      | Prescripteur           | Attribut      | Chaîne(100)  | Optionnel                               |
| notes           | Notes                  | Attribut      | Texte        | Optionnel                               |
| created_at      | Date de création       | Attribut      | Date & heure | Défaut : now()                          |
| updated_at      | Date de mise à jour    | Attribut      | Date & heure | Défaut : now()                          |
| user_id         | Propriétaire           | Clé étrangère | Entier       | Réf. `user(user_id)`, ON DELETE CASCADE |

---

## Médicament (`medication`)

| Code              | Désignation            | Nature       | Type         | Commentaires / Contraintes  |
| ----------------- | ---------------------- | ------------ | ------------ | --------------------------- |
| medication_id     | Identifiant médicament | Clé primaire | Entier       | Auto-incrémentée            |
| name              | Nom (DCI ou libellé)   | Attribut     | Chaîne(100)  | Obligatoire                 |
| brand_name        | Nom de marque          | Attribut     | Chaîne(100)  | Optionnel                   |
| short_description | Brève notice           | Attribut     | Texte        | Optionnel                   |
| form              | Forme pharmaceutique   | Attribut     | Chaîne(50)   | Optionnel                   |
| base_dosage       | Dosage de base         | Attribut     | Chaîne(50)   | Optionnel                   |
| expiration_date   | Date de péremption     | Attribut     | Date         | Optionnel (si suivi de lot) |
| created_at        | Date de création       | Attribut     | Date & heure | Défaut : now()              |
| updated_at        | Date de mise à jour    | Attribut     | Date & heure | Défaut : now()              |

---

## Ligne de prescription (`prescription_line`)

| Code            | Désignation               | Nature        | Type         | Commentaires / Contraintes                                                                  |
| --------------- | ------------------------- | ------------- | ------------ | ------------------------------------------------------------------------------------------- |
| line_id         | Identifiant ligne         | Clé primaire  | Entier       | Auto-incrémentée                                                                            |
| start_date      | Date de début             | Attribut      | Date         | Obligatoire                                                                                 |
| end_date        | Date de fin               | Attribut      | Date         | Optionnel – règle : start_date <= end_date si renseignée                                    |
| dose            | Dose par prise            | Attribut      | Décimal      | Optionnel                                                                                   |
| unit            | Unité (mg, ml, comprimé…) | Attribut      | Chaîne(20)   | Optionnel                                                                                   |
| frequency_day   | Fréquence (prises/jour)   | Attribut      | Entier       | Optionnel                                                                                   |
| instructions    | Instructions spécifiques  | Attribut      | Texte        | Optionnel                                                                                   |
| status          | Statut de la ligne        | Attribut      | Chaîne(20)   | Optionnel – Enum conseillée : `active`, `completed`, `paused`                               |
| created_at      | Date de création          | Attribut      | Date & heure | Défaut : now()                                                                              |
| updated_at      | Date de mise à jour       | Attribut      | Date & heure | Défaut : now()                                                                              |
| prescription_id | Réf. ordonnance           | Clé étrangère | Entier       | Réf. `prescription(prescription_id)`, ON DELETE CASCADE                                     |
| medication_id   | Réf. médicament           | Clé étrangère | Entier       | Réf. `medication(medication_id)`, nullable (lignes non-médicamenteuses), ON DELETE SET NULL |

---

## Pièce jointe (`attachment`)

| Code            | Désignation              | Nature        | Type         | Commentaires / Contraintes                              |
| --------------- | ------------------------ | ------------- | ------------ | ------------------------------------------------------- |
| attachment_id   | Identifiant pièce jointe | Clé primaire  | Entier       | Auto-incrémentée                                        |
| mime_type       | Type MIME                | Attribut      | Chaîne(50)   | Exemple : `image/jpeg`, `application/pdf`               |
| file_size_bytes | Taille du fichier        | Attribut      | Entier       | Limites côté API (ex. 5 Mo)                             |
| file_path       | Chemin/clé de stockage   | Attribut      | Texte        | Chemin local ou clé S3                                  |
| sha256          | Empreinte SHA-256        | Attribut      | Chaîne(64)   | Vérifie l’intégrité et détecte doublons                 |
| created_at      | Date de création         | Attribut      | Date & heure | Défaut : now()                                          |
| prescription_id | Réf. ordonnance          | Clé étrangère | Entier       | Réf. `prescription(prescription_id)`, ON DELETE CASCADE |

---

## Notification (`notification`)

| Code       | Désignation              | Nature        | Type         | Commentaires / Contraintes                                              |
| ---------- | ------------------------ | ------------- | ------------ | ----------------------------------------------------------------------- |
| notif_id   | Identifiant notification | Clé primaire  | Entier       | Auto-incrémentée                                                        |
| notif_type | Type de notification     | Attribut      | Chaîne(50)   | Enum : `medication_reminder`, `prescription_expiry`, `new_prescription` |
| content    | Contenu                  | Attribut      | Texte        | Message affiché                                                         |
| created_at | Date de création         | Attribut      | Date & heure | Défaut : now()                                                          |
| is_read    | Marquée comme lue ?      | Attribut      | Booléen      | Défaut : FALSE                                                          |
| user_id    | Destinataire             | Clé étrangère | Entier       | Réf. `user(user_id)`, ON DELETE CASCADE                                 |

---

## Refresh token (`refresh_token`)

| Code        | Désignation         | Nature        | Type         | Commentaires / Contraintes              |
| ----------- | ------------------- | ------------- | ------------ | --------------------------------------- |
| token_id    | Identifiant token   | Clé primaire  | Entier       | Auto-incrémentée                        |
| created_at  | Date de création    | Attribut      | Date & heure | Défaut : now()                          |
| expires_at  | Date d’expiration   | Attribut      | Date & heure | Obligatoire                             |
| device_info | Appareil/navigateur | Attribut      | Chaîne(100)  | Optionnel (multi-appareils)             |
| user_id     | Utilisateur lié     | Clé étrangère | Entier       | Réf. `user(user_id)`, ON DELETE CASCADE |

---

## Réinitialisation mot de passe (`reset_password`)

| Code       | Désignation               | Nature        | Type         | Commentaires / Contraintes              |
| ---------- | ------------------------- | ------------- | ------------ | --------------------------------------- |
| reset_id   | Identifiant reset         | Clé primaire  | Entier       | Auto-incrémentée                        |
| token      | Jeton de réinitialisation | Attribut      | Texte        | Unique, sécurisé                        |
| expires_at | Date d’expiration         | Attribut      | Date & heure | Obligatoire                             |
| created_at | Date de création          | Attribut      | Date & heure | Défaut : now()                          |
| is_used    | Déjà utilisé ?            | Attribut      | Booléen      | Défaut : FALSE                          |
| user_id    | Utilisateur lié           | Clé étrangère | Entier       | Réf. `user(user_id)`, ON DELETE CASCADE |

---

## Notes de cohérence

- **Intégrité temporelle** : `end_date >= start_date` (si `end_date` non nulle) sur `prescription_line`.
- **Lignes non-médicamenteuses** : `medication_id` nullable dans `prescription_line` pour permettre des actes/recommandations sans médicament.
- **Sécurité fichiers** : contrôler types/tailles côté API + calcul `sha256` à l’upload.
