FROM node:8

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .
RUN chmod o+r -R .
RUN chmod a+x src/ public/

USER 1000
EXPOSE 3000

CMD ["npm", "start"]
