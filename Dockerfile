FROM node:18-alpine
WORKDIR /app
RUN apk update
RUN apk add chromium
RUN npm prune --production
CMD [ "node", "./dist/main.js" ]