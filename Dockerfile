FROM node:12.19.0-alpine

WORKDIR ./

COPY package.json package.json

RUN yarn

RUN yarn global add nodemon

COPY . .

ENV RUN_INSIDE_DOCKER=true

CMD [ "yarn", "start" ]
