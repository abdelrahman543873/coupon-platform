FROM node:12

WORKDIR ./

COPY package.json package.json

RUN yarn

RUN yarn global add nodemon

COPY . .

ENV RUN_INSIDE_DOCKER=true

CMD [ "yarn", "start" ]
