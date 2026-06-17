#!/usr/bin/env bash
set -euo pipefail

BACKUP_ROOT="${BACKUP_ROOT:-./backups/production}"
SOURCE_DIR="${1:-${BACKUP_ROOT}/latest}"
LOCAL_DATABASE_URL="${LOCAL_DATABASE_URL:-postgresql://mydeenmarket:mydeenmarket@localhost:5433/mydeenmarket?schema=public}"
LOCAL_IMAGE_DIR="${LOCAL_IMAGE_DIR:-./uploads/products}"
CONFIRM_RESTORE="${CONFIRM_RESTORE:-}"

if [[ ! -d "${SOURCE_DIR}" ]]; then
  echo "Backup folder not found: ${SOURCE_DIR}" >&2
  exit 1
fi

DB_FILE="${SOURCE_DIR}/database.sql"
SRC_IMAGES="${SOURCE_DIR}/images/products"

if [[ ! -f "${DB_FILE}" ]]; then
  echo "Database dump not found: ${DB_FILE}" >&2
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "psql is required to restore database." >&2
  exit 1
fi

if [[ "${CONFIRM_RESTORE}" != "yes" ]]; then
  echo "Refusing to restore without explicit confirmation." >&2
  echo "This operation can overwrite local database data." >&2
  echo "Run with: CONFIRM_RESTORE=yes npm run restore:local" >&2
  exit 1
fi

echo "Restoring local database from ${DB_FILE} ..."
psql "${LOCAL_DATABASE_URL}" -v ON_ERROR_STOP=1 -1 -f "${DB_FILE}"

if [[ -d "${SRC_IMAGES}" ]]; then
  echo "Syncing product images to ${LOCAL_IMAGE_DIR} ..."
  mkdir -p "${LOCAL_IMAGE_DIR}"
  rsync -az --delete "${SRC_IMAGES}/" "${LOCAL_IMAGE_DIR}/"
else
  echo "No image backup found at ${SRC_IMAGES}."
fi

echo "Local restore complete."
