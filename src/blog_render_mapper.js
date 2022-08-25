'use strict';

import 'marked';
import * as blogLinks from './blog_links.js';

// maps some blogs into what the template engine expects
export default function(options, blogs){
  return blogs.map(item => {
    const html = marked(item.body);
    return Object.assign({}, item.attributes, {
      content: html,
      selfUrl: blogLinks.permalink(options, item)
    });
  });
}
