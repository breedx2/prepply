'use strict';

import blogPages from './blog_pages.js';
import blogFeeds from './blog_feeds.js';
import blogTags from './blog_tags.js';
import blogTagFeeds from './blog_tag_feeds.js';
import allBlogsReader from './read_all_blogs.js';

function build(options, templates){
  console.log("Let's make a blog now...");
  const sorted = allBlogsReader.read(options); //warning -- reads all into memory, see comment in lib
  blogPages.generate(options, templates, sorted);
  blogFeeds.build(options, templates, sorted);
  blogTags.build(options, templates, sorted);
  blogTagFeeds.build(options, templates, sorted);
}

export default {
  build
};
