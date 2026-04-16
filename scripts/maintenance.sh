#!/bin/bash
# =============================================================================
# maintenance.sh - Script de maintenance automatique MentalTech Discover
# =============================================================================
#
# Execute les taches de maintenance recurrentes du serveur de production :
#   1. Verification de sante (conteneurs, API, disque, memoire, SSL)
#   2. Nettoyage Docker (images, volumes, cache)
#   3. Verification des mises a jour de securite
#   4. Verification des sauvegardes
#   5. Analyse des logs (erreurs HTTP, tentatives d'intrusion)
#   6. Generation du rapport
#
# Usage :
#   ./scripts/maintenance.sh              # Execution manuelle
#   ./scripts/maintenance.sh --no-color   # Sans couleurs (pour les logs)
#
# Cron - Maintenance hebdomadaire (dimanche 5h) :
#   0 5 * * 0 /home/deploy/mentaltech-discover/scripts/maintenance.sh --no-color >> /var/log/mentaltech-maintenance.log 2>&1
#
# =============================================================================

set -euo pipefail

# --- Configuration -----------------------------------------------------------

# Repertoire du projet (fonctionne depuis n'importe quel dossier)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Domaine pour la verification SSL (ajuster si necessaire)
DOMAIN="${MENTALTECH_DOMAIN:-discover.mentaltechmaker.fr}"

# Seuils d'alerte
DISK_WARN_PERCENT=80
MEMORY_WARN_PERCENT=85
SSL_WARN_DAYS=14
BACKUP_MAX_AGE_HOURS=24

# Port expose par docker-compose
APP_PORT=3033

# Fichier de log
LOG_FILE="/var/log/mentaltech-maintenance.log"

# --- Couleurs (desactivables avec --no-color) --------------------------------

USE_COLOR=true
if [[ "${1:-}" == "--no-color" ]] || [[ ! -t 1 ]]; then
    USE_COLOR=false
fi

if $USE_COLOR; then
    VERT='\033[0;32m'
    JAUNE='\033[1;33m'
    ROUGE='\033[0;31m'
    BLEU='\033[0;34m'
    GRAS='\033[1m'
    RESET='\033[0m'
else
    VERT='' JAUNE='' ROUGE='' BLEU='' GRAS='' RESET=''
fi

# --- Variables globales du rapport -------------------------------------------

AVERTISSEMENTS=0
CRITIQUES=0
RAPPORT=""

# --- Fonctions utilitaires ---------------------------------------------------

# Horodatage pour le rapport
horodatage() {
    date '+%Y-%m-%d %H:%M:%S'
}

# Ajoute une ligne au rapport
rapport() {
    local ligne="$1"
    RAPPORT+="$ligne"$'\n'
    echo -e "$ligne"
}

# Indicateurs de statut
statut_ok() {
    rapport "  ${VERT}[OK]${RESET}   $1"
}

statut_warn() {
    rapport "  ${JAUNE}[WARN]${RESET} $1"
    ((AVERTISSEMENTS++)) || true
}

statut_fail() {
    rapport "  ${ROUGE}[FAIL]${RESET} $1"
    ((CRITIQUES++)) || true
}

statut_info() {
    rapport "  ${BLEU}[INFO]${RESET} $1"
}

section() {
    rapport ""
    rapport "${GRAS}=== $1 ===${RESET}"
    rapport ""
}

# Verifie si une commande est disponible
commande_disponible() {
    command -v "$1" &>/dev/null
}

# =============================================================================
# 1. VERIFICATION DE SANTE
# =============================================================================

