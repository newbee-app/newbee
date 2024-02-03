#!/bin/bash

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

  # Prompt the user for an admin email and name
  read -p 'Email for the admin user: ' admin_email
  read -p '(Optional) Name for the admin user (leave blank to default to "NewBee Admin"): ' admin_name

  # Create the admin user
  npx ts-node admin/create-admin.ts create "$admin_email" --name="$admin_name"
)
