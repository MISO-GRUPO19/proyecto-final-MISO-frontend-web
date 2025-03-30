# Etapa 1: Build de Angular
FROM node:18 AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npx ng build --configuration production

# Etapa 2: Nginx para servir archivos estáticos
FROM nginx:alpine

# Elimina la página de bienvenida de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia el build de Angular desde la etapa anterior
COPY --from=build-stage /app/dist/proyecto-base/browser /usr/share/nginx/html

# Opcional: Copia configuración custom si quieres hacer rutas Angular-friendly
COPY nginx.conf /etc/nginx/conf.d/default.conf
