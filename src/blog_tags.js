'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const blogRenderMap = require('./blog_render_mapper');
const blogTagIndexer = require('./blog_tag_indexer');

function build(options, templates, sortedBlogs){
  const mappedTags = blogTagIndexer.index(sortedBlogs);
  mappedTags.forEach(pair => {
    const [tag, blogs] = pair;
    const outFile = `${options.outdir}/blog/tags/${tag}.html`;
    const renderBlogs = blogRenderMap(options, blogs);
    const fileData = templates.render('blog_page', { tag: tag, blogs: renderBlogs});
    console.log(`TAG ${tag} => ${outFile}`);
    fs.ensureFileSync(outFile);
    fs.writeFileSync(outFile, fileData);
  });
}

module.exports = {
  build
};
