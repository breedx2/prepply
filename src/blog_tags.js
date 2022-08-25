'use strict';

import blogRenderMap from  './blog_render_mapper.js';
import blogTagIndexer from './blog_tag_indexer.js';
import writeFile from './write_file.js';

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

export default {
  build
};
