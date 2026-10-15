# Release review: Label at c43f0ac

| | |
| --- | --- |
| Component | Label (`src/components/Label/`) |
| Reviewed commit | `c43f0ac65e700d98609c32d2e543112f3f3022d7` (`main` HEAD, "Merge pull request #136 from wah-ag/staging") |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`) |
| Reviewed at | 2026-10-15T15:58:56Z |
| **Verdict** | **Blocked**: check 4 (`required_tokens` resolve) and check 5 (all variants covered) fail. Both have the same cause: `Label.intent.json` was written in `8a1d3b2` (#105), before #109 added the `normal` category, and it has not changed since. All seven gates are open, and checks 1, 3 and 6 pass. Check 2 gives a warning, which does not change the verdict. |

This is the first release review of Label. No earlier report exists under
`reports/release-review/` on `staging` or `main`, and the Components row's
Release Review and Release Verdict were empty.

The review read a clean, detached checkout of exactly this commit
(`git worktree add --detach`, no local changes), after `npm ci` and
`npm run build:tokens`.

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/Label/Label.intent.json` exists at the commit and parses as JSON (`JSON.parse`). It was added in `8a1d3b2` (#105) and has not changed since. Its content is stale (checks 4 and 5), but the gate asks only that the file exists and parses. |
| 2 | Development is Completed | **Open** | Components row `recJT1qUZNUEfHBDg` reads `Development = Completed`. Production Storybook: `https://flex-ds-sigma.vercel.app/?path=/story/components-label--normal-md-idle`. Design reads `Done`. |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0: "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0: "✔ Modes match and every alpha token carries alpha." The reviewed commit is `main` HEAD, so `tokens/` equals `main`. Every remote token branch (`tokens-update`, `tokens-update-staging`, `component/icon-stroke-token`, `revert-64-tokens-update`, `token-runner-agent`) is an ancestor of the reviewed commit. `origin/staging` (`d08933b`) differs from the commit only in `reports/release-review/CardContainer-c43f0ac.md` and `src/index.ts`, not in `tokens/`. No pull request is open (`gh pr list --state open` returns `[]`). |
| 4 | Public surface decided | **Open** | The component is public. It has a Components row (`recJT1qUZNUEfHBDg`) and a Figma node (`31:228`), and nothing under `docs/` declares it internal. At this commit `src/index.ts` exports Avatar and ButtonCTA (lines 15-16), not Label. Under the gate, that neither opens nor shuts it. |
| 5 | Names final | **Open** | `docs/label-prop-names.md:7-14` maps each Figma property of node 31:228 to its prop: `category` → `category`, `size` → `size`, `state` → `state`, label text → `labelText`, show icon → `showIcon`, the icon's instance swap → `swapIcon`. `Label.jsx:15-24` takes exactly those, plus `className` and `...rest`. Each prop is the Figma name or its literal camelCase, the ButtonCTA convention (`docs/button-cta-prop-names.md`). No rename of a Figma property is suggested for Label under `docs/`. See *Gate 5: notes* below. |
| 6 | States complete | **Open** | Figma's matrix is 6 categories (`brand`, `info`, `success`, `error`, `warning`, `normal`) × 3 sizes (`lg`, `md`, `sm`) × 2 states (`idle`, `hover`) = 36 variant nodes, listed one per cell in `Label.stories.jsx:7-26`. There is one story export for each cell (`Label.stories.jsx:74-114`, 36 exports). There are 36 linked Staging Testing rows, one per cell, and all 36 read `Passed`. Every row's Context reads `Tested on staging 2833e7fdab0c689503bb8960b0ce36c3acb7ecd7`, the merge of #109 (the `normal` category). `2833e7f` is an ancestor of the reviewed commit. Since then, the only change under the folder (`git diff --stat 2833e7f c43f0ac -- src/components/Label`) is `Label.jsx` dropping `import './Label.css';` (`a91a822`, #122, merged as `d22ee86`). The stylesheet now loads from `src/styles.css`. `docs/retest-waivers.md` lists `d22ee86` as waived for retest (owner decision, 2026-10-14). Press, focus, disabled and error are not designed. They are left out by the owner's decision of 2026-10-03 (`docs/label-prop-names.md:21-31`). |
| 7 | Version meaning known | **Open** | `docs/versioning.md` exists at the commit. Label's class under it is **New, MINOR**, because Label has never been exported: `git tag -l 'v*'` is empty, and `src/index.ts` at the commit does not export it. `docs/versioning.md:26` reads: "**New**: first time it is exported. MINOR." The `normal` category (#109) is not a separate change, because no published version ever exposed Label. |

### Gate 6: the lg rows ruling

The owner ruled on 2026-10-09 that Label's 10 lg rows tested on `e3654f1`
stand as Passed after #77 with no retest. That ruling is not needed here:
every row, lg included, was retested after #109 and names `2833e7f` as its
tested commit.

### Gate 5: notes

These do not shut the gate. They are recorded so the owner sees them.

- `docs/label-prop-names.md:5` reads "They are proposed here for review."
  Every prop is the Figma name or its literal camelCase, so no rename is
  proposed. This review reads that as no open suggestion. If the owner treats
  the line as an open proposal, gate 5 is shut and this verdict stays Blocked
  on it as well.
- `docs/label-prop-names.md:16-19`: the exact Figma-panel spelling of
  `labelText`, `showIcon` and `swapIcon` "should be confirmed by the
  Designer". No other name is proposed.
- `docs/label-prop-names.md:33-43`: the default icon (`Circle`) and
  `brand` → `secondary` colour role await the Designer's confirmation. Neither
  is a name.

### Gate 7: the banner in `docs/versioning.md`

`docs/versioning.md:3-4` still reads "**Draft for the owner's review.**" As
in the ButtonCTA, Avatar and CardContainer reviews, this review reads the file
as the policy in force, because a human merged it in #118. If the owner did
not mean that merge as approval, gate 7 is shut as well.

## Checks

| # | Check | Result |
| --- | --- | --- |
| 1 | Fields present | **Pass** |
| 2 | Every `dont_use_when` names an alternative | **Warning** (not a blocker) |
| 3 | `a11y` specific, not generic | **Pass** (off-by-one citations, see below) |
| 4 | `required_tokens` resolve | **Fail** (four tokens the code uses are not listed) |
| 5 | All variants covered | **Fail** (`category.normal` is not a key) |
| 6 | No two components claim the same job | **Pass** |

### Check 1: Fields present (pass)

All seven keys are present: `use_when` (7 entries), `dont_use_when` (6),
`variant_intent` (`category`, `size`, `state`), `placement` (empty),
`pairs_with` (2), `required_tokens` (32), and `a11y` (2). Every non-empty
entry has a `source`, and `use_when` is not empty.

The `pairs_with` citations were re-read at the commit and are correct:
`DescriptionItem.jsx:3` and `JobPosition.jsx:2` each import Label.

### Check 2: Every `dont_use_when` names an alternative (warning)

None of the six entries names what to use instead, either as a component
(by folder name) or as a variant. All six come from
`Figma 71:2279 (Label Doc Frame › Don’t, text I71:2279;2406:416;71:2278)`:

1. "Don’t use labels for long sentences or large amounts of information."
2. "Don’t use too many labels within a single component or section."
3. "Don’t use color as the only way to communicate meaning."
4. "Don’t mix inconsistent sizes, styles, or shapes for labels with the same purpose."
5. "Don’t use labels as buttons unless they are designed and documented as interactive."
6. "Don’t use decorative labels that do not provide meaningful information."

This review suggests no alternatives.

### Check 3: `a11y` specific, not generic (pass, off-by-one citations)

Each entry names something checkable, and the code at the commit does what
the entry says:

- "Renders a <span> with no role or aria attributes of its own." (source: `src/components/Label/Label.jsx:25`). At the commit, `<span` is at line 26. It gets `{...rest}` (line 27), `className` (lines 28-30) and `data-state` (line 31), and no `role` or `aria-*` of its own.
- "The icon is aria-hidden=\"true\" and focusable=\"false\"." (source: `src/components/Label/Label.jsx:33`). At the commit, the icon with both attributes is at line 34.

**Off-by-one citations.** Both sources are one line off. At `8a1d3b2`, when
the intent was written, the `<span` was at line 25 and the icon at line 33.
Since then, #109 added two comment lines (`Label.jsx:5-6`) and #122 removed
the CSS import, a net shift of one line. The element markup is unchanged
(`git diff 8a1d3b2 c43f0ac -- src/components/Label/Label.jsx` touches only
the import and the comment). Under the owner's ruling of 2026-10-15
(off-by-one citations pass check 3 when the behaviour is unchanged), the check
passes. A Job A re-transpose for checks 4 and 5 would refresh these as well.

### Check 4: `required_tokens` resolve (fail)

- The `var(--…)` references in `Label.css` and `Label.jsx` give 36 unique tokens, not counting the component's own `--label-icon-color` custom property (defined at `Label.css:62,72,82,92,102,116`). `required_tokens` lists 32.
- All 32 listed tokens are defined in `build/css/*.css` at the commit. None is listed without being used.
- **Used but not listed** (all four from the `normal` category, `Label.css:115-123`, added by #109):
  - `--background-neutral-disable` (`Label.css:122`)
  - `--background-neutral-surface` (`Label.css:117`)
  - `--icon-neutral-primary` (`Label.css:116`)
  - `--text-neutral-primary` (`Label.css:118`)

  All four resolve: each is defined in `build/css/tokens.css` and
  `build/css/tokens-dark.css`. The code is sound; the intent is stale.

### Check 5: All variants covered (fail)

The code accepts three variant props:

- `category`: `brand`, `info`, `success`, `error`, `warning`, `normal` (`Label.jsx:5-6,16`; `.label--{brand,info,success,error,warning,normal}` at `Label.css:61-123`; story control at `Label.stories.jsx:45`).
- `size`: `lg`, `md`, `sm` (`Label.jsx:17`; `Label.css:18-31`).
- `state`: `idle`, `hover` (`Label.jsx:18`; `docs/label-prop-names.md:21-31`).

`variant_intent.category` has keys `brand`, `info`, `success`, `error` and
`warning`. **`normal` is missing.** Every `size` and `state` value is a key.

These meanings are `null`, which counts as covered (there is no Figma text):
`category.brand`, `category.info`, `category.success`, `category.error`,
`category.warning`, `size.lg`, `size.md`, `size.sm`, `state.idle`,
`state.hover`.

These props are not counted as variant props: `labelText` (text),
`showIcon` (boolean), `swapIcon` (instance swap), and `className` and
`...rest` (DOM pass-throughs).

### Check 6: No two components claim the same job (pass)

Label's seven `use_when` entries were compared with every `use_when` entry in
the other 19 intent files at the commit. These are the nearest:

- Label: "Use labels to provide short, meaningful contextual information." (`Figma 71:2279 (Label Doc Frame › Do, text I71:2279;2406:461;71:2275)`)
- NavLabel: "used as a header navigation label" (`Figma 55:34 (Header/NavLabel component description, paragraph 1, first clause)`)

NavLabel's entry is header navigation; Label's is contextual information on
content. They share a word, not a situation. Not a finding.

- Label: "Keep label text concise and easy to scan." (Figma 71:2279, as above)
- TextField and PasswordField: "Keep labels, helper text, and validation messages concise and clear." (`Figma 71:2194 (Input Field Doc Frame › Do, text I71:2194;2406:461;71:2190)`)

The input fields' "labels" are their own field labels, not the Label
component. Not a finding.

- Label: "Maintain consistent padding, height, typography, and spacing." (Figma 71:2279, as above)
- CardContainer: "Maintain consistent spacing, padding, and alignment across similar cards." (`Figma 69:1498 (Cards Doc Frame › Do, text I69:1498;2406:461;69:1495)`)

Each entry is about consistency within its own component, not a choice
between the two. Not a finding.

- Label: "Use the appropriate variant to communicate different meanings or statuses." (Figma 71:2279, as above)
- ButtonCTA: "Use the correct usage variant for the intended interaction and context." (`Figma 17:826 (Buttons Doc Frame › Do, text I17:826;2406:461;17:822)`)

Each is about choosing a variant within its own component. Not a finding.

## What each owner is waiting on

- **doc-generator, Job A** (checks 4 and 5, blockers): re-transpose
  `src/components/Label/Label.intent.json` at the current code. Add
  `category.normal` to `variant_intent`, and add `--background-neutral-disable`,
  `--background-neutral-surface`, `--icon-neutral-primary` and
  `--text-neutral-primary` to `required_tokens`. The `a11y` citations
  (`Label.jsx:25`, `:33`) are now at lines 26 and 34. Job A's pull request goes
  into `staging`, and a human merges it. After it reaches `main`, a new
  "release Label" reviews it again.
- **Owner** (check 2, warning only, does not block): none of the six
  `dont_use_when` entries in Figma 71:2279 names an alternative.
- **Owner** (gate 7, informational): the banner in `docs/versioning.md` still
  calls the file a draft.
