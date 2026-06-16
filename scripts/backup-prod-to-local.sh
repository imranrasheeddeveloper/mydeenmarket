#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-147.79.100.57}"
REMOTE_USER="${REMOTE_USER:-root}"
REMOTE_APP_DIR="${REMOTE_APP_DIR:-/root/mydeenmarket}"
REMOTE_IMAGE_DIR="${REMOTE_IMAGE_DIR:-/root/mydeenmarket/uploads/products}"
BACKUP_ROOT="${BACKUP_ROOT:-./backups/production}"
TIMESTAMP="$(date +"%Y%m%d-%H%M%S")"
TARGET_DIR="${BACKUP_ROOT}/${TIMESTAMP}"
DB_FILE="${TARGET_DIR}/database.sql"
IMAGES_DIR="${TARGET_DIR}/images/products"
LATEST_LINK="${BACKUP_ROOT}/latest"

mkdir -p "${IMAGES_DIR}"

SOCKET="/tmp/mydeenmarket-backup-${TIMESTAMP}.sock"
SSH_BASE=(ssh -o ControlMaster=auto -o ControlPersist=300 -o ControlPath="${SOCKET}")

cleanup() {
  ssh -S "${SOCKET}" -O exit "${REMOTE_USER}@${REMOTE_HOST}" >/dev/null 2>&1 || true
  rm -f "${SOCKET}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "Opening SSH connection to ${REMOTE_USER}@${REMOTE_HOST} (password once)..."
"${SSH_BASE[@]}" -fN "${REMOTE_USER}@${REMOTE_HOST}"

echo "Exporting production PostgreSQL database..."
ssh -S "${SOCKET}" "${REMOTE_USER}@${REMOTE_HOST}" \
  "cd ${REMOTE_APP_DIR} && set -a && . ./.env && set +a && pg_dump \"\$DATABASE_URL\" --no-owner --no-privileges" \
  > "${DB_FILE}"

echo "Copying production product images..."
rsync -az --delete -e "ssh -S ${SOCKET}" \
  "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_IMAGE_DIR}/" \
  "${IMAGES_DIR}/"

ln -sfn "${TIMESTAMP}" "${LATEST_LINK}"

echo "Backup complete."
echo "Database: ${DB_FILE}"
echo "Images:   ${IMAGES_DIR}"
echo "Latest:   ${LATEST_LINK}"
