#weixin-Sign



FROM node:latest

WORKDIR ./

RUN npm install

ADD ../config.json   ./

EXPOSE 8888

CMD ["node", "index.js"]
