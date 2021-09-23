# syntax=docker/dockerfile:1
FROM node:16-alpine
RUN apk add --no-cache curl exa
WORKDIR /bot
COPY ./src /bot
RUN npm i
CMD ["node", "index.js"]