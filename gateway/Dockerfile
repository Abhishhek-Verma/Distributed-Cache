FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache wget && npm ci --omit=dev

COPY --chown=node:node . .

USER node

EXPOSE 3000

CMD ["node", "server.js"]