verifier_sante() {
    section "1. VERIFICATION DE SANTE"

    # --- Conteneurs Docker ---
    if commande_disponible docker; then
        if docker info &>/dev/null; then
            local conteneurs_attendus=("mentaltech-discover-db" "mentaltech-discover-backend" "mentaltech-discover-frontend" "mentaltech-discover-backup")
            local tous_ok=true

            for conteneur in "${conteneurs_attendus[@]}"; do
                local etat
                etat=$(docker inspect --format='{{.State.Status}}' "$conteneur" 2>/dev/null || echo "absent")
                if [[ "$etat" == "running" ]]; then
                    statut_ok "Conteneur $conteneur : en cours d'execution"
                else
                    statut_fail "Conteneur $conteneur : $etat"
                    tous_ok=false
                fi
            done

            if $tous_ok; then
                statut_ok "Tous les conteneurs sont operationnels"
            fi
        else
            statut_warn "Docker n'est pas accessible (permissions insuffisantes ?)"
            statut_info "Suggestion : ajouter l'utilisateur au groupe docker ou executer avec sudo"
        fi
    else
        statut_fail "Docker n'est pas installe"
    fi

    # --- Endpoint API /api/health ---
    rapport ""
    if curl -sf -o /dev/null -m 10 "http://localhost:${APP_PORT}/api/health" 2>/dev/null; then
        statut_ok "API health endpoint repond correctement"
    else
        statut_fail "API health endpoint ne repond pas (localhost:${APP_PORT}/api/health)"
    fi

    # --- Frontend ---
    if curl -sf -o /dev/null -m 10 "http://localhost:${APP_PORT}" 2>/dev/null; then
        statut_ok "Frontend repond correctement"
    else
        statut_fail "Frontend ne repond pas (localhost:${APP_PORT})"
    fi

    # --- Espace disque ---
    rapport ""
    local disk_usage
    disk_usage=$(df / --output=pcent 2>/dev/null | tail -1 | tr -d ' %')
    if [[ -n "$disk_usage" ]]; then
        if (( disk_usage >= DISK_WARN_PERCENT )); then
            statut_warn "Espace disque : ${disk_usage}% utilise (seuil : ${DISK_WARN_PERCENT}%)"
        else
            statut_ok "Espace disque : ${disk_usage}% utilise"
        fi
    fi

    # --- Memoire ---
    local mem_usage
    mem_usage=$(free | awk '/^Mem:/ {printf "%.0f", $3/$2 * 100}')
    if [[ -n "$mem_usage" ]]; then
        if (( mem_usage >= MEMORY_WARN_PERCENT )); then
            statut_warn "Memoire : ${mem_usage}% utilisee (seuil : ${MEMORY_WARN_PERCENT}%)"
        else
            statut_ok "Memoire : ${mem_usage}% utilisee"
        fi
    fi

    # --- Certificat SSL ---
    rapport ""
    if commande_disponible openssl; then
        local expiry_date
        expiry_date=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN":443 2>/dev/null \
            | openssl x509 -noout -enddate 2>/dev/null \
            | cut -d= -f2)

        if [[ -n "$expiry_date" ]]; then
            local expiry_epoch now_epoch jours_restants
            expiry_epoch=$(date -d "$expiry_date" +%s 2>/dev/null || echo "0")
            now_epoch=$(date +%s)

            if (( expiry_epoch > 0 )); then
                jours_restants=$(( (expiry_epoch - now_epoch) / 86400 ))
                if (( jours_restants < SSL_WARN_DAYS )); then
                    statut_warn "Certificat SSL expire dans ${jours_restants} jours (seuil : ${SSL_WARN_DAYS}j)"
                else
                    statut_ok "Certificat SSL valide encore ${jours_restants} jours"
                fi
            else
                statut_warn "Impossible de parser la date d'expiration SSL"
            fi
        else
            statut_info "Verification SSL impossible (domaine $DOMAIN non joignable)"
        fi
    else
        statut_info "openssl non installe - verification SSL ignoree"
    fi
}

# =============================================================================
# 2. MAINTENANCE DOCKER
# =============================================================================

