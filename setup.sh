#!/bin/bash

# Exit with an error if any of the commands exit with an error
set -e

# Make the script context constant
script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$script_dir"

# Only run the following if node_modules does not exist yet
if [[ ! -d node_modules ]]; then
  # Run NPM install in the background (presumes a compatible version of Node)
  echo 'Running npm install'
  npm i --silent &

  # Wait for NPM install to finish
  wait $!
  echo 'All dependencies successfully installed'
fi

# Only run the following if env file does not exist yet
if [[ ! -e .env ]]; then
  # Generate a bunch of passwords and secrets
  echo 'Generating passwords'
  tmp_file=$(mktemp)
  helper_script='tools/scripts/sh-helper.ts'
  npx ts-node "$helper_script" gen-passwords 5 >"$tmp_file"
  passwords=()
  while IFS= read -r line; do
    passwords+=("$line")
  done <"$tmp_file"

  # Generate the special Solr-formatted password
  solr_pw_script='tools/solr/auth/basic-auth-pw.ts'
  solr_pw="$(npx ts-node "$helper_script" gen-password)"
  solr_format_pw="$(npx ts-node "$solr_pw_script" generate "$solr_pw")"
  echo 'All passwords successfully generated'

  # Create the env file
  echo 'Generating env file'
  env_file=$(
    cat <<END
# TODO: Variables you MUST change
SMTP_HOST='CHANGE_ME'
SMTP_USERNAME='CHANGE_ME'
SMTP_PASSWORD='CHANGE_ME'
SMTP_DEFAULT_FROM='CHANGE_ME'

# TODO: Variables you MIGHT need to change
FRONTEND_URL='http://localhost:4200'
FRONTEND_DOMAIN='localhost'

APP_NAME='NewBee'

POSTGRES_HOST='127.0.0.1'
POSTGRES_PORT='5432'
POSTGRES_DB='newbee'
POSTGRES_USER='newbee'
POSTGRES_PASSWORD='${passwords[0]}'

JWT_SECRET='${passwords[1]}'

COOKIE_SECRET='${passwords[2]}'

ZK_HOST='zk:2181'
ZK_ADMIN_PASSWORD='${passwords[3]}'
ZK_READONLY_PASSWORD='${passwords[4]}'

SOLR_URL='http://localhost:8983'
SOLR_USERNAME='newbee'
SOLR_PASSWORD='$solr_pw'
SOLR_FORMAT_PASSWORD='$solr_format_pw'
END
  )
  echo "$env_file" >.env
  echo 'Env file successfully generated'
fi

# Start the dependency docker-compose in the background
echo 'Starting Docker containers'
dc_file='docker-compose.dep.yaml'
docker-compose -f "$dc_file" up --build -d

# Wait for the services to come up
while [[ $(docker-compose -f "$dc_file" ps -q | wc -l) -ne $(docker-compose -f "$dc_file" ps | grep -c ' Up ') ]]; do
  sleep 1
done
echo 'All Docker containers up and running'

# Run Postgres migrations
echo 'Running MikroORM Postgres migrations'
(. ./tools/mikro-orm/run-migration.sh)
echo 'Migrations successfully ran'

# Create admin controls
echo 'Creating admin controls'
(. ./tools/mikro-orm/create-admin-controls.sh)
echo 'Admin controls successfully created'

# Finish Solr setup
echo 'Finishing Solr setup'
(. ./tools/solr/finish-solr-setup.sh)
echo 'Solr setup successfully completed'
