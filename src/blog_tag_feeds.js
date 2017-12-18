'use strict';

const blogFeeds = require('./blog_feeds');
const blogTagIndexer = require('./blog_tag_indexer');

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

module.exports = {
  build
};
