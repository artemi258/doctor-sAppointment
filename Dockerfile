FROM node:18-alpine
WORKDIR /app
RUN apk update
RUN apk add chromium
COPY package*.json ./
RUN npm install
COPY . .
RUN npx tsc
RUN npm prune --production
CMD [ "node", "./dist/main.js" ]