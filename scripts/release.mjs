// Publishes the package to npm. Run by a human, from main, on a clean tree.
//
//   npm run release:publish -- <version> [--dry-run]
//
// <version> must equal package.json's version: the bump reaches main through
// a pull request like any other change, and this script only confirms it, so
// the tag points at the commit that was published.
//
// Steps, each one refusing on failure:
//   1. gates: branch is main, tree is clean, build:package, tests,
//      check:tokens, and the security gate over dist/
//   2. the version is not on the registry and the tag does not exist
//   3. "private": true is removed for the publish command only, and put back
//      straight after it
//   4. npm publish (--dry-run publishes nothing)
//   5. git tag v<version> (not pushed; skipped on --dry-run)
//   6. the package is installed into an empty folder and every component is
//      rendered from it (on --dry-run, from the packed tarball)
//
// "private": true is the guard against a stray `npm publish`. The restore is
// registered three ways: inline after the publish, on 'exit', and on SIGINT
// (and SIGTERM / SIGHUP). Not `finally`: it does not run when something calls
// process.exit(), and that would leave the repo publishable with nothing
// reporting it.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkgPath = path.join(root, 'package.json');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const version = args.find((a) => !a.startsWith('--'));
const unknown = args.filter((a) => a.startsWith('--') && a !== '--dry-run');

const step = (msg) => console.log(`\n▶ ${msg}`);
function refuse(msg) {
  console.error(`\n✖ release refused: ${msg}`);
  process.exit(1);
}
const run = (cmd, opts = {}) => execSync(cmd, { cwd: root, stdio: 'inherit', ...opts });
const read = (cmd, opts = {}) => execSync(cmd, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }).trim();
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

if (unknown.length) refuse(`unknown option ${unknown.join(' ')}`);
if (!version || !/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
  refuse('usage: npm run release:publish -- <version> [--dry-run]   (version like 0.1.0)');
}

const originalText = fs.readFileSync(pkgPath, 'utf8');
const pkg = JSON.parse(originalText);
const tag = `v${version}`;

if (pkg.version !== version) {
  refuse(`package.json is at ${pkg.version}, not ${version}. Bump it through a pull request into main first.`);
}
if (pkg.private !== true) {
  refuse('package.json is missing "private": true. The guard must be in place before a release starts.');
}

// ── 1. Gates ────────────────────────────────────────────────────────────────
step('Gate: branch');
const branch = read('git rev-parse --abbrev-ref HEAD');
if (branch !== 'main') {
  if (dryRun) console.warn(`  ! on ${branch}, not main. A real release refuses here; --dry-run carries on.`);
  else refuse(`on ${branch}. Releases publish main only.`);
}

step('Gate: clean working tree');
const dirty = read('git status --porcelain');
if (dirty) refuse(`uncommitted changes. What ships must be what is committed:\n${dirty}`);

try {
  step('Gate: build:package (tokens → library → CSS)');
  run('npm run build:package');
  step('Gate: tests (type check, render every export from dist/)');
  run('npm test');
  step('Gate: check:tokens');
  run('npm run check:tokens');
  step('Gate: security check over dist/');
  run('node scripts/security-check.mjs dist');
} catch {
  refuse('a gate failed (output above).');
}

// ── 2. Registry and tag ─────────────────────────────────────────────────────
step(`Gate: ${pkg.name}@${version} is not on the registry`);
try {
  const found = read(`npm view "${pkg.name}@${version}" version`);
  if (found) refuse(`${pkg.name}@${version} is already published. npm versions cannot be reused.`);
  console.log('  not published');
} catch (e) {
  const err = `${e.stderr ?? ''}${e.stdout ?? ''}`;
  if (/E404|404 Not Found/.test(err)) console.log('  not published (package or version not found)');
  else refuse(`could not ask the registry whether ${version} exists:\n${err || e.message}`);
}

step(`Gate: tag ${tag} does not exist`);
if (read(`git tag --list ${tag}`)) refuse(`tag ${tag} already exists.`);

