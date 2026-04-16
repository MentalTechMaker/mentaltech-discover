# Multi-stage build pour optimiser la taille de l'image

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer toutes les dépendances (y compris devDependencies pour le build)
# Fix pour Alpine Linux (musl): installer explicitement le package Rollup natif
RUN npm i --no-audit --no-fund && \
    npm install --no-save @rollup/rollup-linux-x64-musl && \
    npm cache clean --force

# Copier le code source
COPY . .

# Build l'application
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Sécurité: Mettre à jour les packages système
RUN apk update && \
    apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Sécurité: Créer un utilisateur nginx non-root
RUN addgroup -g 101 -S nginx && \
    adduser -S nginx -u 101 -G nginx 2>/dev/null || true

# Sécurité: Configurer les permissions et créer les répertoires nécessaires
RUN mkdir -p /var/cache/nginx /var/log/nginx /etc/nginx/conf.d /var/run /usr/share/nginx/html /tmp/client_body /tmp/proxy_temp /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /etc/nginx/conf.d /var/run /usr/share/nginx/html /tmp/client_body /tmp/proxy_temp /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

# Copier le build depuis le stage builder
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Copier la configuration nginx principale
COPY --chown=nginx:nginx nginx-main.conf /etc/nginx/nginx.conf

# Copier la configuration du site avec headers de sécurité
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 8080 (non-privilégié au lieu de 80)
EXPOSE 8080

# Sécurité: Passer à l'utilisateur non-root
USER nginx

# Sécurité: Utiliser dumb-init pour gérer les signaux correctement
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
