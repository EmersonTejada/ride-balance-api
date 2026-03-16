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

# Instalamos solo dependencias de producción (@prisma/client sí se instala aquí)
RUN npm ci --omit=dev

# COPIAMOS el cliente generado desde el builder (ajusta la ruta según tu proyecto)
# Según tus logs anteriores, lo generas en ./src/generated/prisma
COPY --from=builder /app/src/generated/prisma ./src/generated/prisma
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["npm", "start"]