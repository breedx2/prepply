'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const marked = require('marked');
const readAllBlogs = require('./read_all_blogs');

const PAGE_SIZE = 10;

function generate(options, templates, sortedBlogs){
  const pages = _.chunk(sortedBlogs, PAGE_SIZE);
  const renderOpts = Object.assign({}, options, { pageCt: pages.length});
  const render = _.curry(renderPage)(renderOpts, templates);
  _.forEach(pages, render);
}

function renderPage(options, templates, page, index){
  console.log(`Rendering blog page ${index}...`);

  const blogs = _.map(page, item => {
    const html = marked(item.body);
    const filename = item.filename.replace(options.indir, '').replace(/\.md$/, '');
    const dateMunged = filename.replace(/(\d\d\d\d)-(\d\d)-(\d\d)-/, '$2/');
    return Object.assign({}, item.attributes, {
      content: html,
      selfUrl: dateMunged
    });
  });
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
