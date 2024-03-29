'use strict'

import _ from 'lodash';

function permalink(options, blog){
  const filename = blog.filename.replace(options.indir, '').replace(/\.md$/, '');
  const dateMunged = filename.replace(/(\d\d\d\d)-(\d\d)-(\d\d)-/, '$2/');
  return `${_.get(options, 'site-url')}${dateMunged}`;
}

export default {
  permalink
}