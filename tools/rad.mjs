import fs from 'node:fs';
for (const f of ['styles.css','polish.css']) {
  const css = fs.readFileSync(f,'utf8');
  const re = /([^{}]+)\{([^{}]*)\}/g; let m;
  while ((m = re.exec(css))) {
    const r = /border-radius:\s*(\d+)px/.exec(m[2]);
    if (r && +r[1] >= 18) console.log(f, '|', m[1].trim().replace(/\s+/g,' ').slice(0,90), '|', r[1]);
  }
}
