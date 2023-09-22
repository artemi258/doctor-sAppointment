FROM node:18-alpine
WORKDIR /app
RUN apk update
RUN apk add chromium
# RUN npm install --production
# RUN npm prune --production
CMD [ "npm", "run", "startt" ]