maintenance_docker() {
    section "2. MAINTENANCE DOCKER"

    if ! commande_disponible docker || ! docker info &>/dev/null; then
        statut_info "Docker non accessible - nettoyage ignore"
        return 0
    fi

    # Espace avant nettoyage
    local espace_avant
    espace_avant=$(docker system df --format '{{.Size}}' 2>/dev/null | head -1 || echo "inconnu")
    statut_info "Espace Docker avant nettoyage : images = ${espace_avant}"

    # Nettoyage des images inutilisees
    local images_supprimees
    images_supprimees=$(docker image prune -f 2>/dev/null | tail -1 || echo "erreur")
    statut_ok "Images prunees : $images_supprimees"

    # Nettoyage des volumes orphelins (sauf ceux marques "keep")
    local volumes_supprimes
    volumes_supprimes=$(docker volume prune -f --filter "label!=keep" 2>/dev/null | tail -1 || echo "erreur")
    statut_ok "Volumes prunes : $volumes_supprimes"

    # Nettoyage du cache de build (garder 1 Go)
    local cache_supprime
    cache_supprime=$(docker builder prune -f --keep-storage 1073741824 2>/dev/null | tail -1 || echo "erreur")
    statut_ok "Cache de build prune : $cache_supprime"

    # Espace apres nettoyage
    local espace_apres
    espace_apres=$(docker system df --format '{{.Size}}' 2>/dev/null | head -1 || echo "inconnu")
    statut_info "Espace Docker apres nettoyage : images = ${espace_apres}"
}

# =============================================================================
# 3. VERIFICATION DES MISES A JOUR DE SECURITE
# =============================================================================

verifier_securite() {
    section "3. MISES A JOUR DE SECURITE"

    # --- Mises a jour systeme (unattended-upgrades) ---
    if commande_disponible unattended-upgrade; then
        local mises_a_jour
        mises_a_jour=$(apt list --upgradable 2>/dev/null | grep -c "security" || echo "0")
        if (( mises_a_jour > 0 )); then
            statut_warn "${mises_a_jour} mises a jour de securite en attente"
            statut_info "Suggestion : sudo apt upgrade -y"
        else
            statut_ok "Pas de mises a jour de securite en attente"
        fi
    elif commande_disponible apt; then
        local total_updates
        total_updates=$(apt list --upgradable 2>/dev/null | grep -c "/" || echo "0")
        if (( total_updates > 0 )); then
            statut_info "${total_updates} paquets pouvant etre mis a jour"
        else
            statut_ok "Systeme a jour"
        fi
    else
        statut_info "Gestionnaire de paquets apt non disponible"
    fi

    # --- Images Docker ---
    rapport ""
    if commande_disponible docker && docker info &>/dev/null; then
        # Comparer les digests locaux avec les distants pour les images utilisees
        local images_a_jour=true

        # Verifier postgres:16-alpine (utilisee par db et backup)
        local digest_local digest_distant
        digest_local=$(docker image inspect postgres:16-alpine --format='{{index .RepoDigests 0}}' 2>/dev/null || echo "")
        if [[ -n "$digest_local" ]]; then
            # Pull en dry-run : on tire l'image et on compare
            digest_distant=$(docker pull postgres:16-alpine 2>/dev/null | grep "Digest:" | awk '{print $2}' || echo "")
            if [[ -n "$digest_distant" ]] && [[ "$digest_local" != *"$digest_distant"* ]]; then
                statut_warn "Image postgres:16-alpine : mise a jour disponible"
                images_a_jour=false
            else
                statut_ok "Image postgres:16-alpine : a jour"
            fi
        else
            statut_info "Image postgres:16-alpine non presente localement"
        fi

        if $images_a_jour; then
            statut_ok "Images Docker de base a jour"
        fi
    fi

    # --- Fail2ban ---
    rapport ""
    if commande_disponible fail2ban-client; then
        local f2b_status
        f2b_status=$(fail2ban-client status 2>/dev/null || echo "")
        if [[ -n "$f2b_status" ]]; then
            statut_ok "Fail2ban est actif"
            # Compter les bans actuels
            local bans_actuels
            bans_actuels=$(fail2ban-client status sshd 2>/dev/null | grep "Currently banned" | awk '{print $NF}' || echo "0")
            statut_info "Fail2ban - IPs actuellement bannies (sshd) : ${bans_actuels}"
        else
            statut_warn "Fail2ban ne repond pas"
        fi
    else
        statut_info "Fail2ban non installe - verification ignoree"
        statut_info "Suggestion : sudo apt install fail2ban"
    fi
}

# =============================================================================
# 4. VERIFICATION DES SAUVEGARDES
# =============================================================================

