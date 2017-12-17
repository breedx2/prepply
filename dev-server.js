'use strict';

const _ = require('lodash');
const minimist = require('minimist');
const path = require('path');
const reload = require('reload');
const express = require('express');
const http = require('http');
const chokidar = require('chokidar');
const fs = require('fs');
const watchers = require('./src/devserver/watchers');
const machinery = require('./src/devserver/machinery');
const reloadInjector = require('./src/devserver/reload-injector');

// Development server - uses reload for http and runs prepply
const PORT = 8080;

function usage(){
  console.log(`
  usage:

  $ node dev-server.js <options>
  where <options> are

  --indir <dir>   :: input site directory of .md etc.
  --outdir <dir>  :: output site directory of html
  --config <file> :: config yml file to use (default = <indir>/config.yml)
  --noclean       :: don't clean output dir (default = false, clean output dir)
  --nowatch       :: don't watch for changes
  `);
}

function argsValid(args){
  return _.every(['indir', 'outdir'], p => _.has(args, p));
}

function setDefaults(args){
  const defaults = {
    config: `${args.indir}/config.yml`,
    noclean: false,
    nowatch: false
  };
  return _.assign(defaults, args);
}

async function run(args){
  console.log('Running initial site prep...');
  await machinery(args);
  const reloadServer = startServer(args);
  if(args.nowatch){
    return console.log('--nowatch specified, skipping fs change watching.');
  }
  watchers.configure(args, reloadServer);
}

function startServer(args){
  console.log('Starting http server...');
  const app = express();

  app.use(function(req, res, next) {
    if (req.path.replace(/\/$/, '').match(/\/[-\w]+$/)) {
      const file = `${args.outdir}${req.path.replace(/\/$/, '')}.html`;
      return fs.exists(file, exists => {
        console.log(`${req.url} => ${req.url}.html`);
        if (exists) req.url += '.html';
        next();
      });
    }
    next();
  });

  app.use(reloadInjector);
  app.use(express.static(args.outdir));
  const server = http.createServer(app);
  const reloadServer = reload(app, { verbose: true});  //reload pages when stuff changes on disk
  server.listen(8080, () => {
    console.log(`Web server listening on port ${PORT}`);
  });
  return reloadServer;
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
