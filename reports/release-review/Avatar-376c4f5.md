# Release review: Avatar at 376c4f5

| | |
| --- | --- |
| Component | Avatar (`src/components/Avatar/`) |
| Reviewed commit | `376c4f5a3f3a73637276b1ac856df44f16cbffaa` (`main` HEAD, "Merge pull request #125 from wah-ag/staging") |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`, `"private": true`) |
| Reviewed at | 2026-10-15T10:01:23Z |
| **Verdict** | **Cleared**: all seven gates are open and checks 1, 3, 4, 5 and 6 pass. Check 2 gives a warning, which does not change the verdict. |

This is the first release review of Avatar. No earlier report exists under
`reports/release-review/` on `staging` or `main`, and the Components row's
Release Review and Release Verdict were empty.

The review read a clean, detached checkout of exactly this commit
(`git worktree add --detach`, no local changes), after `npm ci` and
`npm run build:tokens`.

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/Avatar/Avatar.intent.json` exists at the commit and parses as JSON (`JSON.parse`). It was added in `8a1d3b2` (#105, merged as `3cb3a28`) and has not changed since. |
| 2 | Development is Completed | **Open** | Components row `recu14u7lGzQglwwJ` reads `Development = Completed`. Production Storybook: `https://flex-ds-sigma.vercel.app/?path=/story/components-avatar--size-2-xl-rectangle-image`. |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0: "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0: "✔ Modes match and every alpha token carries alpha." The reviewed commit is `main` HEAD, so `tokens/` equals `main`. `git diff --stat 376c4f5 origin/staging -- tokens/` (`origin/staging` at `15ab17e`) and `git diff --stat 376c4f5 origin/tokens-update -- tokens/` (`bf5f961`) are both empty. `origin/tokens-update-staging` (`357920d`) differs, but it is already an ancestor of the reviewed commit (merged in #71), so its diff is later work, not a waiting sync. No pull request is open. |
| 4 | Public surface decided | **Open** | The component is public. It has a Components row (`recu14u7lGzQglwwJ`, Category ATOMS) and a Figma node (`32:315`), and nothing under `docs/` declares it internal. At this commit `src/index.ts` does not export Avatar (it exports only ButtonCTA, line 15). Under the gate, that neither opens nor shuts it. |
| 5 | Names final | **Open** | `docs/avatar-prop-names.md:10-14` maps each Figma property of node 32:315 to its prop: `size` → `size`, `category` → `category`, and the icon's instance swap → `swapIcon`. `Avatar.jsx:18-26` takes those, plus `src` and `alt` (no Figma property), `className` and a `...rest` spread onto the `<span>`. The section "`src` and `alt`: added, by owner decision (2026-10-03)" (`docs/avatar-prop-names.md:20`) records the owner's decision on the two props Figma lacks. No rename of a Figma property is suggested for Avatar under `docs/`. See *Gate 5: notes* below. |
| 6 | States complete | **Open** | Figma gives Avatar no state property (`docs/avatar-prop-names.md`, "No states"; `Avatar.jsx:8-9`). The matrix is 5 sizes × 3 categories = 15 variant nodes, listed one per cell in `Avatar.stories.jsx:11-17`. There is one story export for each cell (`Avatar.stories.jsx:62-80`, 15 exports, plus a `Tokens` story). There are 15 linked Staging Testing rows, one for each `category; size` cell, and all 15 read `Passed`. Every row's Context reads `Tested on staging 43e994622491d7c0a2713d65232b6ffc660bfb96`, which is an ancestor of the reviewed commit (`git merge-base --is-ancestor` succeeds). Since then, two things changed under the folder (`git diff --stat 43e9946 376c4f5 -- src/components/Avatar`): the intent file was added (#105), and `Avatar.jsx` dropped `import './Avatar.css';` (`a91a822`, #122, merged as `d22ee86`). The stylesheet now loads from `src/styles.css:10`. `docs/retest-waivers.md` lists `d22ee86` as waived for retest (owner decision, 2026-10-14). |
| 7 | Version meaning known | **Open** | `docs/versioning.md` exists at the commit. Avatar's class under it is **New, MINOR**, because Avatar has never been exported: `git tag -l 'v*'` is empty, and `src/index.ts` at the commit does not export it. Its export, once Cleared, will be its first. `docs/versioning.md:26` reads: "**New**: first time it is exported. MINOR.". `docs/versioning.md:16` gives "A new component exported from `src/index.ts`." as a MINOR example. |

### Gate 5: notes

These do not shut the gate. They are recorded so the owner sees them.

- `docs/avatar-prop-names.md:5-6` reads "Two props have no Figma
  property and are proposed here for review", and the story's description
  (`Avatar.stories.jsx:29-30`) still says `src` and `alt` "are proposed". The
  section at line 20 records the owner's 2026-10-03 decision to add them. This
  review reads that decision as covering the names `src` and `alt`. They are
  not renames of a Figma property. If the owner meant only that the props
  should exist, and the names are still open, gate 5 is shut and this verdict
  is Blocked.
- `docs/avatar-prop-names.md:16-18`: "Its exact spelling in the Figma panel
  was not readable through the API and should be confirmed by the Designer."
  `swapIcon` follows the convention for ButtonCTA's `swap icon` instance swap
  (`docs/button-cta-prop-names.md:14`). No other name is proposed.
- `className` and the `...rest` spread are standard React and DOM
  pass-throughs. `docs/avatar-prop-names.md` does not document them. This is
  the same as for ButtonCTA's review at this commit.

### Gate 7: the banner in `docs/versioning.md`

`docs/versioning.md:3-4` still reads "**Draft for the owner's review.** …
It counts only once a human has merged it." That condition was met in #118
(merged by `wah-ag`). As in the ButtonCTA review at this commit, this review
reads the file as the policy in force. If the owner did not mean that merge
as approval, gate 7 is shut and this verdict is Blocked.

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

All seven keys are present: `use_when` (6 entries), `dont_use_when` (6),
`variant_intent` (`size`, `category`), `placement` (empty), `pairs_with` (2),
`required_tokens` (18), and `a11y` (3). Every non-empty entry has a `source`,
and `use_when` is not empty. `placement` is an empty array. The check asks
only that the key exists.

### Check 2: Every `dont_use_when` names an alternative (warning)

None of the six entries names what to use instead, either as a component
(by folder name) or as a variant. All six come from
`Figma 69:2101 (Avatar Doc Frame › Don’t, text I69:2101;2406:416;69:2094)`:

1. "Don’t use inconsistent sizes or shapes for avatars serving the same purpose."
2. "Don’t use distorted, stretched, or low-quality profile images."
3. "Don’t rely on the avatar alone to communicate important information."
4. "Don’t overcrowd avatars with unnecessary badges or status indicators."
5. "Don’t use decorative images that could be mistaken for a user or entity avatar."
6. "Don’t remove accessible labels when the avatar represents a specific person or entity."

This review suggests no alternatives.

### Check 3: `a11y` specific, not generic (pass, stale citations)

Each entry names something checkable, and the code at the commit does what
the entry says:

- "Renders a <span> with no role or aria attributes of its own." (source: `src/components/Avatar/Avatar.jsx:31`). At the commit, `<span` is at line 30. The element gets only `{...rest}` (line 31) and `className` (lines 32-34). It has no `role` or `aria-*` of its own.
- "The image categories render a native <img> with the `alt` prop, which defaults to an empty string." (source: `src/components/Avatar/Avatar.jsx:37`). At the commit, the `<img … alt={alt} />` is at line 36, and the default `alt = ''` is at line 23.
- "The icon category’s icon is aria-hidden=\"true\" and focusable=\"false\"." (source: `src/components/Avatar/Avatar.jsx:39`). At the commit, the icon with both attributes is at line 38.

**Stale citations.** All three sources are one line off at this commit,
because #122 removed the CSS import at line 2. The cited lines were correct
when #105 wrote the intent. The behaviour each entry describes is unchanged
and true. Under the owner's ruling of 2026-10-15 (off-by-one citations pass
check 3 when the behaviour is unchanged), the check passes. The docs site
will show these citations unless the intent is re-transposed (doc-generator
Job A). That is the owner's call.

