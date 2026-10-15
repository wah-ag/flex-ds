# Release review: CardContainer at 64ed84e

| | |
| --- | --- |
| Component | CardContainer (`src/components/CardContainer/`) |
| Reviewed commit | `64ed84ec1a6b9fd4ce155ef2d348ca2e33b2f993` (`main` HEAD, "Merge pull request #129 from wah-ag/staging") |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`, `"private": true`) |
| Reviewed at | 2026-10-15T10:22:13Z |
| **Verdict** | **Blocked**: gate 5 (Names final) is shut. Every other gate is open, and checks 1, 3, 4, 5 and 6 pass. Check 2 gives a warning, which does not change the verdict. |

This is the first release review of CardContainer. No earlier report exists
under `reports/release-review/` on `staging` or `main`, and the Components
row's Release Review and Release Verdict were empty.

The review read a clean, detached checkout of exactly this commit
(`git worktree add --detach`, no local changes), after `npm ci` and
`npm run build:tokens`.

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/CardContainer/CardContainer.intent.json` exists at the commit and parses as JSON (`JSON.parse`). It was added in `8a1d3b2` (#105, merged as `3cb3a28`) and has not changed since. |
| 2 | Development is Completed | **Open** | Components row `rec1y6kyai6F3FVWv` reads `Development = Completed`. Production Storybook: `https://flex-ds-sigma.vercel.app/?path=/story/components-cardcontainer--idle`. |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0: "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0: "✔ Modes match and every alpha token carries alpha." The reviewed commit is `main` HEAD, so `tokens/` equals `main`. `git diff --stat 64ed84e origin/staging -- tokens/` (`origin/staging` at `4094d8f`) is empty. Every remote token branch (`tokens-update` `bf5f961`, `tokens-update-staging` `357920d`, `component/icon-stroke-token` `a99b959`, `revert-64-tokens-update` `dc99296`, `token-runner-agent` `a720c89`) is an ancestor of the reviewed commit, so any diff against them is later work, not a waiting sync. No pull request is open (`gh pr list --state open` returns `[]`). |
| 4 | Public surface decided | **Open** | The component is public. It has a Components row (`rec1y6kyai6F3FVWv`) and a Figma node (`36:158`), and nothing under `docs/` declares it internal. At this commit `src/index.ts` exports Avatar and ButtonCTA (lines 15-16), not CardContainer. Under the gate, that neither opens nor shuts it. |
| 5 | Names final | **Shut** | `docs/card-container-prop-names.md:17-21`, under the heading "Suggested name (applied, for review)", proposes Figma's `card slot` → React `children` ("If the Designer wants a named prop, `cardSlot` is the literal camelCase form"). No owner decision on that name is recorded in the file or anywhere else under `docs/` (`grep -rn children docs/`). The file's "Owner rulings (2026-10-04)" section (lines 51-56) covers width and states only. Compare CardHeader, whose same slot mapping is recorded as confirmed: "the owner confirmed them on 2026-10-09" (`docs/card-header-prop-names.md:13-14`). The other prop, `state`, matches Figma's `state` (`docs/card-container-prop-names.md:12`; `CardContainer.jsx:23`). An open suggestion shuts the gate. |
| 6 | States complete | **Open** | Figma's matrix is three variants: `state=idle` (36:157), `state=hover` (36:159), `state=active` (36:169) (`docs/card-container-prop-names.md:3-5`; `CardContainer.stories.jsx:9-13`). Each has a story export: `Idle`, `Hover`, `Active` (`CardContainer.stories.jsx:83-85`), plus a `Tokens` story. Three Staging Testing rows are linked (`CardContainer / idle`, `/ hover`, `/ active`), and all three read `Passed`. Every row's Context reads `Tested on staging 9c5d41344c6a594836f1c7de1b2b3edcc40ad8cb`, which is an ancestor of the reviewed commit (`git merge-base --is-ancestor` succeeds). Since then, two things changed under the folder (`git diff --stat 9c5d413 64ed84e -- src/components/CardContainer`). The intent file was added (#105). `CardContainer.jsx` dropped `import './CardContainer.css';` (`a91a822`, #122, merged as `d22ee86`), and the stylesheet now loads from `src/styles.css:14`. `docs/retest-waivers.md:36` lists `d22ee86` as waived for retest (owner decision, 2026-10-14). Focus, pressed and disabled are not designed. They are left out by the owner's ruling of 2026-10-04, which is recorded at `docs/card-container-prop-names.md:55-56`. |
| 7 | Version meaning known | **Open** | `docs/versioning.md` exists at the commit. CardContainer's class under it is **New, MINOR**, because CardContainer has never been exported: `git tag -l 'v*'` is empty, and `src/index.ts` at the commit does not export it. Its export, once Cleared, will be its first. `docs/versioning.md:26` reads: "**New**: first time it is exported. MINOR.". `docs/versioning.md:16` gives "A new component exported from `src/index.ts`." as a MINOR example. |

### Gate 7: the banner in `docs/versioning.md`

`docs/versioning.md:3-4` still reads "**Draft for the owner's review.** …
It counts only once a human has merged it." That condition was met in #118.
As in the ButtonCTA and Avatar reviews at `376c4f5`, this review reads the
file as the policy in force. If the owner did not mean that merge as
approval, gate 7 is shut too.

## Checks

| # | Check | Result |
| --- | --- | --- |
| 1 | Fields present | **Pass** |
| 2 | Every `dont_use_when` names an alternative | **Warning** (not a blocker) |
| 3 | `a11y` specific, not generic | **Pass** (with a stale line citation, see below) |
| 4 | `required_tokens` resolve | **Pass** |
| 5 | All variants covered | **Pass** |
| 6 | No two components claim the same job | **Pass** |

### Check 1: Fields present (pass)

All seven keys are present: `use_when` (6 entries), `dont_use_when` (7),
`variant_intent` (`state`), `placement` (empty), `pairs_with` (empty),
`required_tokens` (10), and `a11y` (1). Every non-empty entry has a
`source`, and `use_when` is not empty. `placement` and `pairs_with` are
empty arrays. The check asks only that the key exists.

### Check 2: Every `dont_use_when` names an alternative (warning)

None of the seven entries names what to use instead, either as a component
(by folder name) or as a variant. All seven come from
`Figma 69:1498 (Cards Doc Frame › Don’t, text I69:1498;2406:416;69:1488)`:

1. "Don’t scroll within a card to reveal information."
2. "Don’t use multiple competing CTAs within a single card."
3. "Card shouldn’t contain that can be swiped, such as image carousel or pagination. Also, swipe gestures shouldn’t cause portions of cards to detach upon swiping."
4. "Don’t create inconsistent card sizes, spacing, or layouts for similar content."
5. "On a mobile device, cards can’t internally scroll, as it could use two scroll bars to be displayed."
6. "Don’t make the entire card clickable unless the whole card represents a single action."
7. "Don’t let cards bump other elements out of the way. When a card is picked up, it appears in front of all elements, except app bars and navigation."

This review suggests no alternatives.

### Check 3: `a11y` specific, not generic (pass, stale citation)

The one entry names something checkable, and the code at the commit does what
it says:

- "Renders a <div> with no role or aria attributes; `state` is set only as data-state." (source: `src/components/CardContainer/CardContainer.jsx:28`). At the commit, `<div` is at line 27. It gets `{...rest}` (line 28), `className` (line 29) and `data-state={look}` (line 30). It has no `role` or `aria-*` of its own, and `state` reaches the DOM only as `data-state`.

**Stale citation.** The source is one line off at this commit, because #122
removed the CSS import at line 1. When #105 wrote the intent, at the
build's tested commit `9c5d413`, the `<div` was at line 28. The behaviour
the entry describes is unchanged and true. Under the owner's ruling of
2026-10-15 (off-by-one citations pass check 3 when the behaviour is
unchanged), the check passes.

### Check 4: `required_tokens` resolve (pass)

- The `var(--…)` references in `CardContainer.css` give 10 unique tokens, not counting the component's own custom properties (`--card-container-border-width`, `--card-container-border`, `--card-container-elevation`, defined at `CardContainer.css:7-11` and overridden at lines 37 and 42-43). `CardContainer.jsx` references none. `required_tokens` lists 10. The two sets are identical: no token is used without being listed, and none is listed without being used.
- All 10 are defined in `build/css/*.css` at the commit: `--background-neutral-base`, `--border-interactive-brand-idle` and `--border-neutral-base` in `tokens.css` and `tokens-dark.css`; `--border-radius-card`, `--border-width-default`, `--border-width-selected`, `--spacing-gap-xs`, `--spacing-padding-lg` and `--spacing-padding-md` in `tokens.css` and `tokens-back-office.css`; and `--elevation-level-1` in `tokens.css`.

### Check 5: All variants covered (pass)

The code accepts one variant prop: `state` (`idle`, `hover`, `active`;
`CardContainer.jsx:21,23-24`), backed by `[data-state='idle']:hover`,
`[data-state='hover']` and `[data-state='active']` at
`CardContainer.css:35-44`. Every value is a key in `variant_intent`.

These meanings are `null`, which counts as covered (there is no Figma text):
`state.idle`, `state.hover`, `state.active`.

These props are not counted as variant props: `children` (Figma's `card
slot`), and `className` and `...rest` (DOM pass-throughs).

### Check 6: No two components claim the same job (pass)

CardContainer's six `use_when` entries were compared with every `use_when`
entry in the other 19 intent files at the commit. These are the nearest
entries:

- CardContainer: "Cards also contain other components in slot area." (`Figma 69:1498 (Cards Doc Frame › Do, text I69:1498;2406:461;69:1495)`)
- CardItem: "this can be used with card container to post job listing" (`Figma 32:651 (CardContent/CardItem component description, paragraph 1)`)
- DescriptionItem: "used together with card container to give options to user with checkbox during the process of posting a job description with the status of how many post this option is applied for" (`Figma 269:447 (CardContent/DescriptionItem component description, paragraph 1)`)

CardItem and DescriptionItem each describe content placed inside a card
container ("used with card container", "used together with card
container"). CardContainer's entry describes the container holding such
components in its slot. One holds the other, so they are not competing for
the same situation. Not a finding.

- CardContainer: "Maintain consistent spacing, padding, and alignment across similar cards." (Figma 69:1498, as above)
- Label: "Maintain consistent padding, height, typography, and spacing." (`Figma 71:2279 (Label Doc Frame › Do, text I71:2279;2406:461;71:2275)`)

The wording is similar, but each entry is about consistency within its own
component. Neither describes a situation where a reader would choose one
component over the other. Not a finding.

## What each owner is waiting on

- **Owner** (gate 5, blocker): `docs/card-container-prop-names.md:17-21` proposes Figma's `card slot` → `children` "for review", with `cardSlot` as the alternative, and no decision is recorded under `docs/`. The gate opens once the owner's decision on that name is recorded there, as `docs/card-header-prop-names.md:13-14` records it for CardHeader's slot.
- **Owner** (check 3, informational): the one `a11y` source citation in `CardContainer.intent.json` is one line off at this commit, after #122. The text is true. Re-transposing is doc-generator Job A, if the owner wants it before the docs site is built.
- **Owner** (check 2, warning only, does not block): none of the seven `dont_use_when` entries in Figma 69:1498 names an alternative. They are listed above.
- **Owner** (gate 7, informational): the banner in `docs/versioning.md` still calls the file a draft.
- After the gate 5 decision reaches `main`, a new "release CardContainer" reviews it again at that commit.
