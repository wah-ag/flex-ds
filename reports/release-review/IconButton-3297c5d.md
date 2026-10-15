# Release review: IconButton at 3297c5d

| | |
| --- | --- |
| Component | IconButton (`src/components/IconButton/`) |
| Reviewed commit | `3297c5dcd7e76128118d7980a7f6346dc7746e3b` (`main` HEAD, "Merge pull request #145 from wah-ag/staging") |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`) |
| Reviewed at | 2026-10-15T16:55:27Z |
| **Verdict** | **Cleared**: all seven gates are open and checks 1, 3, 4, 5 and 6 pass. Check 2 gives a warning, which does not change the verdict. |

This is the first release review of IconButton. The review read a clean,
detached checkout of exactly this commit (`git worktree add --detach`, no
local changes), after `npm ci` and `npm run build:tokens`.

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/IconButton/IconButton.intent.json` exists at the commit and parses as JSON. It was last changed in `bfbc460` (#108, merged as `78838bc`). |
| 2 | Development is Completed | **Open** | Components row `recY41XhI2B34UXPx` reads `Development = Completed`. Production Storybook: `https://flex-ds-sigma.vercel.app/?path=/story/components-iconbutton--stroke-lg-idle`. Commit: `https://github.com/wah-ag/flex-ds/commit/376c4f5a3f3a73637276b1ac856df44f16cbffaa`. |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0: "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0: "✔ Modes match and every alpha token carries alpha." The reviewed commit is `main` HEAD, so `tokens/` equals `main`. Every remote token branch (`tokens-update`, `tokens-update-staging`, `component/icon-stroke-token`, `revert-64-tokens-update`, `token-runner-agent`) is an ancestor of the reviewed commit. `git diff --stat 3297c5d origin/staging` is empty. No pull request is open (`gh pr list --state open` returns `[]`). |
| 4 | Public surface decided | **Open** | The component is public. It has a Components row (`recY41XhI2B34UXPx`) and a Figma node (`45:324`), and nothing under `docs/` declares it internal. At this commit `src/index.ts` exports Avatar, ButtonCTA, CardContainer and Label (lines 15-18), not IconButton. Under the gate, that neither opens nor shuts it. |
| 5 | Names final | **Open** | `docs/icon-button-prop-names.md:11-15` maps each Figma property of node 45:324 to its prop: `category`, `state`, `swapIcon`. `IconButton.jsx:12-20` takes exactly those, plus the native pass-throughs `type`, `disabled`, `className` and `...rest`, each documented as "Not from Figma" (`docs/icon-button-prop-names.md:41-57`). No rename of a Figma property is suggested for IconButton under `docs/`. See *Gate 5: notes* below. |
| 6 | States complete | **Open** | 3 categories × 4 states = 12 Figma variant nodes (`IconButton.stories.jsx:14-18`), 12 story exports (`IconButton.stories.jsx:69-82`), and 12 linked Staging Testing rows. Total Staging Tests reads 12, and Staging Testing Results Summary reads `Passed` only. Every row's Context reads `Tested on staging 181fecc383caa46714bc25c5a881cf27bcdf750c` (the #106 rebuild merge), which is an ancestor of the reviewed commit. Since then, two changes touched the folder (`git diff --stat 181fecc 3297c5d -- src/components/IconButton`). `IconButton.jsx` dropped its CSS import in #122 (merged as `d22ee86`), which `docs/retest-waivers.md` lists as waived (owner decision, 2026-10-14). `IconButton.intent.json` was refreshed in #108 (merged as `78838bc`). That change is to the intent file only: no component code, style or story changed, and it reached `main` with the #110 ship. Focus is left out by the owner's decision (`docs/icon-button-prop-names.md:31-36`). Hover and press share their tokens in both fill categories by design (owner ruling, 2026-10-13, recorded in each fill row's Context). |
| 7 | Version meaning known | **Open** | `docs/versioning.md` exists at the commit. IconButton's class under it is **New, MINOR**, because IconButton has never been exported: `git tag -l 'v*'` is empty, and `src/index.ts` at the commit does not export it. `docs/versioning.md:26` reads: "**New**: first time it is exported. MINOR." |

### Gate 5: notes

These do not shut the gate.

- `docs/icon-button-prop-names.md:5` reads "They are proposed here for
  review." Every prop is the Figma name, so no rename is proposed. This
  review reads that as no open suggestion, as the Label review did. If the
  owner treats the line as an open proposal, gate 5 is shut and this verdict
  is Blocked.
- `docs/icon-button-prop-names.md:17-19`: the Designer should still confirm
  the exact Figma-panel spelling of `swapIcon`. No other name is proposed.

### Gate 7: the banner in `docs/versioning.md`

`docs/versioning.md:3-4` still reads "**Draft for the owner's review.**" As
in the earlier reviews, this review treats the file as the policy in force,
because a human merged it in #118. If the owner did not mean that merge as
approval, gate 7 is shut as well.

## Checks

| # | Check | Result |
| --- | --- | --- |
| 1 | Fields present | **Pass** |
| 2 | Every `dont_use_when` names an alternative | **Warning** (not a blocker) |
| 3 | `a11y` specific, not generic | **Pass** (by the owner's off-by-one ruling, see below) |
| 4 | `required_tokens` resolve | **Pass** |
| 5 | All variants covered | **Pass** |
| 6 | No two components claim the same job | **Pass** |

### Check 1: Fields present (pass)

All seven keys are present: `use_when` (1 entry), `dont_use_when` (empty),
`variant_intent` (`category`, `state`), `placement` (1), `pairs_with` (2),
`required_tokens` (21), and `a11y` (3). Every non-empty entry has a
`source`, and `use_when` is not empty. The `pairs_with` citations hold at the
commit: `NavItems.jsx:3` imports IconButton, and `CardHeader.stories.jsx:62`
renders it.

### Check 2: Every `dont_use_when` names an alternative (warning)

`dont_use_when` is empty. Figma 45:324's component description gives no
"don't" guidance, so there is no entry to name an alternative. This review
suggests none.

### Check 3: `a11y` specific, not generic (pass)

Each entry names something checkable:

- "Renders a native <button>, with type=\"button\" by default." (source: `IconButton.jsx:23`)
- "state=\"disable\" sets the native disabled attribute." (source: `IconButton.jsx:29`)
- "The icon is aria-hidden=\"true\" and focusable=\"false\", and the button renders no text; other attributes, such as aria-label, pass through to the <button>." (source: `IconButton.jsx:31`)

The code does what each entry says. Each citation is **one line off**,
because #122 removed `import './IconButton.css';` from line 2 after #108
wrote them. At the commit, `<button` is at line 22 (`type={type}` at 24),
`disabled={state === 'disable' || …}` is at line 28, and the icon with both
attributes is at line 30.

On 2026-10-15 the owner ruled, for ButtonCTA's citations shifted by the same
#122 change: "The a11y citations being one line off doesn't fail check 3."
This review applies that ruling here, because the cause and the shift are
the same. If the owner meant the ruling for ButtonCTA only, check 3 fails,
the verdict is Blocked, and the finding goes to doc-generator (Job A) to
re-transpose.

### Check 4: `required_tokens` resolve (pass)

- The `var(--…)` references in `IconButton.css` give 21 unique tokens, and `IconButton.jsx` references none. `required_tokens` lists 21. The two sets are identical (`diff` is empty).
- All 21 are defined in `build/css/*.css` at the commit.

### Check 5: All variants covered (pass)

The code accepts two variant props: `category` (`stroke`, `default-fill`,
`error-fill`) and `state` (`idle`, `hover`, `press`, `disable`). Every value
is a key in `variant_intent`.

All four `state` values have a `null` meaning, which counts as covered. Figma
gives no per-state intent.

The three `category` keys carry the same text, paragraph 2 of the Figma 45:324
description: "it serves as three category, stroke icon button is to be used
in header and fill icon button for table rows actions."

These props are not counted as variant props: `swapIcon` (instance swap),
and `type`, `disabled`, `className` and `...rest` (DOM pass-throughs,
`docs/icon-button-prop-names.md:41-57`).

### Check 6: No two components claim the same job (pass)

IconButton has one `use_when` entry: "it serves as icon button and use in
header, back office table row actions" (`Figma 45:324 (IconButton component
description, paragraph 1)`). These are the nearest entries in other intent
files, and none of them is a finding:

- NavItems: "call to action from user like help, notification and messages together with user profile" (`Figma 58:406 (Header/NavItems component description, paragraph 1)`)

  NavItems composes IconButton (`NavItems.jsx:3`, and IconButton's
  `pairs_with`). It is the header group that holds IconButtons, not a rival
  for the single button.

- ShotAction: "it can be used as toggle button on job listings card for actions like favorite, saved" (`Figma 31:191 (ShotAction component description, paragraph 1)`)

  ShotAction is a toggle on job-listing cards. IconButton is for the header
  and back-office table rows.

- BtnGroup: "button group for user action, save toggle button and share button is for external link sharing" (`Figma 32:573 (CardContent/BtnGroup component description, paragraph 1)`)

  BtnGroup is a card's group of save and share buttons, not a single icon
  button in a header or table row.

## What each owner is waiting on

- **Owner** (check 3, informational): this review applied the 2026-10-15
  off-by-one ruling for ButtonCTA to IconButton's three a11y citations,
  shifted by the same #122 change.
- **Owner** (check 2, warning only, does not block): `dont_use_when` is
  empty. Figma 45:324 gives no "don't" guidance.
- **Owner** (gate 7, informational): the banner in `docs/versioning.md` still
  calls the file a draft.
- **Developer**, once this report is merged and the verdict is written: add
  IconButton to `src/index.ts`. IconButton is Cleared at `3297c5d`.
