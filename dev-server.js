'use strict';

import _ from 'lodash';
import minimist from 'minimist';
import path from 'path';
import reload from 'reload';
import express from 'express';
import http from 'http';
import chokidar from 'chokidar';
import fs from 'fs';
import watchers from './src/devserver/watchers.js';
import machinery from './src/machinery.js'
import reloadInjector from './src/devserver/reload-injector.js';
import readConfig from './src/read_config.js';

// Development server - uses reload for http and runs prepply
const PORT = 8080;

function usage(){
  console.log(`
  usage:

  $ node dev-server.js <options>
  where <options> are

  --indir <dir>   :: input site directory of .md etc.
  --outdir <dir>  :: output site directory of html
  --static <dir>  :: [optional] path to additional static assets
  --config <file> :: config yml file to use (default = <indir>/config.yml)
  --noclean       :: don't clean output dir (default = false, clean output dir)
  --nowatch       :: don't watch for changes
  `);
}

function argsValid(args, config){
  return _.every(['indir', 'outdir'], p => _.has(args, p) || _.has(config, p));
}

function setDefaults(args){
  const defaults = {
    config: `${args.indir}/config.yml`,
    noclean: false,
    nowatch: false
  };
  return _.assign(defaults, args);
}

async function run(args, config){
  console.log('Running initial site prep...');
  await machinery.run(args);
  const reloadServer = startServer(args);
  if(args.nowatch){
    return console.log('--nowatch specified, skipping fs change watching.');
  }
  watchers.configure(args, reloadServer, config.layoutsdir);
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
  if(args.static){
    app.use(express.static(args.static));
  }
  const server = http.createServer(app);
  const reloadServer = reload(app, { verbose: true});  //reload pages when stuff changes on disk
  server.listen(8080, () => {
    console.log(`Web server listening on port ${PORT}`);
  });
  return reloadServer;
}

const inputArgs = minimist(process.argv.slice(2));
const config = readConfig(path.resolve(inputArgs.config));
if(!argsValid(inputArgs, config)){
  usage();
  process.exit(1);
}

const args = setDefaults(inputArgs);
args.indir = path.resolve(args.indir || config.indir);
args.outdir = path.resolve(args.outdir || config.outdir);
args.config = path.resolve(args.config);

console.log(args);
run(args, config).then(() => {
  console.log('dev-server done.');
});
