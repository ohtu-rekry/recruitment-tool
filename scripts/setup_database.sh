#!/bin/bash

set -e

psql -c "CREATE DATABASE ${DB_NAME};" -U postgres
psql -c "CREATE USER ${DB_USERNAME} WITH PASSWORD '${DB_PASSWORD}';" -U postgres

npm run pretest