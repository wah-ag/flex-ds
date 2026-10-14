// Package smoke test. Node built-ins plus the React already installed.
//
//   node scripts/test-package.mjs                  tests ./dist in this repo
//   node scripts/test-package.mjs --installed <dir> tests the package installed
//                                                   in <dir>/node_modules, as a
//                                                   consumer would resolve it
//
// For both module formats it loads the package through its "exports" map,
// renders every exported component with its defaults to HTML, and checks the
// two stylesheets resolve. It tests that the package loads and renders; it
// does not test how a component looks or behaves (that is QA, in Storybook).
// Exits 1 on any failure.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const args = process.argv.slice(2);
const installedAt = args.includes('--installed') ? path.resolve(args[args.indexOf('--installed') + 1]) : null;

// Where the package (and the React it renders with) is resolved from.
const base = installedAt ?? root;
const req = createRequire(path.join(base, 'noop.js'));
const pkgRoot = installedAt ? path.join(installedAt, 'node_modules', ...pkg.name.split('/')) : root;
const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgRoot, 'package.json'), 'utf8'));

const failures = [];
const fail = (what) => failures.push(what);

// The public surface, as src/index.ts declares it.
const expected = [...fs.readFileSync(path.join(root, 'src/index.ts'), 'utf8')
  .matchAll(/^export \{ (\w+) \} from /gm)].map((m) => m[1]);
if (expected.length === 0) fail('src/index.ts exports nothing');

const { createElement } = req('react');
const { renderToString } = req('react-dom/server');

async function load(format) {
  if (format === 'cjs') return installedAt ? req(pkg.name) : req(path.join(root, pkgJson.exports['.'].require.default));
  const entry = pkgJson.exports['.'].import.default;
  return import(pathToFileURL(path.join(pkgRoot, entry)).href);
}

for (const format of ['esm', 'cjs']) {
  let mod;
  try { mod = await load(format); } catch (e) { fail(`${format}: the package does not load: ${e.message}`); continue; }

  const actual = Object.keys(mod).filter((k) => k !== 'default' && k !== '__esModule').sort();
  const missing = expected.filter((n) => !actual.includes(n));
  const extra = actual.filter((n) => !expected.includes(n));
  if (missing.length) fail(`${format}: missing exports: ${missing.join(', ')}`);
  if (extra.length) fail(`${format}: exports not in src/index.ts: ${extra.join(', ')}`);

  for (const name of expected) {
    if (typeof mod[name] !== 'function') continue;
    try {
      const html = renderToString(createElement(mod[name]));
      if (!html) fail(`${format}: ${name} rendered nothing`);
    } catch (e) {
      fail(`${format}: ${name} threw while rendering: ${e.message}`);
    }
  }
}

for (const sheet of ['styles.css', 'tokens.css']) {
  const file = installedAt
    ? (() => { try { return req.resolve(`${pkg.name}/${sheet}`); } catch { return null; } })()
    : path.join(root, pkgJson.exports[`./${sheet}`]);
  if (!file || !fs.existsSync(file)) fail(`${sheet} does not resolve through the exports map`);
  else if (fs.statSync(file).size === 0) fail(`${sheet} is empty`);
}

const where = installedAt ? `${pkg.name}@${pkgJson.version} installed in ${installedAt}` : 'dist/';
if (failures.length) {
  console.error(`test-package: ${failures.length} failure(s) in ${where}`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`test-package: ${expected.length} components rendered in esm and cjs from ${where}; both stylesheets resolve`);
