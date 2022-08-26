'use strict';

import * as marked from 'marked';
import blogLinks from './blog_links.js';

// maps some blogs into what the template engine expects
export default function(options, blogs){
  return blogs.map(item => {
    const html = marked.parse(item.body);
    return Object.assign({}, item.attributes, {
      content: html,
      selfUrl: blogLinks.permalink(options, item)
    });
  });
}
