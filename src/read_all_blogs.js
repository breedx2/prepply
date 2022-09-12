'use strict';

import _ from 'lodash';
import glob from 'glob';
import fs from 'fs-extra';
import frontMatter from 'front-matter';

//NOTE: This loads all blog posts into memory, which may be too much if your blog
//is super duper gigantic.  We load them all to be able to look at the date in
//the front matter.  Another approach would be to just use the filenames, but in
//the event that two items were posted on the same day, we have to dip in.  It's doable,
//but more involved...loading into memory is simpler.

function read(options){
  const files = findBlogFiles(options);
  const parsed = readAndParse(files);
  return _.reverse(_.sortBy(parsed, 'attributes.date'));
}

function findBlogFiles(options){
  //TODO: Push this to config...?
  const blogsDir = `${options.indir}/blog`;
  if(options.files){
    return options.files.filter(f => f.startsWith(blogsDir));
  }
  return glob.sync(`${blogsDir}/**/*.md`, { nodir: true });
}

function readAndParse(files){
  return files.map(filename => {
    const fileData = fs.readFileSync(filename);
    return Object.assign({},
      { filename: filename },
      frontMatter(fileData.toString())
    );
  });
}

export default { 
  read
}
