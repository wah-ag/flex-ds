// Checks a Figma token export for problems a green build does not catch.
// Read-only: it reports, it never fixes. Exits 1 if anything is found.
//
//   - Mode parity: every token in one mode exists in its sibling modes.
//   - Alpha: every `a`-suffixed colour (e.g. color-navy-100a) has alpha < 1.
import fs from 'node:fs';

const T = 'tokens/';
const read = (f) => JSON.parse(fs.readFileSync(T + f, 'utf8'));

const MODES = {
  'semantic colour': ['on-light', 'on-dark'].map((m) => `semantic-color.${m}.tokens.json`),
  'type scale': ['web', 'mobile', 'back-office'].map((m) => `semantic-scale.${m}.tokens.json`),
};

const problems = [];

for (const [group, files] of Object.entries(MODES)) {
  const names = files.map((f) => new Set(Object.keys(read(f))));
  const all = new Set(names.flatMap((n) => [...n]));
  for (const token of all) {
    const missing = files.filter((_, i) => !names[i].has(token));
    if (missing.length) problems.push(`Design gap (${group}): ${token} is missing from ${missing.join(', ')}`);
  }
}

for (const f of fs.readdirSync(T).filter((f) => f.endsWith('.tokens.json'))) {
  for (const [token, t] of Object.entries(read(f))) {
    if (!/\d+a$/.test(token) || t.$type !== 'color' || typeof t.$value !== 'object') continue;
    if (!(t.$value.alpha < 1)) problems.push(`Misnamed: ${token} (${f}) has an "a" suffix but exports opaque`);
  }
}

if (problems.length) {
  console.log(problems.join('\n'));
  console.log(`\n✘ ${problems.length} problem(s). Fix them in Figma and re-export.`);
  process.exit(1);
}
console.log('✔ Modes match and every alpha token carries alpha.');
