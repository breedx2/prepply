'use strict';

const _ = require('lodash');
const chokidar = require('chokidar');
const path = require('path');
const machinery = require('./machinery');
const sasshole = require('../sasshole');

function configure(args, reloadServer) {

  const reload = reloadClients(reloadServer);

  chokidar.watch(args.indir).on('change', path => {
    console.log(`Changed ${path}`);
    const machineryArgs = _.assign({}, args, {
      files: [path]
    });
    machinery(machineryArgs).then(reload);
  });

  //TODO: Don't hard-code a layout dir here (for others to make themes)
  const layoutsDir = path.resolve(__dirname, '../../layouts');
  chokidar.watch(layoutsDir).on('change', path => {
    console.log(`Change in templates, big rebuild...`);
    machinery(args).then(reload);
  });

  //TODO: Don't hard-code scss dir here (for others to make themes)
  const scss = path.resolve(__dirname, '../../scss/**');
  chokidar.watch(scss).on('change', changed => {
    console.log(`scss change ${changed}`);
    //TODO: Don't rely on just this as the theme root...
    const custom = path.resolve(__dirname, '../../scss/custom.scss');
    sasshole([custom], args.outdir);
    reload();
  });
}

function reloadClients(reloadServer){
  return () => {
    console.log('reloading server');
    reloadServer.reload();
  };
}

module.exports = {
  configure
};
