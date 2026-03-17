# Etapa 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY prisma ./prisma/
# Generamos el cliente en la carpeta personalizada que definiste
RUN npx prisma generate
COPY . .
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./

# 1. Instalamos dependencias de producción
RUN npm ci --omit=dev

# 2. COPIAMOS LA CARPETA PRISMA y la configuración
# La necesitamos para las migraciones en el deploy
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npx prisma generate
# 3. Copiamos los archivos generados y compilados desde el builder
COPY --from=builder /app/src/generated/prisma ./src/generated/prisma
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["npm", "start"]