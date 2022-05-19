FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV production
ENV PORT 3000
ENV BASE_BATH "."
ENV MASTER_PASSWORD "MomenTUM"

EXPOSE 3000

CMD [ "node", "server.js" ]