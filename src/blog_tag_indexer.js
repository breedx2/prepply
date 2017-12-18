'use strict';

const _ = require('lodash');

function index(sortedBlogs){
  const allTags = _.uniq(_.flatMap(sortedBlogs, 'attributes.tags')).filter(x => x);
  return allTags.map(tag => {
    const blogs = sortedBlogs.filter(blog => _.get(blog, 'attributes.tags', []).includes(tag));
    return [tag, blogs];
  });
}

module.exports = {
  index
};
