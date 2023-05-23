#!/bin/bash

# Exit with an error if any of the commands exit with an error
set -e

# Make the script context constant
script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$script_dir"

# Set up the zookeeper credentials file
zk_creds=$(cat << END
zkDigestUsername=admin-user
zkDigestPassword=$ZK_ADMIN_PASSWORD
zkDigestReadonlyUsername=readonly-user
zkDigestReadonlyPassword=$ZK_READONLY_PASSWORD
END
)
zk_creds_path=/opt/solr/server/etc/zookeepercredentials.properties
echo "$zk_creds" > "$zk_creds_path"

# Set up the security.json file on Zookeeper
security_json=$(cat << END
{
  "authentication": {
    "class": "solr.BasicAuthPlugin",
    "blockUnknown": true,
    "forwardCredentials": false,
    "realm": "NewBee Solr",
    "credentials": {
      "$SOLR_USERNAME": "$SOLR_FORMAT_PASSWORD"
    }
  },
  "authorization": {
    "class": "solr.RuleBasedAuthorizationPlugin",
    "permissions": [
      {
        "name": "security-edit",
        "role": "admin"
      }
    ],
    "user-role": {
      "$SOLR_USERNAME": "admin"
    }
  }
}
END
)
security_json_path=/opt/solr/server/solr/security.json
echo "$security_json" > "$security_json_path"
