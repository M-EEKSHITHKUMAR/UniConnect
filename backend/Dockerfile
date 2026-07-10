FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production
COPY . . 
RUN mkdir -p uploads/semester

EXPOSE 5000

CMD ["node", "server.js"]