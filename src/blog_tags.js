'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const blogRenderMap = require('./blog_render_mapper');

function build(options, templates, sortedBlogs){
  const allTags = _.uniq(_.flatMap(sortedBlogs, 'attributes.tags'));
  const mappedTags = allTags.map(tag => {
    const blogs = sortedBlogs.filter(blog => _.get(blog, 'attributes.tags', []).includes(tag));
    return [tag, blogs];
  });
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
