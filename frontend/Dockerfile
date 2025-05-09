# ./frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Mostrar el contenido del directorio para debugging
RUN ls -la

# Compilar la aplicación de React
RUN npm run build

# Mostrar el contenido del directorio build para debugging
RUN ls -la build

# Imagen de producción
FROM nginx:alpine

# Copiar el build a la imagen de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Configuración de Nginx
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Mostrar el contenido del directorio html para debugging
RUN ls -la /usr/share/nginx/html

EXPOSE 80

CMD ["/bin/sh", "-c", "envsubst '$$BACKEND_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]