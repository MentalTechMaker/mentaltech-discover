#!/bin/bash
# MentalTech Discover - Database restore script
# Usage: ./scripts/restore.sh backups/mentaltech_20260325_030000.sql.gz
#
# WARNING: This will DROP and recreate the database. All current data will be lost.

set -euo pipefail

CONTAINER="mentaltech-db"
DB_USER="${POSTGRES_USER:-mentaltech}"
DB_NAME="${POSTGRES_DB:-mentaltech}"

if [ $# -eq 0 ]; then
    echo "Usage: $0 <backup_file.sql.gz>"
    echo ""
    echo "Available backups:"
    ls -lht backups/mentaltech_*.sql.gz 2>/dev/null || echo "  (no backups found)"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "WARNING: This will DROP and recreate the database '$DB_NAME'."
echo "Backup to restore: $BACKUP_FILE"
echo ""
read -p "Are you sure? Type 'yes' to confirm: " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Aborted."
    exit 0
fi

echo "[$(date)] Restoring from $BACKUP_FILE..."

# Drop and recreate database
docker exec "$CONTAINER" psql -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
docker exec "$CONTAINER" psql -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

# Restore
gunzip -c "$BACKUP_FILE" | docker exec -i "$CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" --quiet

echo "[$(date)] Restore complete."
