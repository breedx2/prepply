'use strict';

const yaml = require('js-yaml');
const fs = require('fs-extra');

function readConfig(file){
  console.log(`Loading config from ${file}`);
  const configData = fs.readFileSync(file, 'utf-8');
  const result = yaml.safeLoad(configData);
  console.log('Config loaded');
  return result;
}

module.exports = readConfig;
