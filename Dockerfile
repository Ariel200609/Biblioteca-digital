FROM node:20-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY src ./src
COPY tsconfig.json ./

# Exponer el puerto
EXPOSE 3000

# Comando por defecto
CMD ["npm", "run", "dev:backend"]
