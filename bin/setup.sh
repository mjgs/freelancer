#!/usr/bin/env bash

# Exit on error
set -e; set -o pipefail

#
# Sets up environment, data and custom static files
# This script is usually only run once during initial project setup
#

if [ -n "$DEBUG" ]; then
  echo "$0: Setting bash option -x for debug"
  PS4='+($(basename ${BASH_SOURCE}):${LINENO}): ${FUNCNAME[0]:+${FUNCNAME[0]}(): }'
  set -x
fi

DATA_DIR=lib/data
APPS_DIR=lib/apps

#
# Functions
#

function createDir() {
  DIR=$1

  echo "  creating directory: $DIR"

  mkdir -p $DIR
}

function createFile() {
  SRC=$1
  TGT=$2

  echo "  creating file: $TGT"

  cp $SRC $TGT
}

#
# Main
#

# Create environment files
echo "Creating env files..."
createFile .env.sample .env.dev
createFile .env.sample .env.prod

# Create custom files
echo
echo "Creating custom static and data files..."
createFile $APPS_DIR/homepage/static/index.html $APPS_DIR/homepage/public/index.html
createFile $APPS_DIR/services/data.js.sample $APPS_DIR/services/data.js

echo
echo "Follow the setup instructions in README.md to get the website running"

exit 0
