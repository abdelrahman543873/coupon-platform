FROM node:15

WORKDIR ./

COPY package.json package.json

RUN yarn

COPY . .

ENV RUN_INSIDE_DOCKER=true

CMD [ "yarn", "start" ]
