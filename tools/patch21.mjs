import fs from 'node:fs';
let s = fs.readFileSync('src/spark.js','utf8');
s = s.replace("p.rug.visible = vis;", "p.rug.visible = vis && Math.hypot(p.root.position.x, p.root.position.z - 1.2) > 1.7;");
fs.writeFileSync('src/spark.js', s);
let c = fs.readFileSync('polish.css','utf8');
c = c.replace(".speech-bar.compact .speech-text { opacity: 0; max-width: 0; overflow: hidden; padding: 0; margin: 0; }", ".speech-bar.compact .speech-text { display: none !important; }\n.speech-bar.compact { width: 72px; height: 72px; justify-content: center; align-items: center; }");
fs.writeFileSync('polish.css', c);
