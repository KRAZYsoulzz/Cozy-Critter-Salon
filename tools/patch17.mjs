import fs from 'node:fs';
let m = fs.readFileSync('src/main.js','utf8');
m = m.replace("import { initPolish } from './polish.js';", "import { initPolish } from './polish.js';\nimport { initSpark } from './spark.js';");
m = m.replace("initPolish(this);", "initPolish(this);\n    initSpark(this);");
fs.writeFileSync('src/main.js', m);
let w = fs.readFileSync('sw.js','utf8');
w = w.replace(/cozy-critter-3d-v\d+/, 'cozy-critter-3d-v9').replace("'./src/decor.js',", "'./src/decor.js',\n  './src/spark.js',");
fs.writeFileSync('sw.js', w);
