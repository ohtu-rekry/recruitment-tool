# Build
FROM node:8-alpine AS build

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --production

COPY src/ src/
COPY public/ public/

RUN npm run build

# Production environment
FROM nginxinc/nginx-unprivileged:stable-alpine

COPY --from=build /usr/app/build /usr/share/nginx/html

USER 100