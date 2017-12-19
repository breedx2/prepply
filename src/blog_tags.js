'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const blogRenderMap = require('./blog_render_mapper');
const blogTagIndexer = require('./blog_tag_indexer');
const writeFile = require('./write_file');

function build(options, templates, sortedBlogs){
  const mappedTags = blogTagIndexer.index(sortedBlogs);
  mappedTags.forEach(pair => {
    const [tag, blogs] = pair;
    const outFile = `${options.outdir}/blog/tags/${tag}.html`;
    const renderBlogs = blogRenderMap(options, blogs);
    const fileData = templates.render('blog_page', { tag: tag, blogs: renderBlogs});
    console.log(`TAG ${tag} => ${outFile}`);
    writeFile(outFile, fileData, blogs[0].attributes.date);
  });
}

module.exports = {
  build
};
