---
name: astro-page
description: Building the whole flex-ds documentation site — Astro Starlight in docs-site/ on the astro branch — every run, never one page at a time. Generated pages come from one script over the repo at a pinned commit, the board, live Figma reads and the deployed Storybook; guides are re-read against the code; nothing is invented. Verified locally, then live, before any link is written to the board. Used by doc-generator (Job B).
---

# astro-page

Every run rebuilds the whole site from its sources. There is no "update one
page": a page edited alone drifts from the pages generated around it. A
sentence on the site is either generated from a source or written from the
repo and checked against it. **Never invent.** A missing source shows as a
notice, never as a plausible guess.

## 0. Where it lives

Read `tools.md` in this run for the folder, the branch, the Vercel project
and the production URL. Do not take them from this skill or from memory. As
this skill was written: Astro Starlight in `docs-site/`, its own npm package,
on the `astro` branch only; the Vercel docs project deploys that branch.

The site's format is the production docs URL `tools.md` records: Starlight's
layout, with the sidebar, home and component pages below.

## 1. Pin the sources

Collect every source first. Generation reads only these.

| Source | How | Written to |
| --- | --- | --- |
| The repo | The pinned commit: `origin/main` HEAD after `git fetch`, unless the owner names another. Read it from a clean detached checkout (`git worktree add --detach`), run `npm ci` and `npm run build:tokens` there. Record the full hash. | — |
| The board | Read every Components row (`registry` skill). Keep the component name, `Development`, Figma link and Production Storybook. **No record, base, table or field IDs.** | `docs-site/sources/board.json` |
| Figma | Live reads of each component's node and documentation page: properties, variants, bound variables, the usage region. Read-only. | `docs-site/sources/figma.json` |
| Storybook | The production Storybook's `index.json` (the public one in `tools.md`; staging is protected and is never embedded). | Read by the script at generation time. |

The two source files are rewritten every run, never patched. Each carries
the time it was read (UTC) and the pinned hash.

## 2. Generated, or written

| Page | Kind | Rule |
| --- | --- | --- |
| Home, All components, every component page, Tokens, Changelog, Roadmap, News | **Generated** by `docs-site/scripts/generate.mjs` | Never edited by hand. A wrong page is fixed in its source or in the script, then regenerated. |
| Every guide (Versioning, Upgrading, Designing and Developing introductions, React, React Router, Knowledge skill, Theming, FAQ, Report a bug, Request a feature, Contributing, Embedding) | **Written** from the repo | Every run, re-read each one against the code at the pinned commit and correct any sentence that stopped being true. A sentence with nothing in the repo behind it is removed, not softened. |

`generate.mjs` is the only generator. It reads the pinned checkout, the two
source files and `index.json`, and writes every generated page. It is run in
full every time.

## 3. The sidebar

Written out item by item in `astro.config.mjs`, in exactly this order. No
`autogenerate`: a missing page must fail the build, not vanish from the
navigation.

```
Get Started   Changelog, Roadmap, News, Versioning, Upgrading
Designing     Introduction
Developing    Introduction, React, React Router
Skills        Knowledge skill
Core          Components (All components, then one page per component), Tokens
Styling       Theming
Help          FAQ, Report a bug, Request a feature, Contributing, Embedding
```

**Only a component whose Development is `Completed` or `Released`, and whose
Release Verdict is `Cleared`, gets a page.** `generate.mjs` reads both from
`board.json` and writes the per-component entries from that list alone, so a
component that becomes eligible appears without a hand edit, and one that
stops being eligible (a failure status, a `Blocked` verdict) loses its page
on the next run. A component in the repo but not on the list gets no page and
no sidebar entry.

## 4. Home

A Starlight splash page.

1. **Hero**: the line is the README's first paragraph, verbatim.
2. **Buttons**, in order: Start designing (→ Designing › Introduction), Start
   coding (→ Developing › Introduction), Open Storybook (→ production
   Storybook).
3. **Latest release**: the version and its install command, from the
   package name and the latest published version (a `v*` tag at or before the
   pinned commit). No tag: the notice.
4. **Link cards**: Designing, Developing, Components, Tokens.

## 5. A component page

### Header strip

Status (`Development` from `board.json`) and the version it shipped in, then
links to its Storybook story, its Figma node and its source folder at the
pinned commit.

### Five tabs, in this order

