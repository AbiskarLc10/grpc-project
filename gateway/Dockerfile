FROM node:alpine

WORKDIR /backend/gateway

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node","index.js"]