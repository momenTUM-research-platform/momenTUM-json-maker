FROM node:16-bullseye

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV production

EXPOSE 3000

RUN npm run build

CMD [ "npm", "run", "serve" ]

