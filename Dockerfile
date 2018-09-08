# Setup and build the client

FROM node:8 as client

WORKDIR /usr/src/client
COPY client/package*.json ./
RUN npm install && npm cache clean --force

COPY client/ ./
RUN npm run build

# Setup the server

FROM node:8

WORKDIR /usr/src/
COPY --from=client /usr/app/client/build/ ./client/build

WORKDIR /usr/src/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./

ENV PORT 8000

EXPOSE 8000

CMD ["npm", "start"]
