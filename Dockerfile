# Étape 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de config en premier (pour le cache Docker)
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.spec.json ./
COPY angular.json ./

# Installer les dépendances
RUN npm ci --legacy-peer-deps

# Copier le code source
COPY src ./src

# Build l'application
ARG API_URL=http://12.24.5.100:8085
ENV API_URL=$API_URL
RUN npm run build -- --configuration=production

# Étape 2: Serveur de production
FROM node:18-alpine

WORKDIR /app

# Installer http-server
RUN npm install -g http-server

# Copier les fichiers buildés
COPY --from=builder /app/dist/gestion-de-stock /app/dist

EXPOSE 4200

CMD ["http-server", "dist", "-p", "4200", "--host", "0.0.0.0", "--cors"]