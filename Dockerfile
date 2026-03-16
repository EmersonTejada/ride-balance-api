# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia los archivos de manifiesto de dependencias
COPY package.json package-lock.json ./

# Instala todas las dependencias
RUN npm ci

# Copia la carpeta Prisma y genera el cliente
COPY prisma ./prisma/
RUN npx prisma generate

# Copia el resto del código fuente
COPY . .

# Construye la aplicación (compila TypeScript a JavaScript)
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine

WORKDIR /app

# Definir variables de entorno para producción
ENV NODE_ENV=production

# Copiar configuración de package
COPY package.json package-lock.json ./

# Instalar solo las dependencias de producción
RUN npm ci --omit=dev

# Copiar la carpeta Prisma y generar el cliente
COPY prisma ./prisma/
RUN npx prisma generate

# Copiar los archivos compilados desde la etapa de build
COPY --from=builder /app/dist ./dist

# Exponer el puerto de la API
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
