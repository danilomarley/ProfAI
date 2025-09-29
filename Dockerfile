# Multi-stage build for ProfAi TCC Editor

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Build backend
FROM node:18-alpine AS backend-build
WORKDIR /app/backend

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++ git

# Copy package files and install production dependencies
COPY backend/package*.json ./
RUN npm ci --only=production --silent

# Copy backend source
COPY backend/ ./

# Stage 3: Production image
FROM node:18-alpine AS production
WORKDIR /app

# Install system dependencies for PDF generation and security
RUN apk add --no-cache \
    postgresql-client \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    dumb-init

# Set Puppeteer to use system Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Production environment variables
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=warn

# Create non-root user first
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Create directories with proper permissions
RUN mkdir -p /app/uploads /app/exports /app/logs && \
    chown -R nodejs:nodejs /app

# Copy backend with proper ownership
COPY --from=backend-build --chown=nodejs:nodejs /app/backend ./backend

# Copy frontend build with proper ownership
COPY --from=frontend-build --chown=nodejs:nodejs /app/frontend/dist ./dist

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check with better error handling
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "backend/src/server.js"]

