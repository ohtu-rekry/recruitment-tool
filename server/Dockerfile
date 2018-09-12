FROM node:8

WORKDIR /usr/app

COPY package*.json ./
RUN npm install && npm cache clean --force

COPY . . 
RUN find . -not -path "./node_modules/*" -exec chmod o+r {} \;

USER 1000
EXPOSE 8080

CMD ["npm", "start"]
