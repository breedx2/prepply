'use strict';

const _ = require('lodash');
const glob = require('glob');
const fs = require('fs-extra');
const frontMatter = require('front-matter');
const path = require('path');
const marked = require('marked');
const yaml = require('js-yaml');
const sasshole = require('./sasshole');
const layoutsLoader = require('./layouts');
const blog = require('./blog');
const blogLinks = require('./blog_links');
const writeFile = require('./write_file');

marked.setOptions({
  highlight: function (code, lang, callback) {
    return require('highlight.js').highlightAuto(code).value;
  }
});

async function run(inputOptions){
  console.time('prepply machinery');
  emptyOutputDir(inputOptions);
  const options = _.assign({}, inputOptions, readConfig(inputOptions.config));
  const templates = layoutsLoader.load(`${__dirname}/../layouts`);
  console.log('templates have been loaded.');
  processInputSiteFiles(options, templates);
  if(!options.noblogs){
    blog.build(options, templates);
  }
  processStyles(options);
  console.timeEnd('prepply machinery');
}

function readConfig(file){
  console.log(`Loading config from ${file}`);
  const configData = fs.readFileSync(file, 'utf-8');
  const result = yaml.safeLoad(configData);
  console.log('Config loaded');
  return result;
}

function processInputSiteFiles(options, templates){
  const files = findInputFiles(options);
  console.log(`Found ${files.length} input files...`);
    files.forEach(f => processFile(options, templates, f));
}

function processStyles(options){
  console.log('Processing styles...');
  const scssFiles = glob.sync(`${__dirname}/../scss/custom.scss`, { nodir: true });
  return sasshole(scssFiles, options.outdir);
}

function emptyOutputDir(options){
  if(options.noclean){
    console.log('Skipping output directory clean step...');
    return;
  }
  console.log('Cleaning output directory...');
  fs.emptyDirSync(options.outdir);
}

function findInputFiles(options){
  if(options.files){
    return options.files;
  }
  //TODO: Figure out if we can cache and not re-process shit
  return glob.sync(`${options.indir}/**`, { nodir: true });
}

function processFile(options, templates, filename){
  if(filename.endsWith('.md')){
    return processMarkdownFile(options, templates, filename);
  }

  const inFileBare = filename.replace(options.indir, '');
  if(options.ignore.includes(inFileBare)){
    return console.log(`Skipping ignored ${inFileBare}`);
  }
  const outFile = filename.replace(options.indir, options.outdir);
  fs.ensureFileSync(outFile);
  fs.copySync(filename, outFile);
  console.log(`Direct copy to ${outFile}`);
}

function processMarkdownFile(options, templates, filename){
  console.log(`Processing markdown ${filename}...`);
  const fileData = fs.readFileSync(filename);
  const fm = frontMatter(fileData.toString());
  const layoutName = fm.attributes.layout || 'page';
  const htmlContent = marked(fm.body);
  const outFile = buildOutfilename(options, fm, filename);
  const selfUrl = fm.attributes.layout == 'post' ?
    blogLinks.permalink(options, { filename: filename}) :
    outFile.slice(options.outdir.length).replace(/\.html$/, '');
  const renderOpts = _.assign({}, fm.attributes, {
    selfUrl: selfUrl ,
  });
  const rendered = templates.render(layoutName, renderOpts, htmlContent);
  writeFile(outFile, rendered, fm.attributes.date);
  console.log(`Output to ${outFile}`);
}

function buildOutfilename(options, fm, filename){
  const fp = filename.replace(options.indir, '').replace(/\.md$/, '');
  const permalink = _.get(fm, 'attributes.permalink');
  if(permalink){
    return `${options.outdir}${permalink}.html`;
  }
  if(fm.attributes.layout === 'post'){
    const dateMunged = fp.replace(/(\d\d\d\d)-(\d\d)-(\d\d)-/, '$2/');
    return `${options.outdir}${dateMunged}.html`;
  }
  return `${options.outdir}${fp}.html`;
}

module.exports = {
  run
}
