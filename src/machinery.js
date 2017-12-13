'use strict';

const _ = require('lodash');
const glob = require('glob');
const fs = require('fs-extra');
const frontMatter = require('front-matter');
const path = require('path');
const marked = require('marked');
const sasshole = require('./sasshole');
const layoutsLoader = require('./layouts');

async function run(options){
  console.time('process');
  emptyOutputDir(options);
  processInputSiteFiles(options);
  processStyles(options);
  console.timeEnd('process');
}

function processInputSiteFiles(options){
  const files = findInputFiles(options);
  console.log(`Found ${files.length} input files...`);
  const templates = layoutsLoader.load(`${__dirname}/../layouts`);
  console.log('post templates load');
  files.forEach(f => processFile(options, templates, f));
}

function processStyles(options){
  console.log('Processing styles...');
  const scssFiles = glob.sync(`${__dirname}/../scss/*.scss`, { nodir: true });
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
    console.log(`Processing markdown ${filename}...`);
    const fileData = fs.readFileSync(filename);
    const fm = frontMatter(fileData.toString());
    const layoutName = fm.attributes.layout || 'page';
    const htmlContent = marked(fm.body);
    const outFile = buildOutfilename(options, fm, filename);
    const renderOpts = _.assign({}, fm.attributes, { selfUrl: outFile.slice(options.outdir.length).replace(/\.html$/, '') });
    const rendered = templates.render(layoutName, renderOpts, htmlContent);
    fs.ensureFileSync(outFile);
    fs.writeFileSync(outFile, rendered);
    console.log(`Output to ${outFile}`);
    return;
  }
  //TODO: Handle other kinds of files....copy over as-is
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
