# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -- --configuration production

# Etapa final con Nginx
FROM nginx:alpine
COPY --from=builder /app/dist/proyecto-base /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
