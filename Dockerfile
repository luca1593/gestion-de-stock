# Étape 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.spec.json ./
COPY angular.json ./

# Installer les dépendances
RUN npm ci --legacy-peer-deps

# Copier le code source
COPY src ./src

# Build l'application avec la variable API_URL
ARG API_URL
ENV API_URL=${API_URL}
RUN npm run build -- --configuration=production --output-path=dist

# Étape 2: Serveur Nginx
FROM nginx:alpine

# Copier les fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]