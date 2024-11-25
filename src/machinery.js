'use strict';

import _ from 'lodash';
import { glob } from 'glob';
import fs from 'fs-extra';
import frontMatter from 'front-matter';
import * as marked from 'marked';
import highlight from 'highlight.js';
import sasshole from './sasshole.js';
import layoutsLoader from './layouts.js';
import blog from './blog.js';
import blogLinks from './blog_links.js';
import writeFile from './write_file.js';
import readConfig from './read_config.js';
import dirListings from './dir_listings.js';
import scriptDirname from './script_dirname.js';

const __dirname = scriptDirname(import.meta);

marked.setOptions({
  highlight: function (code, lang, callback) {
    return highlight.highlightAuto(code).value;
  }
});

async function run(inputOptions){
  console.time('prepply machinery');
  emptyOutputDir(inputOptions);
  const options = _.assign({}, inputOptions, readConfig(inputOptions.config));
  const layoutsDir = `${__dirname}/../layouts`;
  const customLayoutsDir = _.get(options, 'layoutsdir');
  const templates = layoutsLoader.load([layoutsDir, customLayoutsDir]);
  console.log('templates have been loaded.');
  processInputSiteFiles(options, templates);
  if(!options.noblogs){
    const blogopts = Object.assign({}, options);
    if(blogopts.fullblogs){
        delete blogopts.files;
    }
    blog.build(blogopts, templates);
  }
  processStyles(options);
  processDirectoryListings(options, templates);
  console.timeEnd('prepply machinery');
}

function processInputSiteFiles(options, templates){
  const files = findInputFiles(options);
  console.log(`Found ${files.length} input files...`);
    files.forEach(f => processFile(options, templates, f));
}

function processStyles(options){
  console.log('Processing styles...');
  var scssFiles = glob.sync(`${__dirname}/../scss/custom.scss`, { nodir: true });
  if(options['extra-scss-dir']){
    console.log(`  picking up extra scss files in ${options['extra-scss-dir']}`);
    scssFiles = scssFiles.concat(glob.sync(`${options['extra-scss-dir']}/*.scss`, { nodir: true}))
  }
  console.log(scssFiles);
  return sasshole(scssFiles, options.outdir);
}

function processDirectoryListings(options, templates){
  console.log('Building directory listings...');
  return dirListings(options, templates);
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
  const htmlContent = marked.parse(fm.body);
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

export default {
  run
}
