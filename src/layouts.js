'use strict';

const _ = require('lodash');
const glob = require('glob');
const ejs = require('ejs');
const fs = require('fs');

function load(layoutsDir){
  console.log(`Loading all layouts from ${layoutsDir}`);
  const templateFiles = glob.sync(`${layoutsDir}/*.ejs`, { nodir: true });
  const layoutNames = templateFiles.map(t => t.replace(/^.*\//, '').replace('.ejs', ''));
  const compiled = templateFiles.map(t => ejs.compile(fs.readFileSync(t).toString()))
  const templates = _.zipObject(layoutNames, compiled);
  return {
    render: (layoutName, frontMatter, content) => {
      const template = templates[layoutName];
      if(!template){
        console.warn(`Unknown layout: ${layoutName}`);
        return `<html><body>unknown template ${layoutName} for ${frontMatter.permalink}</body></html>`;
      }
      return template(Object.assign({}, frontMatter, { content: content }));
    }
  };
}

module.exports = {
  load
}
