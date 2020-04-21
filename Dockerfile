FROM node:12.13-alpine as build

WORKDIR /app

COPY src ./src

COPY package.json ./package.json

COPY .babelrc ./.babelrc

RUN npm i

RUN npm run build



FROM node:12.13-alpine as prod_modules

WORKDIR /prod_modules

COPY package.json ./package.json

RUN npm install --only=production



FROM node:12.13-alpine

WORKDIR /BingoCard

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist .
COPY --from=prod_modules /prod_modules/node_modules ./node_modules

CMD [ "npm", "start" ]