| Tab | Content | Sources |
| --- | --- | --- |
| **Usage** | When to use; when not to, with each alternative; what each variant is for; accessibility facts; composition (what it composes, what composes it); what this version promises. | `<Name>.intent.json` (`component-intent` skill), carried over entry by entry, with **no** "Source:" line under any entry (owner, 2026-10-22; Figma sources were dropped 2026-10-20). The intent file keeps every source. EmployerProfile and JobPosition show no "When not to use" and no "What each variant is for" (owner, 2026-10-23). No "Where it goes" section (owner, 2026-10-22): composition already says what composes it, and `placement` stays in the intent file only. No "Best practice" section (owner, 2026-10-22): the intent schema has no such field, and best-practice bullets already show under when to use, when not to and each variant. Composition from the imports. |
| **Examples** | The README usage example only. **No Stories section** (owner, 2026-10-20): stories are not embedded here; each one is linked from the Design tab's variant matrix. | README. |
| **Code** | The import line; props with defaults; union types; the tokens it needs with their light and dark values. | The component's types and source, `required_tokens`, `build/css/tokens.css` and `tokens-dark.css`. **No Doc comments section** (owner, 2026-10-20). |
| **Design** | The Figma node embedded; **Storybook's props table, embedded** (owner, 2026-10-20); the variant matrix with every matrix story linked; both themes; the design gaps recorded against it. | `figma.json`, `index.json`, `docs/<name>-prop-names.md`. The props table is the component's docs entry in the production `index.json` (`<id>--docs`), embedded as `iframe.html?id=<id>--docs&viewMode=docs`. `.storybook/preview.js` sets that page to Title + ArgTypes only (wah-ag/flex-ds#206). With no docs entry, show a notice. No "Values Figma never bound" section (owner, 2026-10-22). |
| **Changelog** | `git log` for the component's folder and every subcomponent it composes, each commit marked with the version it shipped in. | Git at the pinned commit, tags. |

Which stories are variant-matrix rows is decided by one rule in
`generate.mjs`, applied the same way on Examples and Design. A story is
never on both.

## 6. The other generated pages

- **All components**: every component with a page (section 3), with its
  status and version, linked to its page.
- **Tokens**: every semantic token from `build/css/`, with its light and dark
  value. The semantic scale shows web, mobile and back-office (back-office
  and mobile marked "same as web" where they match). Names from the build,
  never typed.
  - **Mobile** has no CSS (owner, 2026-10-20: "I want semantic scales of
    mobile in documentation"). Its values come from `build/ios/Tokens.swift`,
    the one native output that carries sizes. A token is matched on its name
    with case and separators dropped (`spacing-padding-md` =
    `spacingPaddingMd`). `generate.mjs` fails if two Swift names flatten to
    the same key, or if a semantic scale token has no mobile value. Don't fill
    a missing value: report it as a design gap. The column is labelled
    "mobile (native only)", and the page says the `--` name doesn't carry
    mobile values on the web.
- **Changelog**: the releases, from tags and the commits between them.
- **Roadmap**: components without a page yet, by name and status from
  `board.json`. A name only: no link, no component page.
- **News**: releases and shipped components, from tags and the board.

Roadmap and News state no date, owner or priority that a source does not
state. A status is not a date; "next" is not a priority.

## 7. Styling

- One stylesheet maps Starlight's `--sl-*` variables onto Flex DS semantic
  tokens. It has no hex, `rgb(` or raw size of its own.
- `generate.mjs` copies `build/css/tokens.css` and `tokens-dark.css` from
  the pinned checkout into `docs-site/src/generated/`, and the copy is
  committed on `astro` with the other generated output (Vercel builds only
  `docs-site/` and cannot see `build/`). It is never edited by hand; a wrong
  value is fixed in Figma and regenerated.
- **The site is light only** (owner, 2026-10-17: "I want documentation as
  light mode not dark mode"). `docs-site/src/components/ThemeProvider.astro`
  overrides Starlight's and pins `data-theme="light"` on `<html>`, whatever
  the system theme or a stored choice says. `ThemeSelect.astro` is empty, so
  there is no theme picker. `astro.config.mjs` loads `tokens.css` only, not
  `tokens-dark.css`. Keep all three as they are on every run. This is the
  site's own chrome: component pages still show each component on-dark
  through the Storybook `theme` global (section 5), and tables still list
  on-dark values. Never branch on theme in script beyond that one pin.
- Fonts load from the Google Fonts CDN, as `CLAUDE.md` requires: the
  families `--typography-font-family-*` name, Sora and DM Sans. Never
  self-host them or install a font package.

## 8. A missing source

Keep the section in place with a notice naming exactly what is missing and
where it would come from, e.g. "No usage region on the Figma page (node
16:500)" or "No release tag yet". Never fill the gap, never drop the
section, never borrow from another component.

## 9. Verify before pushing

All green, or nothing is pushed.

1. `generate.mjs` runs in full, then `npm run build` in `docs-site/` passes
   with **zero broken internal links**.
2. `node scripts/security-check.mjs docs-site/dist` passes (`security-check`
   skill). The board source must carry no IDs.
3. Open, in the built-in browser, with the browser set to dark
   (`prefers-color-scheme: dark`): the home page; one component page, every
   tab; Tokens. Each one renders light (`data-theme="light"`, no theme
   picker), with a clean console, the fonts measured as loaded (`test` skill,
   step 3) and the live embeds showing (the Figma node and the Storybook
   props table on the Design tab).

Then commit on the `astro` branch and push it.

## 10. Verify after deploying

Wait for the Vercel deployment of that push. Then:

- Fetch every page in the sidebar on the production docs URL. Each returns
  200.
- Each component page has all five tabs, and each tab has content (a notice
  from step 8 counts as content; an empty tab does not).
- Every header link returns 200, except a Figma link to a team-only file,
  which may return 403.

## 11. Write the board

Only after step 10 is fully green, write each component's page URL to its
Astro Link column. Write only URLs you fetched in step 10.

Astro Link is doc-generator's column (`registry` skill). With Release Review
and Release Verdict = `Cleared`, it moves the component to Released. Read it
back after writing.

If any verification fails, write nothing to the board. Report what failed,
the URL and what it returned.

## Never

- Never build or deploy one page alone.
- Never give a page to a component that is not `Completed` or `Released`
  with Release Verdict `Cleared`.
- Never hand-edit a generated page. Fix the source or the script.
- Never invent a sentence, date, owner, priority, version or token name.
- Never use `autogenerate` in the sidebar.
- Never put a hex value in the site stylesheet.
- Never embed the protected staging Storybook.
- Never write a record ID into a source file or a page.
- Never print a "Source: …" line on any page, generated or written (owner,
  2026-10-22). Every sentence still needs a source in the repo; the site just
  does not show it.
- Never write the board before the live checks pass.
- Never push to `main` or `staging`; the site goes only to the `astro`
  branch.
