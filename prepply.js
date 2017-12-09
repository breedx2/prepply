'use strict';

const _ = require('lodash');
const minimist = require('minimist');

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
  return false;
}

function setDefaults(args){
  const defaults = {
    config: `${args.indir}/config.yml`,
    noclean: false
  };
  return _.assign(defaults, args);
}

const inputArgs = require('minimist')(process.argv.slice(2));
if(!argsValid(inputArgs)){
  usage();
  process.exit(1);
}

const args = setDefaults(inputArgs);
