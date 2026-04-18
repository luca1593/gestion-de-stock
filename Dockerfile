# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.spec.json ./
COPY angular.json ./

RUN npm ci --legacy-peer-deps

COPY src ./src

RUN npm run build -- --configuration=production --output-path=dist

# Stage 2: Serve with ng serve
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/angular.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/tsconfig.app.json ./
COPY --from=builder /app/tsconfig.spec.json ./
COPY --from=builder /app/src ./src

EXPOSE 4200

CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4200"]