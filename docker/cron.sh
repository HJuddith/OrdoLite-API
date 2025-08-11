#!/bin/bash
set -e

# === CONFIGURATION ===
CONTAINER_NAME="ordolite_db"       # Nom du conteneur Postgres
DB_USER="jud"                      # Utilisateur PostgreSQL
DB_NAME="ordolite"                 # Nom de la base
BACKUP_DIR="./backups"             # Dossier de sauvegarde
DATE=$(date +'%Y-%m-%d_%H-%M-%S')  # Date/heure actuelle

# === LOG ===
echo "[INFO] Sauvegarde démarrée à $DATE"

# Création du dossier de backup si inexistant
mkdir -p "$BACKUP_DIR"

# Vérifier si le conteneur est en cours d’exécution
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "[ERREUR] Le conteneur '${CONTAINER_NAME}' n'est pas démarré."
    exit 1
fi

# Sauvegarde de la base Postgres
docker exec -t "$CONTAINER_NAME" pg_dump -U "$DB_USER" "$DB_NAME" \
    > "$BACKUP_DIR/db_${DATE}.sql" || {
    echo "[ERREUR] Échec du dump PostgreSQL."
    exit 1
}

# Sauvegarde des fichiers uploadés
if [ -d "./uploads" ]; then
    tar -czf "$BACKUP_DIR/uploads_${DATE}.tar.gz" ./uploads
    echo "[INFO] Sauvegarde des fichiers uploadés effectuée."
else
    echo "[INFO] Aucun dossier ./uploads trouvé, skip."
fi

echo "[INFO] Sauvegarde terminée avec succès."
echo "[INFO] Fichiers :"
ls -lh "$BACKUP_DIR"/db_"${DATE}".sql "$BACKUP_DIR"/uploads_"${DATE}".tar.gz 2>/dev/null || true
