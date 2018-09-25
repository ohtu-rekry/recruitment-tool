# Development environment
FROM node:8-alpine AS development

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY src/ src/
COPY public/ public/

RUN find -not -path "./node_modules/*" -exec chmod o+r {} \;
RUN chmod a+rx -R src/ public/

USER 1000
EXPOSE 3000

CMD ["npm", "start"]

# Build
FROM node:8-alpine AS build

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --production

COPY src/ src/
COPY public/ public/

RUN npm run build

# Production environment
FROM nginxinc/nginx-unprivileged:stable-alpine AS production

COPY --from=build /usr/app/build /usr/share/nginx/html

USER 100