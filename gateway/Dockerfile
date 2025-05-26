FROM node:alpine

WORKDIR /backend/gateway

COPY package*.json ./

RUN npm install

COPY . .

RUN npm i -g nodemon

EXPOSE 8000

# CMD ["node","index.js"]
RUN npm run start