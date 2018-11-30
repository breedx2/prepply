'use strict';

const minimist = require('minimist');
const fs = require('fs-extra');
const _ = require('lodash');
const moment = require('moment');
const exec = require('child_process').exec;
const path = require('path');
const layouts = require('./src/layouts').load([`${__dirname}/layouts`]);

const argv = require('minimist')(process.argv.slice(2));

const SITE_DIR = `${__dirname}/../site`;
const ASSETS = `${__dirname}/../site-assets`;
const BLOG_IMAGES = `${ASSETS}/blog/images`;

const RESIZE_WIDTH = 1024;

if(_.isEmpty(argv._) || _.isEmpty(argv.r)){
  usage();
  process.exit(1);
}

function usage(){
  console.log();
  console.log('Usage: node blog-image.js <options> file1 file2 ...')
  console.log('');
  console.log('Where <options> are:');
  console.log("  -s 'My subject' ");
  console.log("  -t 'tag,tag,tag'");
  console.log("  -r 'user@host:/path/to/target'");
  console.log();
}

// TODO: Prompt for missing guys

run(argv).then(() => {
  console.log('All done');
});

async function run(args){
  if(!args.s){
    args.s = await readLine('Subject: ');
  }
  if(!args.t){
    args.t = await readLine('Tags (comma separated): ');
  }
  const now = moment();
  await resizeAndCopyImages(args._, now);
  console.log('Done resizing images');
  await publishImages(args._, args.r, now);
  const templ = makeTemplate(args._, argv.s, argv.t, now);
  console.log();
  console.log(`Customize your file: ${templ}`);
  console.log();
  console.log("...and don't forget to publish! (npm run build && npm run publish)");
  console.log();
}

async function resizeAndCopyImages(images, now){
  const result = [];
  for(const image of images){
    const copy = outFilename(image, now, false);
    console.log(`Copying ${image} to ${copy}`);
    fs.copySync(image, copy);
    result.push(await resizeImage(image, now));
  }
  return result;
}

async function resizeImage(image, now){
  console.log(`Resizing ${image}`);
  const outImage = outFilename(image, now, true);
  return new Promise((fulfill,reject) => {
    const cmd = `convert -resize '${RESIZE_WIDTH}x>' '${image}' '${outImage}'`;
    console.log(`Exec: ${cmd}`);
    exec(cmd, (err, stdout, stderr) => {
      if(err) {
        return reject(err);
      }
      fulfill(outImage);
    });
  });
}

async function publishImages(images, rsyncTarget, now){
  for(const image of images){
      await rsync(outFilename(image, now, true), rsyncTarget);
      await rsync(outFilename(image, now, false), rsyncTarget);
  }
}

async function rsync(file, target){
  return new Promise((fulfill,reject) => {
    const cmd = `rsync -avv --progress "${file}" "${target}/"`;
    console.log(cmd);
    exec(cmd, (err, stdout, stderr) => {
      if(err) {
        return reject(err);
      }
      fulfill();
    });
  });
}

function makeTemplate(images, subject, tags, now){
  const markdown = layouts.render('blog_md', {
    subject: subject,
    tags: tags.split(','),
    date: now.format(),
    images: images.map(image => {
      const scaled = path.basename(outFilename(image, now, true));
      const full = path.basename(outFilename(image, now, false));
      return {
        base: path.basename(scaled),
        scaled: `https://noisybox.net/blog/images/${scaled}`,
        full: `https://noisybox.net/blog/images/${full}`
      }
    })
  }, {});
  const outDir = outTemplateDir(now);
  const outFile = outTemplateFileName(subject, now);
  const fullOutFile = `${outDir}/${outFile}`;
  fs.ensureDirSync(outDir);
  fs.writeFileSync(fullOutFile, markdown);
  return fullOutFile;
}

function outTemplateDir(now){
  return `${__dirname}/../site/blog/${now.year()}`;
}

function outTemplateFileName(subject, now){
  const outDir = outTemplateDir(now);
  const snakeSubject = _.snakeCase(subject);
  return `${now.format('YYYY-MM-DD')}-${snakeSubject}.md`;
}

function outFilename(image, now, sized){
  const extension = path.extname(image);
  const base = path.basename(image, extension);
  const date = now.format('YYYYMMDD');
  const resizePart = sized ? `_${RESIZE_WIDTH}` : '';
  return `${BLOG_IMAGES}/${date}-${base}${resizePart}${extension}`;
}

async function readLine(prompt){
  const readline = require('readline');
  return new Promise((fulfill,reject) => {
    const reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    reader.question(prompt, answer => {
       reader.close();
       fulfill(answer);
    });
  });
}
