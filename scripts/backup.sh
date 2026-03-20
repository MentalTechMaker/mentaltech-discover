#!/bin/bash
# MentalTech Discover - Database backup script
# Usage: ./scripts/backup.sh
# Cron:  0 3 * * * cd /path/to/mentaltech-discover && ./scripts/backup.sh
#
# Backups are stored in /backups/ (Docker volume) with automatic rotation.
# Keeps the last 7 daily backups.

set -euo pipefail

CONTAINER="mentaltech-db"
DB_USER="${POSTGRES_USER:-mentaltech}"
DB_NAME="${POSTGRES_DB:-mentaltech}"
BACKUP_DIR="/home/yedora/Projets/mentaltech-discover/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/mentaltech_${TIMESTAMP}.sql.gz"
KEEP_DAYS=7

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting backup..."

# pg_dump inside the container, compress on the fly
docker exec "$CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_FILE"

FILESIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "[$(date)] Backup complete: $BACKUP_FILE ($FILESIZE)"

# Rotate: delete backups older than $KEEP_DAYS days
DELETED=$(find "$BACKUP_DIR" -name "mentaltech_*.sql.gz" -mtime +$KEEP_DAYS -delete -print | wc -l)
if [ "$DELETED" -gt 0 ]; then
    echo "[$(date)] Rotated: deleted $DELETED old backup(s)"
fi

# List current backups
echo "[$(date)] Current backups:"
ls -lh "$BACKUP_DIR"/mentaltech_*.sql.gz 2>/dev/null || echo "  (none)"
