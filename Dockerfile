# --- FASE 1: DEPENDENCIAS ---
# Utilizamos una imagen Alpine ligera y fijamos la versión mayor para evitar regresiones.
FROM node:20-alpine AS deps
# libc6-compat es necesario para algunos binarios nativos utilizados por dependencias de Node.js en Alpine.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
# npm ci garantiza instalaciones deterministas basadas en el lockfile, crítico para pipelines.
RUN npm ci

# --- FASE 2: CONSTRUCCIÓN ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Deshabilitamos la telemetría de Next.js durante el build para optimizar tiempos y privacidad.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# --- FASE 3: PRODUCCIÓN ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Creación de usuario no root para mitigar vulnerabilidades de escalada de privilegios en el clúster.
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiamos solo los assets públicos y los estáticos generados.
COPY --from=builder /app/public ./public

# Asignamos permisos correctos únicamente a los archivos estrictamente necesarios para la ejecución standalone.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cambiamos al usuario sin privilegios antes de ejecutar la aplicación.
USER nextjs

EXPOSE 3000
# Definimos el puerto y el hostname explícitamente para el servidor Node interno de Next.js.
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Ejecutamos el servidor standalone en lugar de 'npm start' para ahorrar memoria y CPU.
CMD ["node", "server.js"]