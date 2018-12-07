FROM node:8 as development

WORKDIR /usr/app

COPY package*.json ./
RUN npm install && npm cache clean --force

COPY src/ src/
COPY db/ db/
COPY utils/ utils/

RUN find . -not -path "./node_modules/*" -exec chmod o+r {} \;
RUN chmod a+x -R ./utils ./db ./src

USER 1000
EXPOSE 8080

CMD ["npm", "start"]

FROM development as production

ENV NODE_ENV production

CMD [ "npm", "run", "start:production" ]