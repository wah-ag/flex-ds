---
name: tokens
description: Exporting flex-ds tokens from Figma and rebuilding them — what is generated and never hand-edited, the collections and modes, how to tell a real token gap from a naming mistake, and how to verify a rebuild instead of assuming it. Used by the human running the export and by token-runner.
---

# tokens

## What is generated, and by whom

| Path | Written by | Hand-edit? |
| --- | --- | --- |
| `tokens/*.tokens.json`, `tokens/manifest.json` | The Figma plugin export | Never. Not by Edit, `sed`, a redirect, or a script. A patch here is destroyed by the next export. |
| `build/css`, `build/ios`, `build/android` | `npm run build:tokens` (`build-tokens.js`, Style Dictionary 5) | Never. It is gitignored and rebuilt from `tokens/`. |
| `build-tokens.js`, `scripts/check-tokens.js` | A pull request a human reviews, outside the component loop. Not the developer agent during a build or repair round: its Access is `src/components/` only. | Only as code, never to hide a token problem. |

A missing or wrong token is fixed in Figma and re-exported. It is never added
to a generated file.

## Collections and modes

| Collection | Modes | What varies by mode |
| --- | --- | --- |
| core | `value` | Nothing. Primitives such as `color-navy-500`. Components never use these. |
| semantic-color | `on-light`, `on-dark` | Colour roles: `background-*`, `text-*`, `border-*`, `icon-*`. Dark ships as `build/css/tokens-dark.css` under `[data-theme="dark"]`. |
| semantic-scale | `web`, `mobile`, `back-office` | Sizes: font size, line height, spacing, radius, icon size. Back-office ships as `tokens-back-office.css` under `[data-scale="back-office"]`. Mobile ships only to iOS and Android. |
| Styles | — | Typography and effects (elevation). |

As exported on 2026-09-29, every semantic-color mode has 91 tokens and every
semantic-scale mode has 92. Mode is a file, never a name suffix: the same
name resolves differently per mode.

## Real gap or naming mistake

Run `npm run check:tokens`, then read the diff with these rules:

- **Design gap:** a token exists in one mode and not its siblings.
  `check:tokens` reports it. Report it to the Designer; never fill in the
  missing mode.
- **Misnamed alpha:** a name ends in `a` (e.g. `color-navy-100a`) but
  exports with alpha 1. `check:tokens` reports it. It is a naming mistake,
  fixed in Figma.
- **Rename, not removal:** a token disappears and another with the same
  value and type appears in the same export. Report it as a rename. It
  breaks every component that used the old name.
- **Real gap:** a component needs a role that no semantic token has in any
  mode. Report it to the Designer and stop. It is not a naming mistake, and
  a core primitive is not a substitute.
- Names come from Figma. The pipeline never renames a token.

## Numbers the exporter cannot type

The exporter writes every Figma Number variable as a px dimension. It has no
unitless type and ignores variable scopes (tested 2026-10-04). So a count
arrives as `{ "value": 12, "unit": "px" }`. `build-tokens.js` emits any
token with a `columns` segment in its name (`grid-columns-default`) as a plain
number on every platform. If a new count is added in Figma, name it with a
`columns` segment or extend that rule by pull request. It is never fixed in
`tokens/`.

## Verify the rebuild, do not assume it

A green build proves the export resolves, not that it is right.

1. `npm run build:tokens`. It must pass, and every warning is a Figma-side
   problem to report.
2. `npm run check:tokens`. It must print its pass line. Anything else goes at
   the top of the summary.
3. Count the tokens per mode file. Siblings must match.
4. Spot-check the output: pick one changed token, find it in
   `build/css/tokens.css` and, if it varies by mode, in
   `tokens-dark.css` or `tokens-back-office.css`, and confirm the new value
   arrived.
5. Summarise the change in designer language, e.g. "brand navy 600 got
   darker, `#…` → `#…`", never "line 47 changed".

## After a merged sync

Once a human merges `tokens-update`, the token re-test cron starts QA for the
affected Completed components. How the cron decides which components are
affected is not defined yet (pipeline spec, open item 5).

## Never

- Never hand-edit `tokens/` or `build/`, by any route.
- Never invent a token, fill in a missing mode, or rename a token.
- Never read a green build as proof that the export is sound.
- Never commit `build/`, or commit a token sync together with other work.
