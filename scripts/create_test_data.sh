#!/bin/bash

set -e

docker exec -it $(docker ps | grep server | awk '{ print $1 }') /bin/sh -c 'npm run db:migrate'
docker exec -it $(docker ps | grep server | awk '{ print $1 }') /bin/sh -c 'npm run db:seed'