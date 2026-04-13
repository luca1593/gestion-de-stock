# Étape 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copier le code source
COPY . .

# Build l'application
ARG API_URL=http://12.24.5.100:8085
ENV API_URL=$API_URL
RUN npm run build -- --configuration=production

# Étape 2: Serveur de développement (ou production)
FROM node:18-alpine

WORKDIR /app

# Installer serveur http simple
RUN npm install -g http-server

# Copier les fichiers buildés depuis l'étape builder
COPY --from=builder /app/dist/gestion-de-stock /app/dist

# Exposer le port 4200 (port interne Docker)
EXPOSE 4200

# Démarrer le serveur sur le port 4200
CMD ["http-server", "dist", "-p", "4200", "--host", "0.0.0.0", "--cors"]