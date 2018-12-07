FROM node:8 as development

WORKDIR /usr/app

COPY package*.json ./
RUN npm install && npm cache clean --force

COPY src/ src/

RUN find . -not -path "./node_modules/*" -exec chmod o+r {} \;
RUN chmod a+x -R ./src

EXPOSE 8877

CMD ["npm", "start"]

FROM development as production

ENV NODE_ENV production

CMD [ "npm", "start" ]