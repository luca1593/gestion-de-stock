# Étape 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copier tous les fichiers de configuration
COPY package*.json ./
COPY . .

# Installer les dépendances
RUN npm ci --legacy-peer-deps

# Build l'application
ARG API_URL=http://12.24.5.100:8085
ENV API_URL=$API_URL
RUN npm run build -- --configuration=production

# Étape 2: Serveur de production
FROM node:18-alpine

WORKDIR /app

# Installer serveur http simple
RUN npm install -g http-server

# Copier les fichiers buildés depuis l'étape builder
COPY --from=builder /app/dist/gestion-de-stock /app/dist

# Exposer le port 4200
EXPOSE 4200

# Démarrer le serveur
CMD ["http-server", "dist", "-p", "4200", "--host", "0.0.0.0", "--cors"]