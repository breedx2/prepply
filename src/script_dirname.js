// mitigation for __dirname not existing in newer node

import { fileURLToPath } from 'url';
import { dirname } from 'path';

export default function scriptDirname(meta){
    const filename = fileURLToPath(meta.url);
    return dirname(filename);
}