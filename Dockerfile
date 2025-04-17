FROM node:20-alpine AS development

LABEL org.opencontainers.image.authors="Ayobami Adejumo"
LABEL org.opencontainers.image.title="Jobberman Backend Service"
LABEL org.opencontainers.image.description="A dockerfile to build a backend service for a recruitment platform"
LABEL org.opencontainers.image.version="1.0"
LABEL org.opencontainers.image.url="https://github.com/janto-pee/jobberman"
LABEL org.opencontainers.image.source="https://github.com/janto-pee/jobberman"

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config

# Create logs directory
RUN mkdir -p logs

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]


# RUN apk --no-cache add curl
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl -f http://loalhost:1337/healthcheck || exit 1


# RUN mkdir app
# WORKDIR /app
# RUN apk add --no-cache openssl
# COPY package*.json .
# COPY . .
# RUN npm cache clean --force 
# RUN rm -rf node_modules 
# RUN npm install
# RUN npx prisma generate

# FROM node:20-alpine AS build
# WORKDIR /app
# RUN apk add --no-cache openssl
# COPY package*.json .
# COPY --from=development /app/node_modules ./node_modules
# COPY . .
# RUN npm run build
# ENV NODE_ENV=production
# RUN npm ci --only=production

# FROM node:20-alpine AS production
# RUN apk add --no-cache openssl
# COPY --from=build /app/node_modules ./node_modules
# COPY --from=build /app/build ./build

# ENV PORT=1337
# EXPOSE $PORT
# CMD [ "node", "build/src/index.js" ]

# RUN apk --no-cache add curl
# HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl -f http://loalhost:1337/healthcheck || exit 1




