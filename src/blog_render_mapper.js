'use strict';

const marked = require('marked');
const blogLinks = require('./blog_links');

// maps some blogs into what the template engine expects
module.exports = function(options, blogs){
  return blogs.map(item => {
    const html = marked(item.body);
    return Object.assign({}, item.attributes, {
      content: html,
      selfUrl: blogLinks.permalink(options, item)
    });
  });
}
