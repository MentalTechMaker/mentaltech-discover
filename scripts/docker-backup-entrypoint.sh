#!/bin/sh
# MentalTech Discover - Backup container entrypoint
# Runs daily DB + uploads backup with rotation, plus log rotation

set -eu

BACKUP_DIR="/backups"
DB_HOST="db"
DB_USER="${POSTGRES_USER:-mentaltech}"
DB_NAME="${POSTGRES_DB:-mentaltech}"
KEEP_DAYS="${BACKUP_KEEP_DAYS:-7}"
LOG_DIR="/logs"

mkdir -p "$BACKUP_DIR"

# ─── Backup function ──────────────────────────────────────────
run_backup() {
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)

    echo "[$(date)] === Starting backup ==="

    # 1. Database dump
    DB_FILE="$BACKUP_DIR/db_${TIMESTAMP}.sql.gz"
    PGPASSWORD="${POSTGRES_PASSWORD:-mentaltech_secret}" pg_dump \
        -h "$DB_HOST" -U "$DB_USER" "$DB_NAME" | gzip > "$DB_FILE"
    DB_SIZE=$(du -h "$DB_FILE" | cut -f1)
    echo "[$(date)] DB backup: $DB_FILE ($DB_SIZE)"

    # 2. Uploads backup (logos)
    if [ -d "/uploads" ] && [ "$(ls -A /uploads 2>/dev/null)" ]; then
        UPLOADS_FILE="$BACKUP_DIR/uploads_${TIMESTAMP}.tar.gz"
        tar czf "$UPLOADS_FILE" -C /uploads . 2>/dev/null || true
        UPL_SIZE=$(du -h "$UPLOADS_FILE" | cut -f1)
        echo "[$(date)] Uploads backup: $UPLOADS_FILE ($UPL_SIZE)"
    else
        echo "[$(date)] Uploads: empty, skipped"
    fi

    # 3. Rotate old backups
    DELETED=$(find "$BACKUP_DIR" -name "db_*.sql.gz" -mtime +"$KEEP_DAYS" -delete -print | wc -l)
    find "$BACKUP_DIR" -name "uploads_*.tar.gz" -mtime +"$KEEP_DAYS" -delete > /dev/null 2>&1
    if [ "$DELETED" -gt 0 ]; then
        echo "[$(date)] Rotated: deleted $DELETED old backup(s)"
    fi

    # 4. Log rotation (truncate logs > 10 MB)
    if [ -d "$LOG_DIR" ]; then
        find "$LOG_DIR" -name "*.log" -size +10240k -exec sh -c 'tail -n 1000 "$1" > "$1.tmp" && mv "$1.tmp" "$1"' _ {} \;
        echo "[$(date)] Log rotation: done"
    fi

    # 5. Summary
    TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
    BACKUP_COUNT=$(find "$BACKUP_DIR" -name "db_*.sql.gz" | wc -l)
    echo "[$(date)] === Backup complete: $BACKUP_COUNT backups, $TOTAL_SIZE total ==="
}

# ─── Cron schedule ─────────────────────────────────────────────
CRON_SCHEDULE="${BACKUP_CRON:-0 3 * * *}"

echo "[$(date)] Backup container started"
echo "[$(date)] Schedule: $CRON_SCHEDULE"
echo "[$(date)] Retention: $KEEP_DAYS days"

# Run a backup immediately on first start
run_backup

# Write cron job
echo "$CRON_SCHEDULE /backup.sh >> /var/log/backup.log 2>&1" > /etc/crontabs/root

# Make the backup function available as a standalone script
cat > /backup.sh << 'SCRIPT'
#!/bin/sh
set -eu
BACKUP_DIR="/backups"
DB_HOST="db"
DB_USER="${POSTGRES_USER:-mentaltech}"
DB_NAME="${POSTGRES_DB:-mentaltech}"
KEEP_DAYS="${BACKUP_KEEP_DAYS:-7}"
LOG_DIR="/logs"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
echo "[$(date)] === Starting scheduled backup ==="
DB_FILE="$BACKUP_DIR/db_${TIMESTAMP}.sql.gz"
PGPASSWORD="${POSTGRES_PASSWORD:-mentaltech_secret}" pg_dump -h "$DB_HOST" -U "$DB_USER" "$DB_NAME" | gzip > "$DB_FILE"
echo "[$(date)] DB backup: $DB_FILE ($(du -h "$DB_FILE" | cut -f1))"
if [ -d "/uploads" ] && [ "$(ls -A /uploads 2>/dev/null)" ]; then
    UPLOADS_FILE="$BACKUP_DIR/uploads_${TIMESTAMP}.tar.gz"
    tar czf "$UPLOADS_FILE" -C /uploads . 2>/dev/null || true
    echo "[$(date)] Uploads backup: $UPLOADS_FILE"
fi
find "$BACKUP_DIR" -name "db_*.sql.gz" -mtime +"$KEEP_DAYS" -delete > /dev/null 2>&1
find "$BACKUP_DIR" -name "uploads_*.tar.gz" -mtime +"$KEEP_DAYS" -delete > /dev/null 2>&1
if [ -d "$LOG_DIR" ]; then
    find "$LOG_DIR" -name "*.log" -size +10240k -exec sh -c 'tail -n 1000 "$1" > "$1.tmp" && mv "$1.tmp" "$1"' _ {} \;
fi
echo "[$(date)] === Backup complete ==="
SCRIPT
chmod +x /backup.sh

echo "[$(date)] Starting cron daemon..."
crond -f -l 2
