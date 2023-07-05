FROM node:alpine 

EXPOSE 5000

WORKDIR /usr/app


RUN npm i npm@latest -g

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]