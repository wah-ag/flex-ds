# Release review: ButtonCTA at 376c4f5

| | |
| --- | --- |
| Component | ButtonCTA (`src/components/ButtonCTA/`) |
| Reviewed commit | `376c4f5a3f3a73637276b1ac856df44f16cbffaa` (`main` HEAD, "Merge pull request #125 from wah-ag/staging") |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`, `"private": true`) |
| Reviewed at | 2026-10-15T09:41:53Z |
| **Verdict** | **Cleared**: all seven gates are open and checks 1, 3, 4, 5 and 6 pass. Check 2 gives a warning, which does not change the verdict. |

## Why a new review

The previous review, `reports/release-review/ButtonCTA-a25043e.md` (Cleared
at `a25043e`, merged in #121 as `2379db3`), cannot be resumed from. Since
`a25043e`, the component's folder changed: `git diff --stat a25043e 376c4f5 --
src/components/ButtonCTA` reads `ButtonCTA.jsx | 1 -`. Commit `a91a822`
(merged into `staging` in #122 as `d22ee86`) removed line 2,
`import './ButtonCTA.css';`. The stylesheet now loads from `src/styles.css:8`
(`@import './components/ButtonCTA/ButtonCTA.css';`). This review replaces
nothing. It is a fresh review at the new commit.

The review read a clean, detached checkout of exactly this commit
(`git worktree add --detach`, no local changes), after `npm ci` and
`npm run build:tokens`.

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/ButtonCTA/ButtonCTA.intent.json` exists at the commit and parses as JSON (`JSON.parse`). It is unchanged since `a25043e`: `git diff --stat a25043e 376c4f5 -- 'src/**/*.intent.json'` is empty. |
| 2 | Development is Completed | **Open** | Components row `recxAh3Dd401nLLVr` reads `Development = Completed`. Production Storybook: `https://flex-ds-sigma.vercel.app/?path=/story/components-buttoncta--primary-lg-idle`. Commit: `https://github.com/wah-ag/flex-ds/commit/376c4f5a3f3a73637276b1ac856df44f16cbffaa`, which is the reviewed commit. |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0: "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0: "✔ Modes match and every alpha token carries alpha." The reviewed commit is `main` HEAD, so `tokens/` equals `main`. `git diff --stat HEAD origin/tokens-update -- tokens/` (`origin/tokens-update` at `bf5f961`) and `git diff --stat HEAD origin/staging -- tokens/` (`origin/staging` at `c776d1d`) are both empty, so no token sync is waiting to merge. |
| 4 | Public surface decided | **Open** | The component is public. It has a Components row (`recxAh3Dd401nLLVr`) and a Figma node (`16:438`), and nothing under `docs/` declares it internal. At this commit `src/index.ts:15` reads `export { ButtonCTA } from './components/ButtonCTA/ButtonCTA';`, added in `0e8484a` (#123) after the Cleared verdict at `a25043e`. |
| 5 | Names final | **Open** | `docs/button-cta-prop-names.md:6-14` maps every Figma property of node 16:438 to its prop: `category`, `size`, `state`, `buttonLabel`, `leadingIcon`, `trailingIcon`, `swapIcon`. `ButtonCTA.jsx:10-21` takes those, plus `type` (documented at `docs/button-cta-prop-names.md:16-24` as the HTML attribute), `className` and a `...rest` spread onto the `<button>` (`ButtonCTA.jsx:19-20,26`). No rename suggestion for ButtonCTA is open under `docs/`. See *Gate 5: pass-through props* below. |
| 6 | States complete | **Open** | The Figma matrix is 2 categories × 3 sizes × 6 states = 36 variant nodes (`ButtonCTA.stories.jsx:8-21`). There are 36 story exports (`grep -c "^export const"` gives 36). There are 36 linked Staging Testing rows, one for each of the 36 `category; size; state` combinations, and all 36 read `Passed`. Every row's Context reads `Tested on staging 65ff1ac83965620f855b99f42be3682f245beca1`, which is an ancestor of the reviewed commit. Since then, two things changed under the folder (`git diff --stat 65ff1ac 376c4f5 -- src/components/ButtonCTA`): the intent file was added, and the CSS import line was removed in #122 (`d22ee86`). `docs/retest-waivers.md` lists `d22ee86` as waived for retest (owner decision, 2026-10-14). The file was merged into `staging` by `wah-ag` in #124 and reached `main` in #125. |
| 7 | Version meaning known | **Open** | `docs/versioning.md` exists at the commit. ButtonCTA's class under it is **New, MINOR**, because ButtonCTA is exported for the first time. `git tag -l 'v*'` is empty, so no version has been published or tagged. `src/index.ts:15` is the first export of the component. `docs/versioning.md:26` reads: "**New**: first time it is exported. MINOR.". `docs/versioning.md:16` gives "A new component exported from `src/index.ts`." as a MINOR example. Removing the CSS import does not change the class, because there is no earlier tag to compare against. |

### Gate 5: pass-through props

`className` and the `...rest` spread are not Figma properties, and
`docs/button-cta-prop-names.md` does not document them, though it does
document `type`. They are standard React and DOM pass-throughs, not renames of
a Figma property. No Figma name is changed and no rename suggestion is open,
so the gate's condition holds. This was already so at `a25043e`: the only
change to `ButtonCTA.jsx` since then is the removed import. The prior review
listed only `type` and did not mention them. That omission is corrected here.

On 2026-10-14 the owner ruled, in conversation, that ButtonCTA publishes with
`className` as it is, typed as required in the generated `dist/index.d.ts`
because it has no default: "publish with current name and fix it later". That
ruling is not recorded under `docs/`. This review does not rely on it to open
the gate. It is recorded here so that DevOps's version proposal and the owner
both see the open item.

### Gate 7: the banner in `docs/versioning.md`

`docs/versioning.md:3-4` still reads "**Draft for the owner's review.** …
It counts only once a human has merged it." That condition was met in #118
(merged by `wah-ag`). As in the previous review, this review reads the file as
the policy in force. If the owner did not mean that merge as approval, gate 7
should be read as shut and this verdict as Blocked.

The policy still does not say whether the first publish is `0.1.0` itself or
a MINOR bump from it (`0.2.0`). That is DevOps's proposal and the owner's
approval, and it does not affect ButtonCTA's class.

## Checks

| # | Check | Result |
| --- | --- | --- |
| 1 | Fields present | **Pass** |
| 2 | Every `dont_use_when` names an alternative | **Warning** (not a blocker) |
| 3 | `a11y` specific, not generic | **Pass** (with stale line citations, see below) |
| 4 | `required_tokens` resolve | **Pass** |
| 5 | All variants covered | **Pass** |
| 6 | No two components claim the same job | **Pass** |

### Check 1: Fields present (pass)

All seven keys are present: `use_when` (6 entries), `dont_use_when` (8),
`variant_intent` (`category`, `size`, `state`), `placement` (1), `pairs_with`
(4), `required_tokens` (37), and `a11y` (3). Every non-empty entry has a
`source`, and `use_when` is not empty.

### Check 2: Every `dont_use_when` names an alternative (warning)

None of the eight entries names what to use instead, either as a component
(by folder name) or as a variant. All eight come from
`Figma 17:826 (Buttons Doc Frame › Don’t, text I17:826;2406:416;17:819)`:

1. "Don’t use multiple Primary buttons together when one clear primary action is sufficient."
2. "Don’t use a Primary button for secondary or less important actions."
3. "Don’t use Secondary buttons when the action is the main focus of the screen."
4. "Don’t mix different button sizes within the same action group without a clear purpose."
5. "Don’t use buttons for navigation when a link is more appropriate."
6. "Don’t use overly long button labels that make the button difficult to scan or fit within the layout."
7. "Don’t use button styles inconsistently across similar actions or screens."
8. "Don’t remove or alter the button’s required interaction states, such as hover, pressed, focus, or disabled."

This review suggests no alternatives.

### Check 3: `a11y` specific, not generic (pass, stale citations)

Each entry names something checkable, and the code at the commit does what
the entry says:

- "Renders a native <button>, with type=\"button\" by default." (source: `src/components/ButtonCTA/ButtonCTA.jsx:26`). At the commit, `<button` is at line 25, the default `type = 'button'` is at line 18, and it is applied at line 27.
- "state=\"disable\" sets the native disabled attribute." (source: `src/components/ButtonCTA/ButtonCTA.jsx:34`). At the commit, `disabled={state === 'disable'}` is at line 33.
- "The icons are aria-hidden=\"true\" and focusable=\"false\"; the visible text is buttonLabel." (source: `src/components/ButtonCTA/ButtonCTA.jsx:23`). At the commit, the icon with both attributes is at line 22, and `buttonLabel` renders at line 36.

**Stale citations.** All three sources name a line that, at this commit, no
longer holds the evidence. Line 26 is `{...rest}`, line 34 is `>`, and line 23
is blank. Removing the import at line 2 in #122 moved every line up by one.
The cited lines were correct at `a25043e`. The behaviour each entry describes
is unchanged and true, so the entries stay specific and checkable, and the
check passes. The intent file is now out of step with the code it cites. The
docs site will show these citations unless the intent is re-transposed. The
owner decides whether to start doc-generator Job A for it. If the owner reads
a wrong source line as a failed check 3, this verdict is Blocked, and the
finding belongs to doc-generator (Job A).

The `placement` and `pairs_with` citations were re-read at the commit and are
correct: `BtnGroup.jsx:2`, `ShotAction.jsx:2` and `TakeAction.jsx:2` each
import ButtonCTA, and `CardItem.stories.jsx:20` renders it.

### Check 4: `required_tokens` resolve (pass)

- The `var(--…)` references in `ButtonCTA.css` and `ButtonCTA.jsx` give 37 unique tokens, and `required_tokens` lists 37. The two sets are identical: no token is used without being listed, and none is listed without being used.
- All 37 are defined in `build/css/*.css` at the commit.

### Check 5: All variants covered (pass)

The code accepts three variant props. They are `category` (`primary`,
`secondary`), `size` (`lg`, `md`, `sm`) and `state` (`idle`, `hover`, `press`,
`focus`, `disable`, `error`), from `ButtonCTA.jsx:11-13,28,31-33`. The CSS
selectors `.button-cta--{primary,secondary,lg,md,sm}`,
`[data-state='{hover,press,focus}']` and
`[data-tone='{brand,danger,disabled}']` in `ButtonCTA.css` back them. Every
value is a key in `variant_intent`.

These meanings are `null`, which counts as covered (there is no Figma text):
`size.lg`, `size.md`, `size.sm`, `state.idle`, `state.hover`, `state.press`,
`state.focus`, `state.disable`, `state.error`.

These props are not counted as variant props: `buttonLabel` (Figma text),
`leadingIcon` and `trailingIcon` (Figma booleans), `swapIcon` (Figma instance
swap), and `type`, `className` and `...rest` (DOM pass-throughs).

### Check 6: No two components claim the same job (pass)

ButtonCTA's six `use_when` entries were compared with every `use_when` entry
in the other 19 intent files at the commit. No intent file has changed since
`a25043e`. ButtonCTA's entries are all guidance on how to use a button
(labels, size, style consistency, variant choice, interaction states,
spacing). None of them describes a situation that another component's
`use_when` also claims. These are the nearest entries:

- ButtonCTA: "Use the appropriate size based on the context and layout." (`Figma 17:826 (Buttons Doc Frame › Do, text I17:826;2406:461;17:822)`)
- Avatar: "Use the appropriate size based on the context and layout." (`Figma 69:2101 (Avatar Doc Frame › Do, text I69:2101;2406:461;69:2097)`)

The wording is identical, but each entry is about choosing a size within its
own component. Neither describes a situation where a reader would choose one
component over the other.

- IconButton: "it serves as icon button and use in header, back office table row actions" (`Figma 45:324 (IconButton component description, paragraph 1)`)
- ShotAction: "it can be used as toggle button on job listings card for actions like favorite, saved" (`Figma 31:191 (ShotAction component description, paragraph 1)`)
- BtnGroup: "button group for user action, save toggle button and share button is for external link sharing" (`Figma 32:573 (CardContent/BtnGroup component description, paragraph 1)`)

These name specific situations: icon-only actions, a toggle, and a card's
action group. No ButtonCTA `use_when` entry names any of them. Not a finding.

## What each owner is waiting on

- **Owner** (check 3, informational): the three `a11y` source citations in `ButtonCTA.intent.json` are one line off at this commit, after #122. The text is true. Re-transposing is doc-generator Job A, if the owner wants it before the docs site is built.
- **Owner** (check 2, warning only, does not block): none of the eight `dont_use_when` entries in Figma 17:826 names an alternative. They are listed above.
- **Owner** (gate 5, informational): `className` and the `...rest` pass-through are not documented in `docs/button-cta-prop-names.md`. The 2026-10-14 ruling to publish `className` typed as required is not recorded under `docs/`.
- **Owner** (gate 7, informational): the banner in `docs/versioning.md` still calls the file a draft. Whether the first publish is `0.1.0` or `0.2.0` is DevOps's proposal and the owner's approval.
- No shut gate and no failed blocker check. Next, after this report is merged: ButtonCTA is already exported on `main` (`src/index.ts:15`), so DevOps packages it.
