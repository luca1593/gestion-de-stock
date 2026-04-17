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

# Build l'application
RUN npm run build -- --configuration=production --output-path=dist

# Étape 2: Serveur Nginx avec proxy vers backend
FROM nginx:alpine

# Créer la configuration nginx avec proxy
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy vers le backend
    location /v1/ {
        proxy_pass http://gestiondestock-backend:8080/v1/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
        
        if ($request_method = OPTIONS) {
            return 204;
        }
    }
}
EOF

# Copier les fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]