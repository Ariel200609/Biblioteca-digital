FROM node:20-alpine

WORKDIR /app

# Copiar package.json
COPY package.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto Vite
EXPOSE 5173

# Comando por defecto
CMD ["npm", "run", "dev"]
