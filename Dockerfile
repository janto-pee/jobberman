FROM node:20-alpine AS builder
RUN mkdir app
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 1337
CMD [ "node", "build/src/index.js" ]