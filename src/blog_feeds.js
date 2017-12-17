'use strict';

const _ = require('lodash');
const marked = require('marked');
const fs = require('fs');
const blogLinks = require('./blog_links');

const DEFAULT_NUM = 10;

function build(options, templates, sortedBlogs) {
  console.log('Building blog feeds...');
  const feed = buildFeed(options, sortedBlogs);
  buildRss(options, templates, feed);
  buildAtom(options, templates, feed);
}

function buildRss(options, templates, feed) {
  //TODO: Push to config
  const rssFile = `${options.outdir}/rss.xml`;
  console.log('Building RSS feed...');
  const rendered = templates.render('rss', feed);
  fs.writeFileSync(rssFile, rendered);
  console.log(`Wrote ${rssFile}`);
}

function buildAtom(options, templates, feed) {
  //TODO: Push to config
  const atomFile = `${options.outdir}/atom.xml`;
  console.log('Building Atom feed...');
  const rendered = templates.render('atom', feed);
  fs.writeFileSync(atomFile, rendered);
  console.log(`Wrote ${atomFile}`);
}

function buildFeed(options, sortedBlogs) {
  const numItems = options.feed.num || DEFAULT_NUM;
  return {
    title: _.get(options, 'feed.title'),
    description: _.get(options, 'feed.description'),
    id: _.get(options, 'site-url'),
    link: _.get(options, 'feed.blog-url'),
    logo: _.get(options, 'feed.image'),
    favicon: _.get(options, 'feed.favicon'),
    copyright: _.get(options, 'feed.copyright'),
    date: sortedBlogs[0].attributes.date,
    rssUrl: _.get(options, 'feed.rss-url'),
    atomUrl: _.get(options, 'feed.atom-url'),
    author: _.get(options, 'feed.author'),
    language: _.get(options, 'feed.language'),
    generator: 'cinco™',
    items: sortedBlogs.slice(0,numItems).map(blog => ({
      title: blog.attributes.title,
      selfUrl: blogLinks.permalink(options, blog),
      date: blog.attributes.date,
      tags: blog.attributes.tags,
      description: marked(blog.body)
    }))
  };
}

module.exports = {
  build
}
