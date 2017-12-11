'use strict';

const sass = require('node-sass');
const fs = require('fs-extra');
const path = require('path');

function renderFiles(files, outdir){
  const cssDir = `${outdir}/css`;
  fs.mkdirsSync(cssDir);
  files.forEach(file => {
    const scssContent = fs.readFileSync(file).toString();
    const outFilename = `${cssDir}/${path.basename(file).replace(/scss$/, 'css')}`;
    console.log(`Compiling sass ${file} to ${outFilename}`);
    const outputData = sass.renderSync({
      data: scssContent
    });
    fs.writeFileSync(outFilename, outputData.css.toString());
  });
}

module.exports = renderFiles;