// ── 3. Lift the guard, with the restore registered before it is lifted ─────
let restored = true;
function restorePrivate() {
  if (restored) return;
  try {
    fs.writeFileSync(pkgPath, originalText);
    const check = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (check.private !== true) throw new Error('"private" is not true after the write');
    restored = true;
    console.log('  "private": true restored');
  } catch (e) {
    // Loud on purpose: this is the state the guard exists to prevent.
    console.error(`\n✖✖ COULD NOT RESTORE "private": true in package.json: ${e.message}`);
    console.error('✖✖ The repo is publishable by accident. Restore it by hand: git checkout -- package.json');
    process.exitCode = 1;
  }
}
process.on('exit', restorePrivate);
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => {
    console.error(`\n✖ ${signal} received`);
    restorePrivate();
    process.exit(130);
  });
}

step(`Removing "private": true for the publish command only`);
const { private: _guard, ...publishable } = pkg;
restored = false;
fs.writeFileSync(pkgPath, `${JSON.stringify(publishable, null, 2)}\n`);

// ── 4. Publish ──────────────────────────────────────────────────────────────
step(dryRun ? `npm publish --dry-run (${pkg.name}@${version})` : `npm publish (${pkg.name}@${version})`);
let published = false;
try {
  run(`npm publish${dryRun ? ' --dry-run' : ''}`);
  published = !dryRun;
} catch {
  restorePrivate();
  refuse('npm publish failed (output above). Nothing was tagged.');
}
restorePrivate();
if (!restored) refuse('published, but "private": true is not back. See above.');

// ── 5. Tag ──────────────────────────────────────────────────────────────────
if (published) {
  step(`Tagging ${tag}`);
  try {
    run(`git tag -a ${tag} -m "${pkg.name}@${version}"`);
    console.log(`  tagged locally. Push it with: git push origin ${tag}`);
  } catch {
    console.error(`✖ published ${version}, but tagging failed. Tag it by hand: git tag -a ${tag}`);
    process.exitCode = 1;
  }
} else {
  step(`Tag ${tag} skipped (--dry-run)`);
}

// ── 6. Install into an empty folder and render ─────────────────────────────
step(dryRun ? 'Installing the packed tarball into an empty folder' : `Installing ${pkg.name}@${version} from the registry into an empty folder`);
const consumer = fs.mkdtempSync(path.join(os.tmpdir(), 'flex-ds-consumer-'));
fs.writeFileSync(path.join(consumer, 'package.json'), `${JSON.stringify({ name: 'flex-ds-consumer', private: true }, null, 2)}\n`);
const peers = Object.entries(pkg.peerDependencies ?? {}).map(([n, r]) => `"${n}@${r}"`).join(' ');

let spec = `"${pkg.name}@${version}"`;
if (dryRun) {
  const tarball = read(`npm pack --silent --pack-destination "${consumer}"`).split(/\r?\n/).pop();
  spec = `"${path.join(consumer, tarball)}"`;
}

let installed = false;
for (let attempt = 1; attempt <= (dryRun ? 1 : 6) && !installed; attempt++) {
  try {
    run(`npm install --no-audit --no-fund ${spec} ${peers}`, { cwd: consumer });
    installed = true;
  } catch {
    if (!dryRun) { console.log(`  not installable yet (attempt ${attempt}); the registry can lag, waiting 10s`); sleep(10_000); }
  }
}
if (!installed) {
  refuse(`${published ? `PUBLISHED ${version}, but it` : 'the package'} could not be installed into ${consumer}.`);
}

step('Rendering every component from the installed package');
try {
  run(`node scripts/test-package.mjs --installed "${consumer}"`);
} catch {
  refuse(`${published ? `PUBLISHED ${version}, but the installed package` : 'the installed package'} failed to render (output above). Consumer folder: ${consumer}`);
}

console.log(`\n✔ ${dryRun ? 'dry run complete: nothing was published or tagged' : `${pkg.name}@${version} published, tagged ${tag}, installed and rendered`}`);
