#!/bin/bash

set -e

MYDIR=`dirname "$0"`
source "${MYDIR}/env.sh"

node blog-image.js -r "${RSYNC_HOST}:${RSYNC_ASSETS_DIR%/}/blog/images" "$@"
