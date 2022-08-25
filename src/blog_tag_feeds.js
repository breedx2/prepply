'use strict';

import blogFeeds from './blog_feeds.js';
import blogTagIndexer from './blog_tag_indexer.js';

function build(options, templates, sortedBlogs){
  console.log('Building tag feeds...');
  const mappedTags = blogTagIndexer.index(sortedBlogs);
  mappedTags.forEach(pair => {
    const [tag, blogs] = pair;
    const rssFile = `${options.outdir}/blog/tags/${tag}/rss.xml`;
    const atomFile = `${options.outdir}/blog/tags/${tag}/atom.xml`;
    const buildOptions = Object.assign({}, options, { rssFile, atomFile, tag: tag });
    blogFeeds.build(buildOptions, templates, blogs);
  });
}

export default {
  build
};
