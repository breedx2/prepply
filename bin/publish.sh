#!/bin/bash
#
# Really stupid publish script.
# Currently only does rsync over ssh to a remote host dir
#

set -e

function usage() {
	echo
	echo "Usage: $0 [-e <envscript>]"
	echo
	echo "(envscript defaults to env.sh in this bin dir)"
	echo
}

MYDIR=`dirname "$0"`
ENVSCRIPT="${MYDIR}/env.sh"

while getopts ":h:e:" opt; do
  case ${opt} in
    e ) ENVSCRIPT="${OPTARG}"
      ;;
    \? ) usage
		 exit 1
      ;;
  esac
done

echo "Sourcing environment from => ${ENVSCRIPT}"
source "${ENVSCRIPT}"

echo Starting rsync
rsync -avv --progress --checksum "${BUILD_OUTPUT_DIR%/}/" "${RSYNC_HOST}:${RSYNC_CONTENT_DIR%/}/"
echo Publish complete
