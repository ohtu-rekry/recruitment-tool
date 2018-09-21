#!/bin/bash

set -e

sudo sed -i -e '/local.*peer/s/postgres/all/' -e 's/peer\|md5/trust/g' /etc/postgresql/*/main/pg_hba.conf
sudo service postgresql restart
sleep 1

psql -c "CREATE DATABASE ${DB_NAME};" -U postgres
psql -c "CREATE USER ${DB_USERNAME} WITH PASSWORD '${DB_PASSWORD}';" -U postgres

npm run pretest