FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./


RUN npm install

COPY . .

# ENV NODE_ENV development
ENV NODE_ENV production

EXPOSE 3000

RUN npm run build

CMD npm run preview -- --port 3000 --host

