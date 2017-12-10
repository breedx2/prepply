'use strict';

const _ = require('lodash');
const minimist = require('minimist');
const path = require('path');
const child_process = require('child_process');
const chokidar = require('chokidar');
const machinery = require('./src/machinery');

// Development server - uses reload for http and runs prepply

function usage(){
  console.log(`
  usage:

  $ node dev-server.js <options>
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
  console.log('Running initial site prep...');
  await runMachinery(args);
  console.log('Starting "reload" http server in background.');
  const cmd = `$(npm bin)/reload -d ${args.outdir}`;
  const reloadServer = child_process.exec(cmd);
  reloadServer.stdout.pipe(process.stdout);
  process.on('exit', () => {
    console.log('Shutting down reload http server.')
    reloadServer.kill();
  });

  chokidar.watch(args.indir).on('change', path => {
    console.log(`Changed ${path}`);
    const machineryArgs = _.assign({}, args, { files: [path]});
    runMachinery(machineryArgs);
  });
  const layoutsDir = path.resolve(__dirname, 'layouts');
  chokidar.watch(layoutsDir).on('change', path => {
    console.log(`Change in templates, big rebuild...`);
    runMachinery(args);
  });
}

async function runMachinery(args){
  return await machinery.run(Object.assign({}, args, {noclean: true}));
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
  console.log('dev-server done.');
});
