# Release review: CardContainer at c43f0ac

| | |
| --- | --- |
| Component | CardContainer (`src/components/CardContainer/`) |
| Reviewed commit | `c43f0ac65e700d98609c32d2e543112f3f3022d7` (`main` HEAD, "Merge pull request #136 from wah-ag/staging") |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`) |
| Reviewed at | 2026-10-15T15:45:17Z |
| **Verdict** | **Cleared**. All seven gates are open, and checks 1, 3, 4, 5 and 6 pass. Check 2 gives a warning, which does not change the verdict. |

This is the third release review of CardContainer. The earlier two were:

- `64ed84e` (`CardContainer-64ed84e.md`, PR #130, merged as `4658046`): Blocked on gate 5 (`card slot` naming). The owner's 2026-10-15 ruling fixed it (`cardSlot`, #131).
- `a864dd8` (`CardContainer-a864dd8.md`, PR #133, merged as `acf9503`): Blocked on check 3 only. The `a11y` source `CardContainer.jsx:28` no longer pointed at the `<div>` it describes.

Since `a864dd8`, `git diff --stat a864dd8 c43f0ac` shows three files changed:

- the `a864dd8` report;
- `docs/retest-waivers.md` (#135, the `ec348a9` waiver);
- `CardContainer.intent.json` (#134, merged as `ec348a9`). One line changed, the `a11y` source `CardContainer.jsx:28` → `CardContainer.jsx:31-34`.

No component code, style or story changed.

The review read a clean, detached checkout of exactly this commit
(`git worktree add --detach`, no local changes), after `npm ci` and
`npm run build:tokens`.

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/CardContainer/CardContainer.intent.json` exists at the commit and parses (`JSON.parse`). Last changed in #134 (`ec348a9`). |
| 2 | Development is Completed | **Open** | Components row `rec1y6kyai6F3FVWv` reads `Development = Completed`. Production Storybook: `https://flex-ds-sigma.vercel.app/?path=/story/components-cardcontainer--idle`. Commit: `https://github.com/wah-ag/flex-ds/commit/c43f0ac65e700d98609c32d2e543112f3f3022d7`. |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0 with "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0 with "✔ Modes match and every alpha token carries alpha." The reviewed commit is `origin/main` HEAD, so `tokens/` equals `main`. `git diff --stat c43f0ac origin/staging` is empty (`origin/staging` is at `d036081`, same tree). Every remote token branch is an ancestor of the reviewed commit: `tokens-update`, `tokens-update-staging`, `component/icon-stroke-token`, `revert-64-tokens-update` and `token-runner-agent`. No pull request is open (`gh pr list --state open` returns `[]`). |
| 4 | Public surface decided | **Open** | The component is public. It has a Components row (`rec1y6kyai6F3FVWv`) and a Figma node (`36:158`), and nothing under `docs/` declares it internal. At this commit `src/index.ts` exports Avatar and ButtonCTA (lines 15-16), not CardContainer. Under the gate, that neither opens nor shuts it. |
| 5 | Names final | **Open** | `docs/card-container-prop-names.md:10-13` maps Figma `state` → `state` and `card slot` → `cardSlot`. Lines 17-21 record the owner's decision: "Owner ruling 2026-10-15: `card slot` → `cardSlot` …". The code matches: `export function CardContainer({ state = 'idle', cardSlot, className, ...props })` (`CardContainer.jsx:24`), and `{cardSlot}` is rendered at line 36. No open suggestion remains for this component under `docs/`. |
| 6 | States complete | **Open** | Figma's matrix is `state=idle` (36:157), `state=hover` (36:159) and `state=active` (36:169) (`docs/card-container-prop-names.md:3-5`). Story exports: `Idle`, `Hover`, `Active` (`CardContainer.stories.jsx:83-85`), plus `Tokens`. The three linked Staging Testing rows (`CardContainer / idle`, `/ hover`, `/ active`) all read `Passed`, with Context `Tested on staging 6a0f5ddb8e4586372d3f05007ce81577096a9a35`. `6a0f5dd` is an ancestor of the reviewed commit. `git diff --stat 6a0f5dd c43f0ac -- src/` lists only `CardContainer.intent.json`, the one-line citation change from `ec348a9`. That change is not tested code, and it is waived in `docs/retest-waivers.md:37`. Focus, pressed and disabled are left out by the owner's ruling of 2026-10-04 (`docs/card-container-prop-names.md:55-56`). |
| 7 | Version meaning known | **Open** | `docs/versioning.md` exists at the commit. CardContainer's class is **New, MINOR**: `git tag -l 'v*'` is empty, and `src/index.ts` does not export it. `docs/versioning.md:26` reads "**New**: first time it is exported. MINOR." The `children` → `cardSlot` rename is not a separate breaking change, because no published version ever exposed `children`. |

### Gate 7: the banner in `docs/versioning.md`

`docs/versioning.md:3` still reads "**Draft for the owner's review.**" As in
the earlier reviews, this review treats the file as the policy in force,
because a human merged it in #118. If the owner did not mean that merge as
approval, gate 7 is shut.

## Checks