verifier_sauvegardes() {
    section "4. VERIFICATION DES SAUVEGARDES"

    # Verifier que le conteneur backup tourne
    if commande_disponible docker && docker info &>/dev/null; then
        local backup_status
        backup_status=$(docker inspect --format='{{.State.Status}}' mentaltech-discover-backup 2>/dev/null || echo "absent")
        if [[ "$backup_status" == "running" ]]; then
            statut_ok "Conteneur de sauvegarde en cours d'execution"
        else
            statut_fail "Conteneur de sauvegarde : $backup_status"
        fi

        # Lister les dernieres sauvegardes via docker exec
        rapport ""
        local derniers_backups
        derniers_backups=$(docker exec mentaltech-discover-backup ls -lht /backups/ 2>/dev/null | head -10 || echo "")
        if [[ -n "$derniers_backups" ]]; then
            statut_info "Dernieres sauvegardes :"
            while IFS= read -r ligne; do
                rapport "         $ligne"
            done <<< "$derniers_backups"

            # Verifier l'age du dernier backup DB
            rapport ""
            local dernier_backup_ts
            dernier_backup_ts=$(docker exec mentaltech-discover-backup sh -c 'stat -c %Y /backups/db_*.sql.gz 2>/dev/null | sort -n | tail -1' 2>/dev/null || echo "0")
            if [[ "$dernier_backup_ts" -gt 0 ]]; then
                local maintenant age_heures
                maintenant=$(date +%s)
                age_heures=$(( (maintenant - dernier_backup_ts) / 3600 ))
                if (( age_heures > BACKUP_MAX_AGE_HOURS )); then
                    statut_fail "Derniere sauvegarde DB il y a ${age_heures}h (seuil : ${BACKUP_MAX_AGE_HOURS}h)"
                else
                    statut_ok "Derniere sauvegarde DB il y a ${age_heures}h"
                fi
            else
                statut_warn "Aucune sauvegarde DB trouvee"
            fi

            # Espace utilise par les sauvegardes
            local taille_backups
            taille_backups=$(docker exec mentaltech-discover-backup du -sh /backups/ 2>/dev/null | cut -f1 || echo "inconnu")
            statut_info "Espace utilise par les sauvegardes : ${taille_backups}"
        else
            statut_warn "Impossible de lister les sauvegardes (conteneur inaccessible ?)"
        fi
    else
        statut_warn "Docker non accessible - verification des sauvegardes ignoree"
    fi
}

# =============================================================================
# 5. ANALYSE DES LOGS
# =============================================================================

analyser_logs() {
    section "5. ANALYSE DES LOGS (7 derniers jours)"

    # --- Erreurs HTTP (nginx access log) ---
    local nginx_log="/var/log/nginx/access.log"
    if [[ -r "$nginx_log" ]]; then
        local date_7j_ago
        date_7j_ago=$(date -d "7 days ago" '+%d/%b/%Y')

        # Compter les erreurs 4xx et 5xx
        local erreurs_4xx erreurs_5xx
        erreurs_4xx=$(awk -v depuis="$date_7j_ago" '$4 >= "["depuis && $9 ~ /^4[0-9][0-9]$/' "$nginx_log" 2>/dev/null | wc -l || echo "0")
        erreurs_5xx=$(awk -v depuis="$date_7j_ago" '$4 >= "["depuis && $9 ~ /^5[0-9][0-9]$/' "$nginx_log" 2>/dev/null | wc -l || echo "0")

        statut_info "Erreurs HTTP 4xx (7j) : ${erreurs_4xx}"
        if (( erreurs_5xx > 0 )); then
            statut_warn "Erreurs HTTP 5xx (7j) : ${erreurs_5xx}"
        else
            statut_ok "Erreurs HTTP 5xx (7j) : 0"
        fi
    else
        statut_info "Log nginx non lisible ($nginx_log)"
        statut_info "Suggestion : sudo chmod o+r $nginx_log ou executer avec sudo"
    fi

    # --- Tentatives d'authentification echouees ---
    rapport ""
    local auth_log="/var/log/auth.log"
    if [[ -r "$auth_log" ]]; then
        local tentatives_echouees
        tentatives_echouees=$(grep -c "Failed password" "$auth_log" 2>/dev/null || echo "0")
        if (( tentatives_echouees > 50 )); then
            statut_warn "Tentatives d'auth echouees (auth.log) : ${tentatives_echouees}"
        else
            statut_ok "Tentatives d'auth echouees (auth.log) : ${tentatives_echouees}"
        fi
    else
        statut_info "Log auth non lisible ($auth_log)"
    fi

    # --- Fail2ban : bans des 7 derniers jours ---
    rapport ""
    local f2b_log="/var/log/fail2ban.log"
    if [[ -r "$f2b_log" ]]; then
        local bans_7j
        bans_7j=$(grep -c "Ban " "$f2b_log" 2>/dev/null || echo "0")
        statut_info "Bans Fail2ban (log complet) : ${bans_7j}"

        # Top 5 des IPs bannies
        local top_ips
        top_ips=$(grep "Ban " "$f2b_log" 2>/dev/null | awk '{print $NF}' | sort | uniq -c | sort -rn | head -5 || echo "")
        if [[ -n "$top_ips" ]]; then
            statut_info "Top 5 IPs bannies :"
            while IFS= read -r ligne; do
                rapport "         $ligne"
            done <<< "$top_ips"
        fi
    else
        statut_info "Log Fail2ban non lisible ($f2b_log)"
    fi

    # --- Logs Docker du backend (erreurs recentes) ---
    rapport ""
    if commande_disponible docker && docker info &>/dev/null; then
        local erreurs_backend
        erreurs_backend=$(docker logs mentaltech-discover-backend --since 168h 2>&1 | grep -ic "error\|exception\|traceback" || echo "0")
        if (( erreurs_backend > 10 )); then
            statut_warn "Erreurs backend Docker (7j) : ${erreurs_backend}"
        else
            statut_ok "Erreurs backend Docker (7j) : ${erreurs_backend}"
        fi
    fi
}

