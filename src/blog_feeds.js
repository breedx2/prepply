'use strict';

const _ = require('lodash');
const Feed = require('feed');
const marked = require('marked');
const fs = require('fs');
const blogLinks = require('./blog_links');

function build(options, sortedBlogs){
  console.log('Building blog feeds...');
  const feed = buildFeed(options, sortedBlogs);
  buildRss(options, feed);
  buildAtom(options, feed);
}

function buildRss(options, feed){
  //TODO: Push to config
  const rssFile = `${options.outdir}/rss.xml`;
  console.log('Building RSS feed...');
  fs.writeFileSync(rssFile, feed.rss2());
}

function buildAtom(options, feed){
  //TODO: Push to config
  const atomFile = `${options.outdir}/atom.xml`;
  console.log('Building Atom feed...');
  fs.writeFileSync(atomFile, feed.atom1());
}

function buildFeed(options, sortedBlogs){
  const feedOptions = {
        title: _.get(options, 'feed.title'),
        description: _.get(options, 'feed.description'),
        id: _.get(options, 'site-url'),
        link: _.get(options, 'feed.blog-url'),
        image: _.get(options, 'feed.image'),
        favicon: _.get(options, 'feed.favicon'),
        copyright: _.get(options, 'feed.copyright'),
        // updated: '2001-01-01',
        feedLinks: {
          rss: _.get(options, 'feed.rss-url'),
          atom: _.get(options, 'feed.atom-url')
        },
        author: _.get(options, 'feed.author'),
        webMaster: _.get(options, 'feed.author.name'),
        language: _.get(options, 'feed.language'),
        generator: 'cinco™'
  };
  const feed = new Feed(feedOptions);
  sortedBlogs.slice(0, 10).forEach(blog => {
    console.log(blog);
    const selfUrl = blogLinks.permalink(options, blog);
    const item = {
      title: blog.attributes.title,
      id: selfUrl,
      link: selfUrl,
      description: marked(blog.body),
      date: blog.attributes.date,
      author: [{
        name: _.get(options, 'feed.author.name'),
        email: _.get(options, 'feed.author.email')
      }]
    };
    feed.addItem(item); //mutable AF!
  });
  return feed;
}

module.exports = {
  build
}
