#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER keycloak WITH PASSWORD '$KEYCLOAK_DB_PASSWORD';
    CREATE DATABASE keycloak OWNER keycloak;
    GRANT CONNECT ON DATABASE keycloak TO keycloak;
EOSQL