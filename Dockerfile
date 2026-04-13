FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./

# Installer les dépendances
RUN npm ci --legacy-peer-deps

# Copier le code source
COPY src ./src
COPY environments ./environments 2>/dev/null || true

# Variables d'environnement pour le build
ARG API_URL=http://12.24.5.100:8085
ENV API_URL=$API_URL

# Remplacer l'URL de l'API dans les environnements (si nécessaire)
RUN if [ -f "src/environments/environment.prod.ts" ]; then \
        sed -i "s|API_URL_PLACEHOLDER|${API_URL}|g" src/environments/environment.prod.ts; \
    fi

# Build l'application Angular
RUN npm run build -- --configuration=production

# Vérifier que le build a réussi
RUN ls -la dist/ && test -d dist/gestion-de-stock && echo "✅ Build successful"

# Stage de production
FROM nginx:alpine

# Installer curl pour les healthchecks
RUN apk add --no-cache curl

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés depuis l'étape builder
COPY --from=builder /app/dist/gestion-de-stock /usr/share/nginx/html

# Copier un fichier de configuration d'environnement pour le runtime
RUN echo "window.API_URL = '${API_URL}';" > /usr/share/nginx/html/config.js

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Exposer le port
EXPOSE 4200

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]