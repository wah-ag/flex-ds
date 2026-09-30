#!/usr/bin/env node
// Which tokens a component uses, and which of them a token sync changed.
//
//   node scripts/component-tokens.mjs <Component>
//   node scripts/component-tokens.mjs <Component> --from <ref> [--to <ref>]
//
// <Component> is a folder in src/components/. The component's own files
// (stories excluded) are scanned for var(--name). Each name is then followed
// through the aliases in tokens/, in every mode, so a change to a core
// primitive reaches every semantic token that points at it.
//
// With --from, tokens/ at <ref> is compared with tokens/ at --to (default:
// the working tree), and only the used tokens whose value changed are printed,
// per mode, with their raw and resolved old → new values.
//
// Read-only. It reads tokens/ JSON and git; it writes nothing. Exit 0 always
// unless the arguments or the component are wrong.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const args = process.argv.slice(2);
const name = args[0];
const opt = (flag) => {
  const i = args.indexOf(flag);
  return i === -1 ? undefined : args[i + 1];
};
const from = opt('--from');
const to = opt('--to');

if (!name || name.startsWith('--')) {
  console.error('usage: node scripts/component-tokens.mjs <Component> [--from <ref> [--to <ref>]]');
  process.exit(2);
}
const dir = join('src/components', name);
if (!existsSync(dir)) {
  console.error(`no component folder: ${dir}`);
  process.exit(2);
}

// --- tokens/ at a ref (or the working tree) --------------------------------

const MANIFEST = 'tokens/manifest.json';

const readAt = (ref, path) => {
  if (!ref) return existsSync(path) ? readFileSync(path, 'utf8') : null;
  try {
    return execFileSync('git', ['show', `${ref}:${path}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null; // file absent at that ref
  }
};

// { "<collection>/<mode>": { tokenName: token } } plus the collection of each.
const load = (ref) => {
  const manifest = JSON.parse(readAt(ref, MANIFEST) ?? '{"collections":{}}');
  const modes = {};
  for (const [collection, { modes: m }] of Object.entries(manifest.collections ?? {})) {
    for (const [mode, files] of Object.entries(m)) {
      const tokens = {};
      for (const f of files) Object.assign(tokens, JSON.parse(readAt(ref, `tokens/${f}`) ?? '{}'));
      modes[`${collection}/${mode}`] = tokens;
    }
  }
  return modes;
};

// A mode view is what one platform sees: every single-mode collection, plus
// one mode of each multi-mode collection. Resolution happens inside a view.
const views = (modes) => {
  const byCollection = {};
  for (const key of Object.keys(modes)) {
    const [c, m] = key.split('/');
    (byCollection[c] ??= []).push(m);
  }
  const shared = {};
  const multi = [];
  for (const [c, ms] of Object.entries(byCollection)) {
    if (ms.length === 1) Object.assign(shared, modes[`${c}/${ms[0]}`]);
    else multi.push([c, ms]);
  }
  const out = {};
  for (const [c, ms] of multi) {
    for (const m of ms) out[`${c}/${m}`] = { ...shared, ...modes[`${c}/${m}`] };
  }
  if (!multi.length) out.all = shared;
  return out;
};

const REF = /\{([a-z0-9-]+)\}/gi;
const refsOf = (token) => [...JSON.stringify(token?.$value ?? '').matchAll(REF)].map((m) => m[1]);

// --- what the component uses -------------------------------------------------

const used = new Set();
for (const f of readdirSync(dir)) {
  if (/\.stories\./.test(f)) continue;
  const src = readFileSync(join(dir, f), 'utf8');
  for (const m of src.matchAll(/var\(\s*--([a-z0-9-]+)/gi)) used.add(m[1]);
}

// Follow aliases through every mode at a ref, so the closure covers any mode.
const closure = (modes) => {
  const seen = new Set();
  const stack = [...used];
  while (stack.length) {
    const t = stack.pop();
    if (seen.has(t)) continue;
    seen.add(t);
    for (const tokens of Object.values(modes)) for (const r of refsOf(tokens[t])) stack.push(r);
  }
  return seen;
};

// --- resolving a value for a designer ----------------------------------------

const hex = ({ components: [r, g, b], alpha = 1 }) => {
  const c = [r, g, b].map((n) => Math.round(n * 255));
  if (alpha < 1) return `rgba(${c.join(', ')}, ${+alpha.toFixed(2)})`;
  return '#' + c.map((n) => n.toString(16).padStart(2, '0')).join('').toUpperCase();
};

const plain = (v) => {
  if (v && typeof v === 'object' && Array.isArray(v.components)) return hex(v);
  if (v && typeof v === 'object' && 'value' in v && 'unit' in v) return `${v.value}${v.unit}`;
  return v;
};

const resolve = (view, v, depth = 0) => {
  if (depth > 20) return v;
  if (typeof v === 'string') {
    const whole = v.match(/^\{([a-z0-9-]+)\}$/i);
    if (whole) return view[whole[1]] ? resolve(view, view[whole[1]].$value, depth + 1) : v;
    return v.replace(REF, (all, r) => (view[r] ? String(resolve(view, view[r].$value, depth + 1)) : all));
  }
  if (Array.isArray(v)) return v.map((x) => resolve(view, x, depth));
  if (v && typeof v === 'object') {
    const p = plain(v);
    if (p !== v) return p;
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, resolve(view, x, depth)]));
  }
  return v;
};

const show = (v) => (typeof v === 'string' ? v : JSON.stringify(plain(v)));

// --- output ------------------------------------------------------------------

const now = load(to);

if (!from) {
  const all = [...closure(now)].sort();
  console.log(JSON.stringify({ component: name, direct: [...used].sort(), resolvedThrough: all.filter((t) => !used.has(t)) }, null, 2));
  process.exit(0);
}

const before = load(from);
const reach = new Set([...closure(before), ...closure(now)]);
const vBefore = views(before);
const vNow = views(now);

const changes = [];
for (const view of new Set([...Object.keys(vBefore), ...Object.keys(vNow)])) {
  const a = vBefore[view] ?? {};
  const b = vNow[view] ?? {};
  for (const t of used) {
    // A used token changed in this view if its fully resolved value moved,
    // or if it was added or removed.
    const oldTok = a[t];
    const newTok = b[t];
    const oldRes = oldTok ? show(resolve(a, oldTok.$value)) : null;
    const newRes = newTok ? show(resolve(b, newTok.$value)) : null;
    if (oldRes === newRes) continue;
    // Which tokens along the chain actually moved.
    const via = [...reach].filter(
      (x) => JSON.stringify(a[x]?.$value ?? null) !== JSON.stringify(b[x]?.$value ?? null),
    ).filter((x) => x === t || dependsOn(b, t, x) || dependsOn(a, t, x));
    changes.push({
      token: t,
      mode: view,
      change: !oldTok ? 'added' : !newTok ? 'removed' : 'value',
      old: oldRes,
      new: newRes,
      oldRaw: oldTok ? show(oldTok.$value) : null,
      newRaw: newTok ? show(newTok.$value) : null,
      via,
    });
  }
}

function dependsOn(view, t, x, seen = new Set()) {
  if (seen.has(t)) return false;
  seen.add(t);
  return refsOf(view[t]).some((r) => r === x || dependsOn(view, r, x, seen));
}

console.log(JSON.stringify({ component: name, from, to: to ?? 'working tree', changes }, null, 2));
