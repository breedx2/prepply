'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const readAllBlogs = require('./read_all_blogs');
const blogLinks = require('./blog_links');
const blogRenderMap = require('./blog_render_mapper');

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
  fs.ensureFileSync(outFile);
  fs.writeFileSync(outFile, rendered);
}

function buildOutFilename(options, index){
  if(index == 0){
    return `${options.outdir}/blog.html`;
  }
  return `${options.outdir}/blog/page/${index}.html`;
}

module.exports = {
  generate
};
