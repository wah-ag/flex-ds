// Builds the package's two stylesheets into dist/. Node built-ins only.
//
//   dist/styles.css  src/styles.css with each @import inlined, in order.
//   dist/tokens.css  build/css/tokens.css, then tokens-dark.css, then
//                    tokens-back-office.css: the three files Storybook loads,
//                    in the order it loads them. Dark and back-office are
//                    scoped to [data-theme="dark"] and [data-scale="back-office"],
//                    so one file carries every mode the web ships.
//
// Copies generated output; never writes to build/ or tokens/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const rel = (f) => path.relative(root, f).split(path.sep).join('/');
fs.mkdirSync(dist, { recursive: true });

const IMPORT = /^@import\s+['"]([^'"]+)['"];\s*$/;

function inline(file, seen = new Set()) {
  if (seen.has(file)) throw new Error(`circular @import: ${rel(file)}`);
  seen.add(file);
  return fs.readFileSync(file, 'utf8').split(/\r?\n/).map((line) => {
    const m = line.match(IMPORT);
    if (!m) return line;
    const target = path.resolve(path.dirname(file), m[1]);
    if (!fs.existsSync(target)) throw new Error(`${rel(file)} imports a missing file: ${m[1]}`);
    return `/* ${rel(target)} */\n${inline(target, new Set(seen))}`;
  }).join('\n');
}

const styles = inline(path.join(root, 'src/styles.css'));
if (/url\(/.test(styles.replace(/\/\*[\s\S]*?\*\//g, ''))) {
  throw new Error('src/styles.css references a url(): ship the asset, or this build breaks it');
}
fs.writeFileSync(path.join(dist, 'styles.css'), styles);

const tokenFiles = ['tokens.css', 'tokens-dark.css', 'tokens-back-office.css'].map((f) => path.join(root, 'build/css', f));
for (const f of tokenFiles) {
  if (!fs.existsSync(f)) throw new Error(`${rel(f)} is missing: run npm run build:tokens first`);
}
fs.writeFileSync(
  path.join(dist, 'tokens.css'),
  tokenFiles.map((f) => `/* ${path.basename(f)} */\n${fs.readFileSync(f, 'utf8')}`).join('\n'),
);

console.log('dist/styles.css and dist/tokens.css written');