The `pairs_with` citations were re-read at the commit and are correct:
`EmployerProfile.jsx:1` and `NavItems.jsx:4` each import Avatar.

### Check 4: `required_tokens` resolve (pass)

- The `var(--…)` references in `Avatar.css` and `Avatar.jsx` give 18 unique tokens, not counting the component's own custom properties (`--avatar-size`, `--avatar-radius`, `--avatar-icon-size`, `--avatar-icon-stroke`, defined at `Avatar.css:24-57`). `required_tokens` lists 18. The two sets are identical: no token is used without being listed, and none is listed without being used.
- All 18 are defined in `build/css/*.css` at the commit.

### Check 5: All variants covered (pass)

The code accepts two variant props. They are `size` (`2xl`, `xl`, `lg`, `md`,
`sm`), backed by `.avatar--{2xl,xl,lg,md,sm}` at `Avatar.css:24-57`, and
`category` (`rectangle image`, `circle image`, `icon`), from
`Avatar.jsx:14,16,37` and `.avatar--{rectangle-image,circle-image,icon}` at
`Avatar.css:62-92`. Every value is a key in `variant_intent`.

These meanings are `null`, which counts as covered (there is no Figma text):
`size.2xl`, `size.xl`, `size.lg`, `size.md`, `size.sm`,
`category.rectangle image`, `category.circle image`, `category.icon`.

