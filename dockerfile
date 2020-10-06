FROM node:13.11

WORKDIR /backend

COPY package*.json ./

RUN npm install

RUN npm install -g nodemon

COPY . .

ENV RUN_INSIDE_DOCKER=true

CMD [ "npm", "run", "start" ]