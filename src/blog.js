'use strict';

const blogPages = require('./blog_pages');
const blogFeeds = require('./blog_feeds');
const readAllBlogs = require('./read_all_blogs');

function build(options, templates){
  console.log("Let's make a blog now...");
  const sorted = readAllBlogs(options); //warning -- reads all into memory, see comment in lib
  blogPages.generate(options, templates, sorted);
  buildBlogFeeds(options, sorted);
}

function buildBlogFeeds(options, sorted){
  console.log('Building feeds...');
  blogFeeds.build(options, sorted);
}

module.exports = {
  build
};
