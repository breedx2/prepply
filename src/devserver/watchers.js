'use strict';

import _ from 'lodash';
import chokidar from 'chokidar';
import path from 'path';
import machinery from './machinery.js';
import sasshole from '../sasshole.js';
import scriptDirname from './script_dirname.js';

const __dirname = scriptDirname(import.meta);

function configure(args, reloadServer, userLayoutsDir = null) {

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
  const layouts = [layoutsDir, userLayoutsDir].filter(d => d);
  chokidar.watch(layouts).on('change', path => {
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

export default { 
  configure
}