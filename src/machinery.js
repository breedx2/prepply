'use strict';

const _ = require('lodash');
const glob = require('glob');
const fs = require('fs-extra');
const frontMatter = require('front-matter');
const path = require('path');
const marked = require('marked');
const layoutsLoader = require('./layouts');
const templates = layoutsLoader.load(`${__dirname}/../layouts`);

async function run(options){
  console.time('process');
  emptyOutput(options);
  const files = findInputFiles(options);
  console.log(`Found ${files.length} input files...`);
  files.forEach(f => processFile(options, f));
  console.timeEnd('process');
}

function emptyOutput(options){
  if(options.noclean){
    console.log('Skipping output directory clean step...');
  }
  console.log('Cleaning output directory...');
  fs.emptyDirSync(options.outdir);
}

function findInputFiles(options){
  //TODO: Figure out if we can cache and not re-process shit
  return glob.sync(`${options.indir}/**`, { nodir: true });
}

function processFile(options, filename){
  if(filename.endsWith('.md')){
    console.log(`Processing markdown ${filename}...`);
    const fileData = fs.readFileSync(filename);
    const fm = frontMatter(fileData.toString());
    // console.log(fm);
    const layoutName = fm.attributes.layout || 'page';
    const htmlContent = marked(fm.body);
    const rendered = templates.render(layoutName, fm.attributes, htmlContent);
    const outFile = buildOutfilename(options, fm, filename);
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
  return `${options.outdir}${fp}.html`;
}

module.exports = {
  run
}
