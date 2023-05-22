#!/bin/sh

# Exit with an error if any of the commands exit with an error
set -e

# Make the script context constant
script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$script_dir"

(
  # Load in env vars from the env file
  set -a
  . ../../.env
  set +a

  # Get Solr to copy security.json file to zookeeper
  docker exec newbee-solr solr zk cp /opt/solr/server/solr/security.json zk:security.json

  # Create the NewBee configset in Solr
  cd ./configset
  npx ts-node configset.ts create -b "${SOLR_USERNAME}:${SOLR_PASSWORD}"
  cd ..
)
