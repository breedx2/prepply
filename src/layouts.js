'use strict';

const _ = require('lodash');
const glob = require('glob');
const ejs = require('ejs');
const fs = require('fs');

function load(layoutDirs){

  const templates = layoutDirs.filter(x => x !== null)
    .map(layoutsDir => {
      console.log(`Loading all layouts from ${layoutsDir}`);
      const templateFiles = glob.sync(`${layoutsDir}/*.ejs`, { nodir: true });
      const layoutNames = templateFiles.map(t => t.replace(/^.*\//, '').replace('.ejs', ''));
      const compiled = templateFiles.map(t => ejs.compile(fs.readFileSync(t).toString(), {
        root: layoutsDir,
        filename: t
      }));
      return _.zipObject(layoutNames, compiled);
  })
  .reduce((acc, value) => {
    return _.merge(acc, value);
  }, {});

  return {
    render: (layoutName, frontMatter, content) => {
      const template = templates[layoutName];
      if(!template){
        console.log(`Warning: Unknown layout: ${layoutName}`);
        return `<html><body>unknown template ${layoutName} for ${frontMatter.permalink}</body></html>`;
      }
      return template(Object.assign({}, frontMatter, { content: content }));
    }
  };
}

module.exports = {
  load
};
