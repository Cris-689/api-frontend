# --- FASE 1: DEPENDENCIAS ---
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Usamos el comodín * para importar el lockfile si existe, pero sin hacerlo obligatorio
COPY package*.json ./

# Forzamos la limpieza de la caché interna de npm para evitar corrupciones previas
# y ejecutamos npm install para que el árbol se resuelva nativamente en Alpine.
RUN npm cache clean --force && npm install --no-fund --no-audit

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