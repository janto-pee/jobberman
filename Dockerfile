FROM node:20-alpine

LABEL org.opencontainers.image.authors="Ayobami Adejumo"
LABEL org.opencontainers.image.title="Jobberman Backend Service"
LABEL org.opencontainers.image.description="A dockerfile to build a backend service for a recruitment platform"
LABEL org.opencontainers.image.version="1.0"
LABEL org.opencontainers.image.url="https://github.com/janto-pee/jobberman"
LABEL org.opencontainers.image.source="https://github.com/janto-pee/jobberman"

RUN mkdir app
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json .
COPY . .
RUN npm cache clean --force 
RUN rm -rf node_modules 
RUN npm install
RUN npx prisma generate

ENV PORT=1337

RUN npm run build
EXPOSE $PORT
CMD [ "node", "build/src/index.js" ]

RUN apk --no-cache add curl
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl -f http://loalhost:1337/healthcheck || exit 1

# HU FLACARECE