| # | Check | Result |
| --- | --- | --- |
| 1 | Fields present | **Pass** |
| 2 | Every `dont_use_when` names an alternative | **Warning** (not a blocker) |
| 3 | `a11y` specific, not generic | **Pass** |
| 4 | `required_tokens` resolve | **Pass** |
| 5 | All variants covered | **Pass** |
| 6 | No two components claim the same job | **Pass** |

### Check 1: Fields present (pass)

All seven keys are present:

- `use_when` (6 entries, so not empty)
- `dont_use_when` (7)
- `variant_intent` (`state`)
- `placement` (empty)
- `pairs_with` (empty)
- `required_tokens` (10)
- `a11y` (1)

Every non-empty entry has a `source`.

### Check 2: Every `dont_use_when` names an alternative (warning)

Unchanged from the earlier reviews. None of the seven entries names what to
use instead. All seven come from
`Figma 69:1498 (Cards Doc Frame › Don’t, text I69:1498;2406:416;69:1488)`:

1. "Don’t scroll within a card to reveal information."
2. "Don’t use multiple competing CTAs within a single card."
3. "Card shouldn’t contain that can be swiped, such as image carousel or pagination. Also, swipe gestures shouldn’t cause portions of cards to detach upon swiping."
4. "Don’t create inconsistent card sizes, spacing, or layouts for similar content."
5. "On a mobile device, cards can’t internally scroll, as it could use two scroll bars to be displayed."
6. "Don’t make the entire card clickable unless the whole card represents a single action."
7. "Don’t let cards bump other elements out of the way. When a card is picked up, it appears in front of all elements, except app bars and navigation."

This review suggests no alternatives.

### Check 3: `a11y` specific, not generic (pass)

The one entry:

- "Renders a <div> with no role or aria attributes; `state` is set only as data-state." (source: `src/components/CardContainer/CardContainer.jsx:31-34`)

It names something checkable: the element, the absence of `role` and `aria-*`, and the `data-state` attribute. The source now points at that code. At the commit, `CardContainer.jsx:31` is `<div`, line 32 is `{...rest}`, line 33 is the `className` join, and line 34 is `data-state={look}`. The element has no `role` or `aria-*` of its own. The `a864dd8` finding is resolved.

### Check 4: `required_tokens` resolve (pass)

- The `var(--…)` references in `CardContainer.css` and `CardContainer.jsx` give 10 unique tokens, not counting the component's own `--card-container-*` custom properties. `required_tokens` lists 10. The two sets are identical (`diff` is empty).
- All 10 are defined in `build/css/*.css` at the commit:
  - `--background-neutral-base`, `--border-interactive-brand-idle` and `--border-neutral-base` are in `tokens.css` and `tokens-dark.css`.
  - `--border-radius-card`, `--border-width-default`, `--border-width-selected`, `--spacing-gap-xs`, `--spacing-padding-lg` and `--spacing-padding-md` are in `tokens.css` and `tokens-back-office.css`.
  - `--elevation-level-1` is in `tokens.css`.

### Check 5: All variants covered (pass)

The code accepts one variant prop, `state` (`idle`, `hover`, `active`;
`CardContainer.jsx:22,24,28`). Every value is a key in `variant_intent`.

These meanings are `null`, which counts as covered (there is no Figma text):
`state.idle`, `state.hover`, `state.active`.

These props are not counted as variant props: `cardSlot` (a slot), and `className` and `...rest` (DOM pass-throughs).

### Check 6: No two components claim the same job (pass)

The only intent change since `a864dd8` is CardContainer's `a11y` source
(`git diff --stat a864dd8 c43f0ac -- 'src/components/*/*.intent.json'`).
No `use_when` text changed in any of the 20 intent files. CardContainer's six
`use_when` entries were compared again with those of the other 19. These are
the nearest:

- CardContainer: "Cards also contain other components in slot area." (`Figma 69:1498 (Cards Doc Frame › Do, text I69:1498;2406:461;69:1495)`)
- CardItem: "this can be used with card container to post job listing" (`Figma 32:651 (CardContent/CardItem component description, paragraph 1)`)
- DescriptionItem: "used together with card container to give options to user with checkbox during the process of posting a job description with the status of how many post this option is applied for" (`Figma 269:447 (CardContent/DescriptionItem component description, paragraph 1)`)

CardItem and DescriptionItem describe content that goes inside a card
container. CardContainer's entry describes the container that holds it. They
do not compete for the same situation. Not a finding.

- CardContainer: "Maintain consistent spacing, padding, and alignment across similar cards." (Figma 69:1498, as above)
- Label: "Maintain consistent padding, height, typography, and spacing." (`Figma 71:2279 (Label Doc Frame › Do, text I71:2279;2406:461;71:2275)`)

Each entry is about consistency within its own component, not about a choice
between the two. Not a finding.

## What each owner is waiting on

No gate is shut, and no blocking check failed.

- **Owner** (check 2, warning only, does not block): none of the seven `dont_use_when` entries in Figma 69:1498 names an alternative.
- **Owner** (gate 7, informational): the banner in `docs/versioning.md` still calls the file a draft.
- **Next, once this report is merged:** release writes Release Review and Release Verdict = Cleared. Then the Developer adds CardContainer's export to `src/index.ts` by pull request into `staging`. Publishing stays on hold until every component is Cleared (owner ruling, 2026-10-15).
