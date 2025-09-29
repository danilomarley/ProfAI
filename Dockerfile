# Multi-stage build OTIMIZADO para ProfAi TCC Editor
# Build time: ~2-3 minutos (vs 7+ minutos)

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app

# Install build dependencies uma vez só
RUN apk add --no-cache python3 make g++

# Copy e instalar dependências (cached layer)
COPY package*.json ./
RUN npm ci --silent --no-audit --no-fund --prefer-offline

# Copy source e build
COPY . .
RUN npm run build

# Stage 2: Backend dependencies (SUPER OTIMIZADO)
FROM node:18-alpine AS backend-deps
WORKDIR /app

# Install build deps
RUN apk add --no-cache python3 make g++

# CRÍTICO: Skip Puppeteer download (economiza ~5 minutos)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Install dependencies
COPY backend/package*.json ./
RUN npm ci --only=production --silent --no-audit --no-fund --prefer-offline

# Stage 3: Production image MÍNIMA
FROM node:18-alpine AS production
WORKDIR /app

# Install apenas runtime deps (não build deps)
RUN apk add --no-cache \
    chromium \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Set Puppeteer para usar chromium do sistema
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=warn

# Create user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Create directories
RUN mkdir -p /app/uploads /app/exports /app/logs && \
    chown -R nodejs:nodejs /app

# Copy APENAS production files
COPY --from=backend-deps --chown=nodejs:nodejs /app/node_modules ./backend/node_modules
COPY --chown=nodejs:nodejs backend/src ./backend/src
COPY --chown=nodejs:nodejs backend/package.json ./backend/
COPY --from=frontend-build --chown=nodejs:nodejs /app/dist ./dist

# Switch to user
USER nodejs

EXPOSE 5000

# Optimized health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=2 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "backend/src/server.js"]
