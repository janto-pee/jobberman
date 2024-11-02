FROM node:20-alpine AS builder
RUN mkdir app
WORKDIR /app
COPY . .
COPY package*.json .
RUN npm install
RUN npm run build

FROM node:10-alpine AS runner
COPY --chown=node:node --from=builder /app/package*.json .
COPY .env .
RUN npm install --omit=dev
COPY --from=builder /app/build .
EXPOSE 1337
CMD [ "node", "./src/index.js"]