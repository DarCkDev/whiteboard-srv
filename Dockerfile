FROM node:16

RUN mkdir -p /usr/src/app/server

WORKDIR /usr/src/app/server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3003

CMD ["npm", "start"]