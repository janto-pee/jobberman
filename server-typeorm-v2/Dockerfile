# FROM node:20-alpine AS builder
# RUN mkdir app
# WORKDIR /app
# COPY . .
# COPY package*.json .
# RUN npm install
# RUN npm run build

# FROM node:10-alpine AS runner
# COPY --chown=node:node --from=builder /app/package*.json .
# COPY .env .
# RUN npm install --omit=dev
# COPY --from=builder /app/build .
# EXPOSE 1337
# CMD [ "node", "./src/index.js"]

# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

COPY wait-for.sh ./

RUN chmod +x ./wait-for.sh .
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .


# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
# ENTRYPOINT ["./wait-for.sh"]
CMD [ "node", "build/src/index.js" ]