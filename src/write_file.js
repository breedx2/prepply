'use strict';

import fs from 'fs-extra';

// writes a file with the given content, and stamps it with a date.
export default function write(filename, data, date){
  fs.ensureFileSync(filename);
  fs.writeFileSync(filename, data);
  const timestamp = date.getTime() / 1000;
  fs.utimes(filename, timestamp, timestamp);
}
