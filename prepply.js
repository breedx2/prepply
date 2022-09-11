'use strict';

import _ from 'lodash';
import 'minimist';
import path from 'path';
import machinery from './src/machinery.js'
import readConfig from './src/read_config.js';
import minimist from 'minimist';

// Main app for prepply static generator

function usage(){
  console.log(`
  usage:

  $ node prepply.js <options>
  where <options> are

  --indir <dir>       :: input site directory of .md etc.
  --outdir <dir>      :: output site directory of html
  --config <file>     :: config yml file to use (default = <indir>/config.yml)
  --clean | --noclean :: clean output dir (default = true, clean output dir)
  `);
}

function argsValid(args, config){
  return _.every(['indir', 'outdir'], p => _.has(args, p) || _.has(config, p));
}

async function run(args){
  return await machinery.run(args);
}

const args = minimist(process.argv.slice(2), {
  string: ['indir', 'outdir', 'config'],
  boolean: ['clean'],
  default: {
    clean: true,
    config: `config.yml`
  }
});
const config = readConfig(path.resolve(args.config));

if(!argsValid(args, config)){
  usage();
  process.exit(1);
}

if(!_.isEmpty(args._)){
  args.files = args._.map(f => path.resolve(f));
}
args.clean = args.noclean === true ? false : args.clean;
args.indir = path.resolve(args.indir || config.indir);
args.outdir = path.resolve(args.outdir || config.outdir);
args.config = path.resolve(args.config);

console.log(args);

run(args).then(() => {
  console.log('All done.');
});
