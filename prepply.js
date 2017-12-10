'use strict';

const _ = require('lodash');
const minimist = require('minimist');
const path = require('path');
const machinery = require('./src/machinery');

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

function argsValid(args){
  return _.every(['indir', 'outdir'], p => _.has(args, p));
}

async function run(args){
  return await machinery.run(args);
}

const args = require('minimist')(process.argv.slice(2), {
  string: ['indir', 'outdir', 'config'],
  boolean: ['clean'],
  default: {
    clean: true,
    config: `config.yml`
  }
});
if(!argsValid(args)){
  usage();
  process.exit(1);
}

if(!_.isEmpty(args._)){
  args.files = args._.map(f => path.resolve(f));
}
args.clean = args.noclean === true ? false : args.clean;
args.indir = path.resolve(args.indir);
args.outdir = path.resolve(args.outdir);
args.config = path.resolve(args.config);

console.log(args);

run(args).then(() => {
  console.log('All done.');
});
