// Security gate for flex-ds. No dependencies: Node built-ins only.
// Reports, never fixes. Exits 1 if anything is found, or if a check could not run.
//
// Static mode (default): scans build output and the working tree.
//   node scripts/security-check.mjs [dir ...]          default dirs: storybook-static build
//     1. credentials, by provider-specific pattern (not entropy)
//     2. private identifiers (Airtable IDs, this repo's registry IDs, git email, home paths)
//     3. environment leakage into client JS (process.env / import.meta.env, .env values)
//     4. dependency advisories (npm audit, high and critical)
//     5. a dirty working tree
//
// Live mode: checks one deployed URL.
//   node scripts/security-check.mjs --live <url> --expect public|protected
//     public    → must answer 200 without an auth wall, and the page and its
//                 same-origin scripts must pass checks 1–3.
//     protected → must refuse an anonymous request (401/403, or a redirect to a login).
//
// Flags: --skip-audit (offline runs; reported as SKIPPED, never as a pass),
//        --allow-dirty (only for proving the gate on a fixture; never in the pipeline).
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const findings = [];
const skipped = [];
const add = (check, where, what) => findings.push(`[${check}] ${where}: ${what}`);

// 1. Credentials — provider-specific shapes only.
const CREDENTIALS = [
  ['Airtable personal access token', /\bpat[A-Za-z0-9]{14}\.[a-f0-9]{64}\b/g],
  ['GitHub token', /\bgh[pousr]_[A-Za-z0-9]{36,}\b/g],
  ['GitHub fine-grained token', /\bgithub_pat_[A-Za-z0-9_]{60,}\b/g],
  ['Figma personal access token', /\bfigd_[A-Za-z0-9_-]{30,}\b/g],
  ['Anthropic API key', /\bsk-ant-[A-Za-z0-9_-]{20,}\b/g],
  ['OpenAI API key', /\bsk-(?!ant-)(?:proj-)?[A-Za-z0-9_-]{32,}\b/g],
  ['AWS access key ID', /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{35}\b/g],
  ['Slack token', /\bxox[abposr]-[A-Za-z0-9-]{10,}\b/g],
  ['Stripe live key', /\b(?:sk|rk)_live_[A-Za-z0-9]{20,}\b/g],
  ['npm token', /\bnpm_[A-Za-z0-9]{36}\b/g],
  ['Private key block', /-----BEGIN (?:[A-Z]+ )?PRIVATE KEY-----/g],
];

