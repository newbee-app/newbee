#!/bin/sh

# Exit with an error if any of the commands exit with an error
set -e

# Make the script context constant
script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$script_dir"

# Run NPM install in the background (presumes a compatible version of Node)
echo 'Running npm install'
npm i --silent &

# Wait for NPM install to finish
wait $!
echo 'All dependencies successfully installed'

# Generate a bunch of passwords and secrets
echo 'Generating passwords'
tmp_file=$(mktemp)
helper_script='tools/scripts/sh-helper.ts'
npx ts-node "$helper_script" gen-passwords 5 > "$tmp_file"
passwords=()
while IFS= read -r line; do
  passwords+=("$line")
done < "$tmp_file"

# Generate the special Solr-formatted password
solr_pw_script='tools/solr/auth/basic-auth-pw.ts'
solr_pw="$(npx ts-node "$helper_script" gen-password)"
solr_format_pw="$(npx ts-node "$solr_pw_script" generate "$solr_pw")"
echo 'All passwords successfully generated'

# Create the env file
echo 'Generating env file'
env_file=$(cat << END
# TODO: Variables you MUST change
SMTP_HOST='CHANGE_ME'
SMTP_USERNAME='CHANGE_ME'
SMTP_PASSWORD='CHANGE_ME'
SMTP_DEFAULT_FROM='CHANGE_ME'

APP_NAME='NewBee'

POSTGRES_HOST='localhost'
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

MAGIC_LINK_LOGIN_VERIFY_LINK='http://localhost:4200/auth/login/magic-link-login'

ORG_MEMBER_INVITE_ACCEPT_LINK='http://localhost:4200/invite/accept'
ORG_MEMBER_INVITE_DECLINE_LINK='http://localhost:4200/invite/reject'
END
)
echo "$env_file" > .env
echo 'Env file successfully generated'

# Start the dependency docker-compose in the background
echo 'Starting Docker containers'
docker-compose -f docker-compose.dep.yaml up --build -d

# Wait for the services to come up
while [[ $(docker-compose ps -q | wc -l) != $(docker-compose ps | grep -c ' UP ') ]]; do
  sleep 1s
done
echo 'All Docker containers up and running'

# Run Postgres migrations
echo 'Running MikroORM Postgres migrations'
. ./tools/mikro-orm/run-migration.sh
echo 'Migrations successfully ran'

# Finish Solr setup
echo 'Finishing Solr setup'
. ./tools/solr/finish-solr-setup.sh
echo 'Solr setup successfully completed'
