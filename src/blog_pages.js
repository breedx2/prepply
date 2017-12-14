'use strict';

const _ = require('lodash');
const glob = require('glob');
const fs = require('fs-extra');
const marked = require('marked');
const frontMatter = require('front-matter');

const PAGE_SIZE = 10;

//NOTE: This loads all blog posts into memory, which may be too much if your blog
//is super duper gigantic.  We load them all to be able to look at the date in
//the front matter.  Another approach would be to just use the filenames, but in
//the event that two items were posted on the same day, we have to dip in.  It's doable,
//but more involved...loading into memory is simpler.
function generate(options, templates){
  const files = findBlogFiles(options);
  const parsed = readAndParse(files);
  const sorted = _.reverse(_.sortBy(parsed, 'attributes.date'));

  const pages = _.chunk(sorted, PAGE_SIZE);
  const renderOpts = Object.assign({}, options, { pageCt: pages.length});
  const render = _.curry(renderPage)(renderOpts, templates);
  _.forEach(pages, render);
}

function findBlogFiles(options){
  const blogsDir = `${options.indir}/blog`;
  if(options.files){
    return options.files.filter(f => f.startsWith(blogsDir));
  }
  return glob.sync(`${blogsDir}/**/*.md`, { nodir: true });
}

function readAndParse(files){
  return files.map(filename => {
    const fileData = fs.readFileSync(filename);
    return Object.assign({},
      { filename: filename },
      frontMatter(fileData.toString())
    );
  });
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
  return `${options.outdir}/blog/page/${index+1}.html`;
}

module.exports = {
  generate
};
