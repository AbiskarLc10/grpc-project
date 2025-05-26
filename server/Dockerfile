FROM node:alpine

WORKDIR /backend/server

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x ./start.sh

RUN ./start.sh

CMD ["node","index.js"]

