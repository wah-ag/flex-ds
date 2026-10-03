// Token parser for stories. Stories derive their content from the build
// output, never from a hand-kept list of token names (CLAUDE.md), so this
// reads build/css/*.css as text and resolves it the way the cascade does.
//
// - tokens.css              :root                        (on-light, web)
// - tokens-dark.css         [data-theme="dark"]          (on-dark overrides)
// - tokens-back-office.css  [data-scale="back-office"]   (back-office overrides)
//
// There is no mobile CSS: the mobile scale ships only to iOS and Android.

import baseCss from '../../build/css/tokens.css?raw';
import darkCss from '../../build/css/tokens-dark.css?raw';
import backOfficeCss from '../../build/css/tokens-back-office.css?raw';

const DECLARATION = /(--[\w-]+)\s*:\s*([^;]+);/g;
const VAR_REFERENCE = /var\(\s*(--[\w-]+)/g;

/** Every custom property declared in a CSS text, as a Map of name → raw value. */
export function parseDeclarations(cssText) {
  const tokens = new Map();
  for (const [, name, value] of cssText.matchAll(DECLARATION)) {
    tokens.set(name, value.trim());
  }
  return tokens;
}

const layers = {
  base: parseDeclarations(baseCss),
  dark: parseDeclarations(darkCss),
  backOffice: parseDeclarations(backOfficeCss),
};

/** The modes a component can be seen in, in the order the toolbar offers them. */
export const MODES = [
  { id: 'on-light / web', theme: 'light', scale: 'web' },
  { id: 'on-dark / web', theme: 'dark', scale: 'web' },
  { id: 'on-light / back-office', theme: 'light', scale: 'back-office' },
  { id: 'on-dark / back-office', theme: 'dark', scale: 'back-office' },
];

function lookup(name, { theme, scale }) {
  if (theme === 'dark' && layers.dark.has(name)) return layers.dark.get(name);
  if (scale === 'back-office' && layers.backOffice.has(name)) return layers.backOffice.get(name);
  return layers.base.get(name);
}

/** True when the build declares this token in any file. */
export function exists(name) {
  return layers.base.has(name) || layers.dark.has(name) || layers.backOffice.has(name);
}

/**
 * Follow a token through every alias in one mode.
 * Returns { chain: [names…], value } where value is the final literal, or
 * null when the chain breaks (a token the build does not declare).
 */
export function resolve(name, mode) {
  const chain = [name];
  let value = lookup(name, mode);
  while (value !== undefined) {
    const alias = value.match(/^var\(\s*(--[\w-]+)\s*\)$/);
    if (!alias || chain.includes(alias[1])) return { chain, value };
    chain.push(alias[1]);
    value = lookup(alias[1], mode);
  }
  return { chain, value: null };
}

/**
 * The tokens a CSS text references through var(), in first-use order.
 * Custom properties the CSS declares itself (component-local plumbing such
 * as --avatar-size) are left out: they are not tokens.
 */
export function referencedTokens(cssText) {
  const local = new Set(parseDeclarations(cssText).keys());
  const names = [];
  for (const [, name] of cssText.matchAll(VAR_REFERENCE)) {
    if (!local.has(name) && !names.includes(name)) names.push(name);
  }
  return names;
}
