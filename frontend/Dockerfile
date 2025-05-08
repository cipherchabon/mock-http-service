# ./frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Compilar la aplicación de React
RUN npm run build

# Imagen de producción
FROM nginx:alpine

# Copiar el build a la imagen de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]