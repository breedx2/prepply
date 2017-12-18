'use strict';

const machinery = require('../machinery');

async function runMachinery(args){
  return await machinery.run(Object.assign({}, args, {noclean: true, noblogs: true}));
}

module.exports = runMachinery;
