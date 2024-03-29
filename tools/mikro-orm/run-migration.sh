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

  # Create and run the migrations
  npx mikro-orm migration:create
  npx mikro-orm migration:up
)
