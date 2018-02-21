
# Environment-specific file for rsync publishing

# Copy this file to env.sh and customize it

# The place where the final built site exists locally
BUILD_OUTPUT_DIR=/home/someuser/code/mysite/out

# The remote target location for rsync.  All generated content will placed _inside_ this.
RSYNC_HOST=someuser@some.host.net
RSYNC_CONTENT_DIR=/home/www/yourwebsite/public
RSYNC_ASSETS_DIR=/home/www/yourwebsite/assets