// 2. Private identifiers.
function privateIdentifiers() {
  const ids = [
    ['Airtable base ID', /\bapp[A-Za-z0-9]{14}\b/g],
    ['Airtable table ID', /\btbl[A-Za-z0-9]{14}\b/g],
    ['Airtable field ID', /\bfld[A-Za-z0-9]{14}\b/g],
    ['Windows home path', /[A-Za-z]:\\\\?Users\\\\?[^\\"'\s]+/g],
    ['macOS home path', /\/Users\/[A-Za-z0-9._-]+\//g],
    ['Linux home path', /\/home\/[A-Za-z0-9._-]+\//g],
  ];
  const literal = (label, value) => {
    if (value && value.length >= 6) ids.push([label, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')]);
  };
  try { literal('git author email', execSync('git config user.email', { encoding: 'utf8' }).trim()); } catch {}
  try {
    const reg = JSON.parse(fs.readFileSync('.claude/registry.local.json', 'utf8'));
    literal('registry base ID', reg.baseId);
    for (const [t, id] of Object.entries(reg.tables ?? {})) literal(`registry table ID (${t})`, id);
  } catch {}
  return ids;
}

// 3. Environment leakage.
function envPatterns() {
  const pats = [
    ['process.env reference in client code', /process\.env\.(?!NODE_ENV\b)[A-Z_][A-Z0-9_]*/g],
    ['import.meta.env reference in client code', /import\.meta\.env\.(?!MODE\b|DEV\b|PROD\b|SSR\b|BASE_URL\b|STORYBOOK\b)[A-Z_][A-Z0-9_]*/g],
  ];
  for (const f of fs.existsSync('.') ? fs.readdirSync('.') : []) {
    if (!/^\.env(\..+)?$/.test(f) || f === '.env.example') continue;
    for (const line of fs.readFileSync(f, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*["']?(.*?)["']?\s*$/);
      if (m && m[2].length >= 8) pats.push([`value of ${m[1]} from ${f}`, new RegExp(m[2].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')]);
    }
  }
  return pats;
}

const TEXT = /\.(m?js|cjs|css|html?|json|map|txt|svg|xml|swift|md)$/i;
function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules' && e.name !== '.git') yield* walk(p); }
    else if (TEXT.test(e.name)) yield p;
  }
}

function scanText(where, text, groups) {
  for (const [check, patterns] of groups) {
    for (const [label, re] of patterns) {
      re.lastIndex = 0;
      const hits = new Set(text.match(re) ?? []);
      for (const h of hits) add(check, where, `${label} (${h.slice(0, 12)}…)`);
    }
  }
}

function staticMode() {
  const dirs = args.filter((a) => !a.startsWith('--'));
  const targets = dirs.length ? dirs : ['storybook-static', 'build'];
  const groups = [['credential', CREDENTIALS], ['private-id', privateIdentifiers()], ['env-leak', envPatterns()]];
  let scanned = 0;
  for (const d of targets) {
    if (!fs.existsSync(d)) { skipped.push(`scan of ${d}/ (does not exist)`); continue; }
    for (const f of walk(d)) { scanText(f, fs.readFileSync(f, 'utf8'), groups); scanned++; }
  }
  if (scanned === 0) findings.push('[scan] no files scanned — nothing to vouch for. Build first, or name the output directory.');

  if (flag('--skip-audit')) skipped.push('npm audit (--skip-audit)');
  else {
    let out;
    try { out = execSync('npm audit --json', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); }
    catch (e) { out = e.stdout; }
    try {
      const v = JSON.parse(out).metadata.vulnerabilities;
      if (v.high || v.critical) add('advisory', 'npm audit', `${v.critical} critical, ${v.high} high`);
    } catch { findings.push('[advisory] npm audit could not run — the check did not happen, so it did not pass.'); }
  }

  if (flag('--allow-dirty')) skipped.push('dirty-tree check (--allow-dirty)');
  else {
    try {
      const dirty = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
      if (dirty) add('dirty-tree', 'git status', `${dirty.split('\n').length} uncommitted path(s): what ships is not what is committed`);
    } catch { findings.push('[dirty-tree] git status could not run.'); }
  }
}

async function liveMode() {
  const url = opt('--live');
  const expect = opt('--expect');
  if (!url || !['public', 'protected'].includes(expect)) {
    console.log('Usage: --live <url> --expect public|protected. The expectation is required; the gate never guesses it.');
    process.exit(2);
  }
  let res;
  try { res = await fetch(url, { redirect: 'manual' }); }
  catch (e) { findings.push(`[live] ${url}: request failed (${e.message})`); return; }
  const loc = res.headers.get('location') ?? '';
  const walled = res.status === 401 || res.status === 403 ||
    (res.status >= 300 && res.status < 400 && /login|sso|auth|vercel\.com/i.test(loc));

  if (expect === 'protected') {
    if (!walled) add('live', url, `meant to be protected, but an anonymous request got ${res.status}${loc ? ` → ${loc}` : ''}`);
    return;
  }
  if (walled) { add('live', url, `meant to be public, but an anonymous request was refused (${res.status}${loc ? ` → ${loc}` : ''})`); return; }
  if (res.status >= 300 && res.status < 400) { res = await fetch(url); }
  if (res.status !== 200) { add('live', url, `meant to be public, but answered ${res.status}`); return; }

  const groups = [['credential', CREDENTIALS], ['private-id', privateIdentifiers()], ['env-leak', envPatterns()]];
  const html = await res.text();
  scanText(url, html, groups);
  const origin = new URL(res.url || url).origin;
  for (const m of html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)) {
    const src = new URL(m[1], res.url || url);
    if (src.origin !== origin) continue;
    try { scanText(src.href, await (await fetch(src)).text(), groups); }
    catch (e) { findings.push(`[live] ${src.href}: could not fetch (${e.message})`); }
  }
}

if (opt('--live')) await liveMode(); else staticMode();

for (const s of skipped) console.log(`SKIPPED  ${s}`);
if (findings.length) {
  console.log(findings.map((f) => `FAIL     ${f}`).join('\n'));
  console.log(`\n✘ ${findings.length} finding(s). Nothing ships until each is resolved at its source.`);
  process.exit(1);
}
console.log('✔ security-check passed' + (skipped.length ? ' (with the skips listed above — those checks did not run)' : '.'));
