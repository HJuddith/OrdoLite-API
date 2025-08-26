#!/usr/bin/env bash
set -Eeuo pipefail

# ====== CONFIG ======
DB_CONTAINER="${DB_CONTAINER:-ordolite_db}"
API_CONTAINER="${API_CONTAINER:-ordolite_api}"

DB_USER="${DB_USER:-jud}"
DB_NAME="${DB_NAME:-ordolite}"
DB_PASSWORD="${DB_PASSWORD:-admin}"              # utilisé pour PGPASSWORD

# volume des uploads (nom créé par compose)
UPLOADS_VOLUME="${UPLOADS_VOLUME:-ordolite_api-uploads_data}"

KEEP="${KEEP:-7}"                                # nb de sauvegardes à garder

# chemins
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-${REPO_ROOT}/backups}"
LOCAL_UPLOADS_DIR="${REPO_ROOT}/uploads"         # si bind-mount, on l'utilise

TS="$(date +'%Y-%m-%d_%H-%M-%S')"
LOG_FILE="${BACKUP_DIR}/cron.log"

mkdir -p "$BACKUP_DIR"

log() { echo "[$(date +'%F %T')] $*" | tee -a "$LOG_FILE" ; }

log "➡️  Backup démarré (DB=${DB_NAME}, container=${DB_CONTAINER})"

# ====== Vérifs de base ======
if ! docker ps --format '{{.Names}}' | grep -q "^${DB_CONTAINER}$"; then
  log "Le conteneur DB '${DB_CONTAINER}' n'est pas démarré."
  exit 1
fi

# ====== Backup DB (format custom .dump) ======
DB_DUMP="${BACKUP_DIR}/db_${TS}.dump"
log "➡️  Dump PostgreSQL → ${DB_DUMP}"
# On envoie PGPASSWORD au process dans le conteneur
if ! docker exec -e PGPASSWORD="${DB_PASSWORD}" -t "${DB_CONTAINER}" \
  pg_dump -U "${DB_USER}" -d "${DB_NAME}" -Fc -f - > "${DB_DUMP}"; then
  log "Échec du dump PostgreSQL."
  exit 1
fi

# ====== Backup uploads ======
UPLOADS_ARCHIVE="${BACKUP_DIR}/uploads_${TS}.tgz"

if [ -d "${LOCAL_UPLOADS_DIR}" ] && [ -n "$(ls -A "${LOCAL_UPLOADS_DIR}" 2>/dev/null || true)" ]; then
  log "➡️  Archive des uploads (dossier local) → ${UPLOADS_ARCHIVE}"
  tar -czf "${UPLOADS_ARCHIVE}" -C "${LOCAL_UPLOADS_DIR}" .
else
  log "Dossier local ./uploads absent ou vide — tentative via volume Docker: ${UPLOADS_VOLUME}"
  if docker volume inspect "${UPLOADS_VOLUME}" >/dev/null 2>&1; then
    docker run --rm \
      -v "${UPLOADS_VOLUME}:/uploads:ro" \
      -v "${BACKUP_DIR}:/out" \
      alpine:3.20 sh -c "tar -czf /out/$(basename "${UPLOADS_ARCHIVE}") -C /uploads ."
    log "➡️  Archive des uploads (volume) → ${UPLOADS_ARCHIVE}"
  else
    log "⚠️  Volume ${UPLOADS_VOLUME} introuvable. Skip uploads."
    UPLOADS_ARCHIVE=""
  fi
fi

# ====== Rotation ======
log "Rotation: KEEP=${KEEP}"
ls -1t "${BACKUP_DIR}"/db_*.dump      2>/dev/null | tail -n +$((KEEP+1)) | xargs -r rm -f
ls -1t "${BACKUP_DIR}"/uploads_*.tgz  2>/dev/null | tail -n +$((KEEP+1)) | xargs -r rm -f

# ====== Récap ======
log "Backup terminé."
log "📦 Fichiers créés:"
[ -f "${DB_DUMP}" ] && ls -lh "${DB_DUMP}"       | tee -a "$LOG_FILE"
[ -n "${UPLOADS_ARCHIVE}" ] && [ -f "${UPLOADS_ARCHIVE}" ] && ls -lh "${UPLOADS_ARCHIVE}" | tee -a "$LOG_FILE"
