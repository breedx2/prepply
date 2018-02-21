#!/bin/bash
#
# Really stupid publish script.
# Currently only does rsync over ssh to a remote host dir
#

set -e

MYDIR=`dirname "$0"`
source "${MYDIR}/env.sh"

echo Starting rsync
rsync -avv --progress --checksum "${BUILD_OUTPUT_DIR%/}/" "${RSYNC_HOST}:${RSYNC_CONTENT_DIR%/}/"
echo Publish complete
