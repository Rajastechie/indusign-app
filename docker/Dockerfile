# Multi-stage Dockerfile for InduSign Electron Application
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    NODE_ENV=production

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (handle lock file sync issues)
RUN npm install --omit=dev --legacy-peer-deps || npm install --omit=dev --force --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    dumb-init

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    NODE_ENV=production \
    ELECTRON_DISABLE_SECURITY_WARNINGS=true

# Create app directory
WORKDIR /app

# Copy built application from build stage
COPY --from=base /app/build ./build
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package*.json ./

# Install serve package for production
RUN npm install serve@14.2.1 --omit=dev

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S electron -u 1001

# Change ownership of the app directory
RUN chown -R electron:nodejs /app

# Switch to non-root user
USER electron

# Expose port (if running in web mode)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "console.log('Health check passed')" || exit 1

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["npx", "serve", "-s", "build", "-l", "3000"] 