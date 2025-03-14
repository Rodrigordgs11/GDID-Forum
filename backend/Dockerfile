FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install && npm install -g nodemon

COPY . .

RUN chmod -R 777 /app

EXPOSE 3000

CMD ["npm", "start"]