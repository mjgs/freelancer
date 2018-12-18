#!/usr/bin/env bash

# Exit on error
set -e; set -o pipefail

#
# Builds the public folder
#

if [ -n "$DEBUG" ]; then
  echo "$0: Setting bash option -x for debug"
  PS4='+($(basename ${BASH_SOURCE}):${LINENO}): ${FUNCNAME[0]:+${FUNCNAME[0]}(): }'
  set -x
fi

APPS_DIR=lib/apps
PUBLIC_DIR=public
DATA_DIR=data

#
# Main
#

# Clean public folder
rm -rf public/* data/*

# Create public common files
echo "Creating public common files..."
PUBLIC_COMMON_DIR=public/common
mkdir -p $PUBLIC_COMMON_DIR
rsync -raz --progress --delete --exclude=.DS_Store lib/server/public/ $PUBLIC_COMMON_DIR

# Create public apps files
echo
echo "Creating public apps files..."
for APP_NAME in $(ls $APPS_DIR | grep -v 'index.js'); do
  echo "  Creating app files: $APP_NAME"

  mkdir -p $PUBLIC_DIR/apps/$APP_NAME
  rsync -raz --delete --exclude=.DS_Store $APPS_DIR/$APP_NAME/static/ $PUBLIC_DIR/apps/$APP_NAME/static
  rsync -raz --delete --exclude=.DS_Store $APPS_DIR/$APP_NAME/public/ $PUBLIC_DIR/apps/$APP_NAME/custom
done

exit 0
