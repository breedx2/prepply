
# Environment-specific file for rsync publishing

# The place where the final built site exists locally
BUILD_OUTPUT_DIR=/home/someuser/code/mysite/out

# The remote target location for rsync.  All content will placed _inside_ this.
RSYNC_TARGET=someuser@some.host.net:/home/www/yourwebsite/public
