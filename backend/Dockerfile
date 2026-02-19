# Multi-stage build for DevOps Agent
FROM node:18-alpine AS base

# Install system dependencies for git, python, and testing tools
RUN apk add --no-cache \
    git \
    python3 \
    py3-pip \
    openjdk11-jre \
    bash \
    curl

# Install common test frameworks globally
RUN npm install -g jest pytest eslint

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Copy application code
COPY . .

# Create temp directory for cloned repos
RUN mkdir -p /app/temp_repos && chmod 777 /app/temp_repos

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["node", "src/server.js"]
