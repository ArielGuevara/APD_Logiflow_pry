# Etapa 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copiar archivos de configuración de dependencias primero (para aprovechar cache)
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies para el build)
RUN npm install && \
    npm cache clean --force

# Copiar código fuente
COPY src ./src

# Compilar la aplicación
RUN npm run build

# Instalar solo dependencias de producción en una carpeta separada
RUN mkdir -p /prod && \
    cp package*.json /prod/ && \
    cd /prod && \
    npm install --omit=dev && \
    npm cache clean --force

# Etapa 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup -S nestjs && adduser -S nestjs -G nestjs

# Copiar solo las dependencias de producción
COPY --from=build /prod/node_modules ./node_modules

# Copiar el código compilado
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Cambiar al usuario no-root
USER nestjs:nestjs

# Exponer el puerto
EXPOSE 3001

# Variables de entorno con valores por defecto
ENV NODE_ENV=production
ENV PORT=3001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/notifications', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de inicio
CMD ["node", "dist/main.js"]