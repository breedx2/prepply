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

  --indir <dir>   :: input site directory of .md etc.
  --outdir <dir>  :: output site directory of html
  --config <file> :: config yml file to use (default = <indir>/config.yml)
  --noclean       :: don't clean output dir (default = false, clean output dir)
  `);
}

function argsValid(args){
  return _.every(['indir', 'outdir'], p => _.has(args, p));
}

function setDefaults(args){
  const defaults = {
    config: `${args.indir}/config.yml`,
    noclean: false
  };
  return _.assign(defaults, args);
}

async function run(args){
  return await machinery.run(args);
}

const inputArgs = require('minimist')(process.argv.slice(2));
if(!argsValid(inputArgs)){
  usage();
  process.exit(1);
}

const args = setDefaults(inputArgs);
args.indir = path.resolve(args.indir);
args.outdir = path.resolve(args.outdir);
args.config = path.resolve(args.config);

console.log(args);
run(args).then(() => {
  console.log('All done.');
});