# =============================================================================
# 6. GENERATION DU RAPPORT
# =============================================================================

generer_rapport() {
    section "6. RESUME DE MAINTENANCE"

    local date_rapport
    date_rapport=$(horodatage)

    rapport "Date du rapport : $date_rapport"
    rapport "Serveur : $(hostname 2>/dev/null || echo 'inconnu')"
    rapport "Uptime : $(uptime -p 2>/dev/null || echo 'inconnu')"
    rapport ""

    # Resume final
    local total_problemes=$((AVERTISSEMENTS + CRITIQUES))

    if (( CRITIQUES > 0 )); then
        rapport "${ROUGE}${GRAS}MAINTENANCE CRITICAL : ${CRITIQUES} erreur(s) critique(s), ${AVERTISSEMENTS} avertissement(s)${RESET}"
    elif (( AVERTISSEMENTS > 0 )); then
        rapport "${JAUNE}${GRAS}MAINTENANCE WARN : ${AVERTISSEMENTS} avertissement(s)${RESET}"
    else
        rapport "${VERT}${GRAS}MAINTENANCE OK${RESET}"
    fi

    rapport ""
    rapport "---"
}

# =============================================================================
# EXECUTION PRINCIPALE
# =============================================================================

main() {
    rapport ""
    rapport "${GRAS}################################################################${RESET}"
    rapport "${GRAS}# MentalTech Discover - Maintenance automatique               #${RESET}"
    rapport "${GRAS}# $(horodatage)                                        #${RESET}"
    rapport "${GRAS}################################################################${RESET}"

    # Se placer dans le repertoire du projet
    cd "$PROJECT_DIR" || true

    # Executer chaque etape
    verifier_sante
    maintenance_docker
    verifier_securite
    verifier_sauvegardes
    analyser_logs
    generer_rapport

    # Ecrire le rapport dans le fichier de log si possible
    if [[ -w "$(dirname "$LOG_FILE")" ]] || [[ -w "$LOG_FILE" ]]; then
        # Ecrire une version sans couleurs dans le log
        echo "$RAPPORT" | sed 's/\x1b\[[0-9;]*m//g' >> "$LOG_FILE"
    fi

    # Code de sortie
    if (( CRITIQUES > 0 )); then
        exit 2
    elif (( AVERTISSEMENTS > 0 )); then
        exit 1
    else
        exit 0
    fi
}

main "$@"
