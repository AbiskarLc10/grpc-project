FROM node:alpine

WORKDIR /backend/gateway

COPY package*.json ./

RUN npm install

COPY . .

COPY ../proto /backend

RUN npm i -g nodemon

EXPOSE 8000

RUN npm run start