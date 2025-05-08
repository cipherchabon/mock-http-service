FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Crear directorio para la base de datos
RUN mkdir -p db

EXPOSE 3000

CMD ["node", "src/app.js"]