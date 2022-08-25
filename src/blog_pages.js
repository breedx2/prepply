'use strict';

import _ from 'lodash';
import * as fs from 'fs-extra';
import * as readAllBlogs from './read_all_blogs.js';
import * as blogLinks from './blog_links.js';
import * as blogRenderMap from './blog_render_mapper.js';
import * as writeFile from './write_file.js';

const PAGE_SIZE = 10; //TODO: Push to config...

function generate(options, templates, sortedBlogs){
  const pages = _.chunk(sortedBlogs, PAGE_SIZE);
  const renderOpts = Object.assign({}, options, { pageCt: pages.length});
  const render = _.curry(renderPage)(renderOpts, templates);
  _.forEach(pages, render);
}

function renderPage(options, templates, page, index){
  console.log(`Rendering blog page ${index}...`);

  const blogs = blogRenderMap(options, page);
  const renderOpts = {
    blogs: blogs,
    pageNum: index,
    pageCt: options.pageCt
  };

  const rendered = templates.render('blog_page', renderOpts);
  const outFile = buildOutFilename(options, index);
  console.log(outFile);
  writeFile(outFile, rendered, blogs[0].date);
}

function buildOutFilename(options, index){
  if(index == 0){
    return `${options.outdir}/blog.html`;
  }
  return `${options.outdir}/blog/page/${index}.html`;
}

export default {
  generate
};
