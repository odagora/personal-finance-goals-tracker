# Usar la imagen oficial de Node.js LTS
FROM node:20-slim

# Crear y establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm install

# Generar el cliente de Prisma
RUN npx prisma generate

# Copiar el código fuente
COPY . .

# Exponer el puerto que usará la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "dev"]