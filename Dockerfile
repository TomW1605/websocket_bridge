FROM node:22.13
LABEL authors="Thomas"

COPY . /app
WORKDIR /app

RUN npm install

ENTRYPOINT ["node", "main.js"]