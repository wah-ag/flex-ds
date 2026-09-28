import StyleDictionary from 'style-dictionary';

const T = 'tokens/';
const CORE = T + 'core.value.tokens.json';
const LIGHT = T + 'semantic-color.on-light.tokens.json';
const DARK = T + 'semantic-color.on-dark.tokens.json';
const SCALE = (mode) => T + `semantic-scale.${mode}.tokens.json`; // web | mobile | back-office
const STYLES = [T + 'typography.styles.tokens.json', T + 'effects.styles.tokens.json'];

// Figma writes font weight as a style NAME. CSS needs a number.
const WEIGHTS = { Thin:100, ExtraLight:200, Light:300, Regular:400, Medium:500,
                  SemiBold:600, Bold:700, ExtraBold:800, Black:900 };

// Figma exports colours as { colorSpace, components: [r,g,b] (0–1), alpha }.
const toColor = ({ components: [r, g, b], alpha = 1 }) => {
  const c = [r, g, b].map((n) => Math.round(n * 255));
  if (alpha < 1) return `rgba(${c.join(', ')}, ${+alpha.toFixed(2)})`;
  return '#' + c.map((n) => n.toString(16).padStart(2, '0')).join('');
};

// A bare number is unitless in CSS (line-height 64 = 64 × font size). Make it px.
const px = (n) => (typeof n === 'number' ? `${n}px` : n);
const weight = (w) => WEIGHTS[w] ?? w;

// Turn Figma's object values into plain strings/numbers, deep.
const fix = (v) => {
  if (Array.isArray(v)) return v.map(fix);
  if (!v || typeof v !== 'object') return v;
  if (Array.isArray(v.components)) return toColor(v);               // colour
  if ('value' in v && 'unit' in v) return `${v.value}${v.unit}`;   // dimension
  const out = {};
  for (const k of Object.keys(v)) out[k] = fix(v[k]);
  return out;
};

// Typography written inline: "Regular" → 400, 64 → 64px.
const fixTypography = (v) => ({
  ...v,
  fontWeight: weight(v.fontWeight),
  fontSize: px(v.fontSize),
  lineHeight: px(v.lineHeight),
  letterSpacing: px(v.letterSpacing),
});

// Typography that REFERENCES other tokens ("{font-weight-regular}") only gets
// its value after this runs — so fix the referenced tokens themselves, by name.
const fixByName = (name, v) => {
  if (/weight/.test(name)) return weight(v);
  if (/font-size|line-height|letter-spacing/.test(name)) return px(v);
  return v;
};

// Runs BEFORE any transform, so every transform sees the fixed values.
StyleDictionary.registerPreprocessor({
  name: 'figma/fix',
  preprocessor: (dict) => {
    const walk = (node, path = []) => {
      for (const key of Object.keys(node)) {
        const t = node[key];
        if (!t || typeof t !== 'object') continue;
        const name = [...path, key].join('-').toLowerCase();
        if ('$value' in t) {
          t.$value = fix(t.$value);
          if (t.$type === 'typography') t.$value = fixTypography(t.$value);
          else t.$value = fixByName(name, t.$value);
        } else walk(t, [...path, key]);
      }
      return node;
    };
    return walk(dict);
  },
});

// outputReferences keeps var(--…) links, so the dark / back-office
// overrides also flow into shadows and typography shorthands.
const css = (name, sources, selector, filter) =>
  new StyleDictionary({
    source: sources,
    preprocessors: ['figma/fix'],
    log: { verbosity: 'silent' },
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: 'build/css/',
        files: [{ destination: name, format: 'css/variables',
                  options: { selector, showFileHeader: false, outputReferences: true }, filter }],
      },
    },
  });

const native = (sources) =>
  new StyleDictionary({
    source: sources,
    preprocessors: ['figma/fix'],
    log: { verbosity: 'silent' },
    platforms: {
      ios: { transformGroup: 'ios-swift', buildPath: 'build/ios/',
             files: [{ destination: 'Tokens.swift', format: 'ios-swift/class.swift',
                       options: { className: 'Tokens' },
                       filter: (t) => t.$type !== 'typography' && t.$type !== 'shadow' }] },
      android: { transformGroup: 'android', buildPath: 'build/android/',
                 files: [{ destination: 'colors.xml', format: 'android/resources',
                           resourceType: 'color', filter: { $type: 'color' } }] },
    },
  });

// :root — core, on-light colours, web scale, styles
await css('tokens.css',
  [CORE, LIGHT, SCALE('web'), ...STYLES],
  ':root').buildAllPlatforms();

// dark — only the colours that change
await css('tokens-dark.css',
  [CORE, DARK],
  '[data-theme="dark"]',
  (t) => t.filePath.includes('on-dark')).buildAllPlatforms();

// back-office — only the sizes that change
await css('tokens-back-office.css',
  [CORE, SCALE('back-office')],
  '[data-scale="back-office"]',
  (t) => t.filePath.includes('back-office')).buildAllPlatforms();

// iOS + Android — mobile scale
await native([CORE, LIGHT, SCALE('mobile'), ...STYLES]).buildAllPlatforms();

console.log('✔ Tokens built → build/css, build/ios, build/android');