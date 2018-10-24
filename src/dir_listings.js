'use strict';

const fs = require('fs-extra');
const filesize = require('filesize');

function dirListings(options, templates){
  const dirs = options['dir-listings'] || [];
  dirs.forEach(dir => buildDir(options, dir, templates));
}

function buildDir(options, dir, templates){
  const fullDir = `${options['dir-listings-root']}${dir}`;
  if(!fs.existsSync(fullDir)){
    return console.log(`WARNING: DIR LISTING SOURCE NOT FOUND: ${fullDir}`);
  }
  const contents = fs.readdirSync(fullDir);
  const statContents = contents.map(item => {
    const stat = fs.statSync(`${fullDir}/${item}`);
    return {
      filename: item,
      path: `${dir}/${item}`,
      size: filesize(stat.size, { spacer: '', round: 1}),
      modified: new Date(stat.mtime).toISOString().slice(0,19).replace(/T/, ' ')
    }
  });
  const rendered = templates.render('dirlist', {
    path: dir,
    parent: dir.replace(/^(.*)\/.*/, '$1'),
    files: statContents
  }, {});
  const outfile = `${options.outdir}${dir}.html`;
  fs.ensureFileSync(outfile);
  fs.writeFileSync(outfile, rendered);
  console.log(`Wrote ${outfile}`);
}

module.exports = dirListings;
