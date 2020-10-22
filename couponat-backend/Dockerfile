FROM node:12.19.0-alpine

WORKDIR /coupons

COPY package.json .

RUN yarn install

RUN npm install -g nodemon

COPY . .

ENV RUN_INSIDE_DOCKER=true

CMD [ "npm", "run", "start" ]
