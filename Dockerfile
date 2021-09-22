# syntax=docker/dockerfile:1
FROM node:16-alpine
WORKDIR /bot
COPY . /bot
RUN npm i
CMD ["node", "index.js"]