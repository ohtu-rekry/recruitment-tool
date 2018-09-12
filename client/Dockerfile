FROM node:8-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .
RUN find -not -path "./node_modules/*" -exec chmod o+r {} \;
RUN chmod a+rx -R src/ public/

USER 1000
EXPOSE 3000

CMD ["npm", "start"]
