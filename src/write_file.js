'use strict';

const fs = require('fs-extra');

// writes a file with the given content, and stamps it with a date.
function write(filename, data, date){
  fs.ensureFileSync(filename);
  fs.writeFileSync(filename, data);
  const timestamp = date.getTime() / 1000;
  fs.utimes(filename, timestamp, timestamp);
}

module.exports = write;
