FROM node:8

WORKDIR /usr/app

COPY package*.json ./
RUN npm install && npm cache clean --force

COPY . . 
RUN chmod o+r -R .

USER 1000
EXPOSE 8080

CMD ["npm", "start"]
