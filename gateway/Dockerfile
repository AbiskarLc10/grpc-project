FROM node:alpine

WORKDIR /backend/gateway

COPY /gateway/package*.json ./

RUN npm install

COPY /gateway .

COPY /gateway/.env .env

COPY /proto /backend/proto

RUN npm i -g nodemon

EXPOSE 8000

RUN npm run start