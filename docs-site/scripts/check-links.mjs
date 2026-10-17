// Fails the build on any broken internal link in the built site.
// Usage: node scripts/check-links.mjs [dist]
// Every href and src that points inside the site (root-relative or
// relative) must resolve to a file in dist, and every #fragment to an id on
// the target page. Node built-ins only.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.argv[2] ?? 'dist');
if (!fs.existsSync(dist)) {
  console.error(`check-links: ${dist} does not exist`);
  process.exit(1);
}

const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) pages.push(p);
  }
})(dist);

const ids = new Map();
const idsOf = (file) => {
  if (!ids.has(file)) ids.set(file, new Set([...fs.readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return ids.get(file);
};

function target(fromFile, url) {
  const clean = url.split('#')[0].split('?')[0];
  const base = clean.startsWith('/') ? path.join(dist, clean) : path.resolve(path.dirname(fromFile), clean || path.basename(fromFile));
  for (const c of [base, path.join(base, 'index.html'), `${base}.html`]) if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  return null;
}

const broken = [];
let checked = 0;
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1].replace(/&amp;/g, '&');
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|data:|mailto:)/i.test(url)) continue;
    checked++;
    const file = target(page, url);
    const rel = path.relative(dist, page).split(path.sep).join('/');
    if (!file) { broken.push(`${rel}: ${url}`); continue; }
    const frag = url.split('#')[1];
    if (frag && file.endsWith('.html') && !idsOf(file).has(decodeURIComponent(frag))) broken.push(`${rel}: ${url} (no #${frag})`);
  }
}

if (broken.length) {
  console.error(`check-links: ${broken.length} broken internal link(s) out of ${checked}`);
  for (const b of broken) console.error(`  ${b}`);
  process.exit(1);
}
console.log(`check-links: ${checked} internal links across ${pages.length} pages, 0 broken`);
