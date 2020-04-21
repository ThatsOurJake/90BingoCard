FROM node:12.13-alpine as base

WORKDIR /app

COPY package.json ./package.json
COPY webpack.config.js ./webpack.config.js
COPY .babelrc ./.babelrc

RUN npm i



FROM base as build

COPY src /app/src
COPY webpack.config.prod.js /app/webpack.config.prod.js

RUN npm run build



FROM node:12.13-alpine as prod_modules

WORKDIR /prod_modules

COPY package.json ./package.json

RUN npm install --only=production



FROM node:12.13-alpine

WORKDIR /90Bingo

COPY --from=base /app/package.json ./package.json
COPY --from=build /app/dist .
COPY --from=prod_modules /prod_modules/node_modules ./node_modules

CMD [ "npm", "start" ]