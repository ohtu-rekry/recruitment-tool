#!/bin/bash

docker-compose down
docker-compose build
docker-compose up -d

docker exec -it $(docker ps | grep server | awk '{ print $1 }') /bin/sh -c 'npm run db:migrate'
docker exec -it $(docker ps | grep server | awk '{ print $1 }') /bin/sh -c 'npm run db:seed'

docker-compose logs -f