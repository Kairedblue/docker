FROM node:alpine 

EXPOSE 5000

WORKDIR /usr/app

ENV MONGO_URI=mongodb://root:example@mongodb:27017/test

RUN npm i npm@latest -g

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]