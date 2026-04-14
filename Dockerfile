# Étape 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY tsconfig*.json ./
COPY angular.json ./

# Installer les dépendances
RUN npm ci --legacy-peer-deps

# Copier le code source
COPY src ./src

# Build l'application
ARG API_URL=http://12.24.5.100:8085
ENV API_URL=$API_URL
RUN npm run build -- --configuration=production

# Étape 2: Serveur Nginx (plus fiable)
FROM nginx:alpine

# Installer curl pour healthcheck
RUN apk add --no-cache curl

# Copier les fichiers buildés
COPY --from=builder /app/dist/gestion-de-stock /usr/share/nginx/html

# Créer la configuration Nginx
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    location /api/ { \
        proxy_pass http://12.24.5.100:8085/; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]