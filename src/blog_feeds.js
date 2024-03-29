'use strict';

import _ from 'lodash';
import * as marked from 'marked';
import fs from 'fs-extra';
import blogLinks from './blog_links.js';
import writeFile from './write_file.js';

const DEFAULT_NUM = 10;

function build(options, templates, sortedBlogs) {
  if(!options.tag) console.log('Building blog feeds...');
  const feed = buildFeed(options, sortedBlogs);
  const rssFile = options.rssFile || `${options.outdir}/blog/rss.xml`;
  writeFeed(templates, 'RSS', rssFile, feed);
  const atomFile = options.atomFile || `${options.outdir}/blog/atom.xml`;
  writeFeed(templates, 'Atom', atomFile, feed);
}

function writeFeed(templates, name, outFile, feed){
  console.log(`Building ${name} feed...`);
  const rendered = templates.render(name.toLowerCase(), feed);
  writeFile(outFile, rendered, feed.date);
  console.log(`Wrote ${outFile}`);
}

function buildFeed(options, sortedBlogs) {
  const numItems = _.get(options, 'feed.num', DEFAULT_NUM);
  return {
    title: _.get(options, 'feed.title'),
    description: _.get(options, 'feed.description'),
    id: _.get(options, 'site-url'),
    link: _.get(options, 'feed.blog-url'),
    logo: _.get(options, 'feed.image'),
    favicon: _.get(options, 'feed.favicon'),
    copyright: _.get(options, 'feed.copyright'),
    date: _.get(sortedBlogs[0], 'attributes.date', new Date()),
    rssUrl: _.get(options, 'feed.rss-url'),
    atomUrl: _.get(options, 'feed.atom-url'),
    author: _.get(options, 'feed.author', {}),
    language: _.get(options, 'feed.language'),
    generator: 'cinco™',
    items: sortedBlogs.slice(0,numItems).map(blog => ({
      title: blog.attributes.title,
      selfUrl: blogLinks.permalink(options, blog),
      date: blog.attributes.date,
      tags: blog.attributes.tags,
      description: marked.parse(blog.body)
    }))
  };
}

export default {
  build
}
