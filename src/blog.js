'use strict';

const blogPages = require('./blog_pages');
const blogFeeds = require('./blog_feeds');
const blogTags = require('./blog_tags');
const blogTagFeeds = require('./blog_tag_feeds');
const readAllBlogs = require('./read_all_blogs');

function build(options, templates){
  console.log("Let's make a blog now...");
  const sorted = readAllBlogs(options); //warning -- reads all into memory, see comment in lib
  blogPages.generate(options, templates, sorted);
  blogFeeds.build(options, templates, sorted);
  blogTags.build(options, templates, sorted);
  blogTagFeeds.build(options, templates, sorted);
}

module.exports = {
  build
};
