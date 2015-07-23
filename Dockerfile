#weixin-Sign

FROM node:latest

RUN npm install

ADD ../config.json   ./

EXPOSE 8888

CMD ["node", "index.js"]