These props are not counted as variant props: `swapIcon` (Figma instance
swap), `src` and `alt` (image attributes), and `className` and `...rest`
(DOM pass-throughs).

### Check 6: No two components claim the same job (pass)

Avatar's six `use_when` entries were compared with every `use_when` entry in
the other 19 intent files at the commit. These are the nearest entries:

- Avatar: "Use avatars to provide clear visual identification of users or entities." (`Figma 69:2101 (Avatar Doc Frame › Do, text I69:2101;2406:461;69:2097)`)
- EmployerProfile: "it serves as profile, avatar can change as image, icon and circle shape. It can be used as user profile and brand profile, also in job category." (`Figma 32:337 (CardContent/EmployerProfile component description, paragraph 1)`)

Both concern identifying a user or a brand. But EmployerProfile's entry
describes a profile that contains an avatar ("avatar can change as image,
icon and circle shape"), and `EmployerProfile.jsx:1` imports Avatar. One is
built from the other, so they are not competing for the same situation.
Not a finding.

- Avatar: "Use the appropriate size based on the context and layout." (`Figma 69:2101 (Avatar Doc Frame › Do, text I69:2101;2406:461;69:2097)`)
- ButtonCTA: "Use the appropriate size based on the context and layout." (`Figma 17:826 (Buttons Doc Frame › Do, text I17:826;2406:461;17:822)`)

The wording is identical, but each entry is about choosing a size within its
own component. Neither describes a situation where a reader would choose one
component over the other. Not a finding. The ButtonCTA review at this commit
reached the same conclusion.

- NavItems: "call to action from user like help, notification and messages together with user profile" (`NavItems.intent.json`, Figma 58:406). This names a header group that includes a user profile, and `NavItems.jsx:4` imports Avatar. That is composition again. Not a finding.

## What each owner is waiting on

- **Owner** (check 3, informational): the three `a11y` source citations in `Avatar.intent.json` are one line off at this commit, after #122. The text is true. Re-transposing is doc-generator Job A, if the owner wants it before the docs site is built.
- **Owner** (check 2, warning only, does not block): none of the six `dont_use_when` entries in Figma 69:2101 names an alternative. They are listed above.
- **Owner** (gate 5, informational): `docs/avatar-prop-names.md` still says `src` and `alt` are "proposed here for review", though the section at line 20 records the owner's decision to add them. The `swapIcon` spelling is left for the Designer to confirm. `className` and `...rest` are undocumented pass-throughs.
- **Owner** (gate 7, informational): the banner in `docs/versioning.md` still calls the file a draft.
- No shut gate and no failed blocker check. Next, after this report is merged: Avatar is not exported from `src/index.ts`, so the Developer adds its export by pull request into `staging`. Then DevOps packages it.
