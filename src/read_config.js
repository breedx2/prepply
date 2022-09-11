'use strict';

import yaml from 'js-yaml';
import fs from 'fs-extra';

export default function readConfig(file){
  console.log(`Loading config from ${file}`);
  const configData = fs.readFileSync(file, 'utf-8');
  const result = yaml.load(configData);
  console.log('Config loaded');
  return result;
}
