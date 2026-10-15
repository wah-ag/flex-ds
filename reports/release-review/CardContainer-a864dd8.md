# Release review: CardContainer at a864dd8

| | |
| --- | --- |
| Component | CardContainer (`src/components/CardContainer/`) |
| Reviewed commit | `a864dd8a0681416c7f3423ebc6addc5ff145806c` (`main` HEAD, "Merge pull request #132 from wah-ag/staging") |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`, `"private": true`) |
| Reviewed at | 2026-10-15T15:27:01Z |
| **Verdict** | **Blocked**: check 3 (`a11y` specific) fails. Its one source citation points three lines away from the code it describes, which is outside the owner's off-by-one ruling. All seven gates are open, and checks 1, 4, 5 and 6 pass. Check 2 gives a warning, which does not change the verdict. |

This is the second release review of CardContainer. The first, at `64ed84e`
(`reports/release-review/CardContainer-64ed84e.md`, PR #130, merged as
`4658046`), was Blocked on gate 5 only: `card slot` → `children` had no
recorded owner decision. Since then, the owner ruled `card slot` → `cardSlot`
on 2026-10-15. PR #131 (code commit `2f7452a`, merged as `6a0f5dd`) made the
rename, QA retested all three rows at `6a0f5dd`, and #132 shipped it to `main`.

The review read a clean, detached checkout of exactly this commit
(`git worktree add --detach`, no local changes), after `npm ci` and
`npm run build:tokens`.

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/CardContainer/CardContainer.intent.json` exists at the commit and parses as JSON (`JSON.parse`). It was last changed in `8a1d3b2` (#105). #131 did not touch it. |
| 2 | Development is Completed | **Open** | Components row `rec1y6kyai6F3FVWv` reads `Development = Completed`. Production Storybook: `https://flex-ds-sigma.vercel.app/?path=/story/components-cardcontainer--idle`. Commit: `https://github.com/wah-ag/flex-ds/commit/a864dd8a0681416c7f3423ebc6addc5ff145806c`. |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0: "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0: "✔ Modes match and every alpha token carries alpha." The reviewed commit is `main` HEAD, so `tokens/` equals `main`. `git diff --stat a864dd8 origin/staging` is empty (`origin/staging` at `6a0f5dd`, same tree). Every remote token branch (`tokens-update`, `tokens-update-staging`, `component/icon-stroke-token`, `revert-64-tokens-update`, `token-runner-agent`) is an ancestor of the reviewed commit. No pull request is open (`gh pr list --state open` returns `[]`). |
| 4 | Public surface decided | **Open** | The component is public. It has a Components row (`rec1y6kyai6F3FVWv`) and a Figma node (`36:158`), and nothing under `docs/` declares it internal. At this commit `src/index.ts` exports Avatar and ButtonCTA, not CardContainer. Under the gate, that neither opens nor shuts it. |
| 5 | Names final | **Open** | `docs/card-container-prop-names.md:10-13` maps Figma `state` → `state` and `card slot` → `cardSlot`. Lines 17-21, "Owner ruling on the slot name (2026-10-15)", record the decision: "Owner ruling 2026-10-15: `card slot` → `cardSlot`, the literal camelCase of the Figma name, chosen over `children`." The code matches: `export function CardContainer({ state = 'idle', cardSlot, className, ...props })` (`CardContainer.jsx:24`), and `{cardSlot}` is rendered at line 36. `children` is dropped at line 27, so it never reaches the root `<div>`. No open suggestion remains for this component under `docs/`. |
| 6 | States complete | **Open** | Figma's matrix is three variants: `state=idle` (36:157), `state=hover` (36:159), `state=active` (36:169) (`docs/card-container-prop-names.md:3-5`). Each has a story export: `Idle`, `Hover`, `Active` (`CardContainer.stories.jsx:83-85`), plus a `Tokens` story. The three linked Staging Testing rows (`CardContainer / idle`, `/ hover`, `/ active`) all read `Passed`. Each row's Context reads `Tested on staging 6a0f5ddb8e4586372d3f05007ce81577096a9a35`, the merge of #131, and notes `cardSlot` rendering. `6a0f5dd` is an ancestor of the reviewed commit, and `git diff --stat 6a0f5dd a864dd8` is empty, so the tested code is the reviewed code. Focus, pressed and disabled are not designed. They are left out by the owner's ruling of 2026-10-04 (`docs/card-container-prop-names.md:55-56`). |
| 7 | Version meaning known | **Open** | `docs/versioning.md` exists at the commit. CardContainer's class under it is **New, MINOR**, because CardContainer has never been exported: `git tag -l 'v*'` is empty, and `src/index.ts` at the commit does not export it. `docs/versioning.md:26` reads: "**New**: first time it is exported. MINOR." The `children` → `cardSlot` rename is not a separate breaking change, because no published version ever exposed `children`. |

### Gate 7: the banner in `docs/versioning.md`

`docs/versioning.md:3` still reads "**Draft for the owner's review.**" As in
the ButtonCTA, Avatar and CardContainer `64ed84e` reviews, this review treats
the file as the policy in force, because a human merged it in #118. If the
owner did not mean that merge as approval, gate 7 is shut as well.

## Checks

| # | Check | Result |
| --- | --- | --- |
| 1 | Fields present | **Pass** |
| 2 | Every `dont_use_when` names an alternative | **Warning** (not a blocker) |
| 3 | `a11y` specific, not generic | **Fail** (source citation points away from the behaviour, outside the off-by-one ruling) |
| 4 | `required_tokens` resolve | **Pass** |
| 5 | All variants covered | **Pass** |
| 6 | No two components claim the same job | **Pass** |

### Check 1: Fields present (pass)

All seven keys are present: `use_when` (6 entries), `dont_use_when` (7),
`variant_intent` (`state`), `placement` (empty), `pairs_with` (empty),
`required_tokens` (10), and `a11y` (1). Every non-empty entry has a
`source`, and `use_when` is not empty.

### Check 2: Every `dont_use_when` names an alternative (warning)

This is unchanged from the `64ed84e` review. None of the seven entries names
what to use instead. All seven come from
`Figma 69:1498 (Cards Doc Frame › Don’t, text I69:1498;2406:416;69:1488)`:

1. "Don’t scroll within a card to reveal information."
2. "Don’t use multiple competing CTAs within a single card."
3. "Card shouldn’t contain that can be swiped, such as image carousel or pagination. Also, swipe gestures shouldn’t cause portions of cards to detach upon swiping."
4. "Don’t create inconsistent card sizes, spacing, or layouts for similar content."
5. "On a mobile device, cards can’t internally scroll, as it could use two scroll bars to be displayed."
6. "Don’t make the entire card clickable unless the whole card represents a single action."
7. "Don’t let cards bump other elements out of the way. When a card is picked up, it appears in front of all elements, except app bars and navigation."

This review suggests no alternatives.

### Check 3: `a11y` specific, not generic (fail)

The one entry:

- "Renders a <div> with no role or aria attributes; `state` is set only as data-state." (source: `src/components/CardContainer/CardContainer.jsx:28`)

The behaviour it describes is still true at the commit. The `<div` is at line
31. It gets `{...rest}` (line 32), `className` (line 33) and
`data-state={look}` (line 34), and it has no `role` or `aria-*` of its own.

The source no longer points at that behaviour. At this commit,
`CardContainer.jsx:28` is `const look = STATES.includes(state) ? state : 'idle';`.
The `<div` is three lines further down. #122 removed one line, and #131 added
the `cardSlot` comment block and the `children` drop
(`const { children: _children, ...rest } = props;`, line 27). This is not the
case the owner's ruling of 2026-10-15 covers ("The a11y citations being one
line off doesn't fail check 3"). That ruling covered a one-line shift with no
code change. Here the code changed, and the cited line holds different code.
This review does not extend the ruling to cover it.

The intent file is otherwise consistent with the rename. It never mentions
`children` or `cardSlot`. Its only reference to the slot is Figma's own prose
in `use_when` ("Cards also contain other components in slot area."), which is
still accurate. The owner's ruling recorded with the rename called for
doc-generator Job A to refresh `CardContainer.intent.json` before this
review. At the commit, the file has not changed since `8a1d3b2`.

### Check 4: `required_tokens` resolve (pass)

- The `var(--…)` references in `CardContainer.css` and `CardContainer.jsx` give 10 unique tokens, not counting the component's own `--card-container-*` custom properties. `required_tokens` lists 10. The two sets are identical (`diff` is empty).
- All 10 are defined in `build/css/*.css` at the commit. `--background-neutral-base`, `--border-interactive-brand-idle` and `--border-neutral-base` are in `tokens.css` and `tokens-dark.css`. `--border-radius-card`, `--border-width-default`, `--border-width-selected`, `--spacing-gap-xs`, `--spacing-padding-lg` and `--spacing-padding-md` are in `tokens.css` and `tokens-back-office.css`. `--elevation-level-1` is in `tokens.css`.

### Check 5: All variants covered (pass)

The code accepts one variant prop, `state` (`idle`, `hover`, `active`;
`CardContainer.jsx:22,24,28`). Every value is a key in `variant_intent`.

These meanings are `null`, which counts as covered (there is no Figma text):
`state.idle`, `state.hover`, `state.active`.

These props are not counted as variant props: `cardSlot` (Figma's
`card slot`, a slot), and `className` and `...rest` (DOM pass-throughs).

### Check 6: No two components claim the same job (pass)

No intent file changed between `64ed84e` and this commit
(`git diff --stat 64ed84e a864dd8 -- 'src/components/*/*.intent.json'` is
empty). CardContainer's six `use_when` entries were compared again with every
`use_when` entry in the other 19 intent files. These are the nearest:

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

- **doc-generator, Job A** (check 3, blocker): re-transpose
  `src/components/CardContainer/CardContainer.intent.json` at the current
  `CardContainer.jsx`. The `a11y` source `CardContainer.jsx:28` now points at
  `const look = …`, and the `<div>` it describes is at lines 31-34 after #131.
  Job A's pull request goes into `staging`, and a human merges it. After it
  reaches `main`, a new "release CardContainer" reviews it again.
- **Owner** (check 3, alternative): if the owner extends the 2026-10-15
  citation ruling to cover this citation, the check passes. That decision is
  the owner's. This review does not make it.
- **Owner** (check 2, warning only, does not block): none of the seven
  `dont_use_when` entries in Figma 69:1498 names an alternative.
- **Owner** (gate 7, informational): the banner in `docs/versioning.md` still
  calls the file a draft.
