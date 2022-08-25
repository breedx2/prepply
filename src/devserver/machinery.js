'use strict';

import '../machinery.js';

async function runMachinery(args){

  const fullblogs = filesContainsBlogs(args);
  if(fullblogs){
    console.log('Some blog has changed, we will regenerate it all.')
  }
  else {
    console.log('No blogs have changed, so skipping blog generation.')
  }
  const overrides = {
    noclean: true,
    noblogs: !fullblogs,
    fullblogs: fullblogs
  };
  return await machinery.run(Object.assign({}, args, overrides));
}

// checks to see if the files in the args contain the blog indir prefix.
function filesContainsBlogs(options){
  // No files means we are probably starting out and just do a full build anyway
  if(!options.files) return true;

  //TODO: Push this dir to config...?
  const blogsDir = `${options.indir}/blog`;
  const files = options.files;
  return files.some( file => file.startsWith(blogsDir));
}

export default runMachinery;
