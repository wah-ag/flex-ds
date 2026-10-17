# Release review: EmployerProfile at 6fcf856

| | |
| --- | --- |
| Component | EmployerProfile (`src/components/EmployerProfile/`), Figma `CardContent/EmployerProfile` 32:337, registry row "CardContent/EmployerProfile" (`recRs9f2hoOfitGqJ`) |
| Reviewed commit | `6fcf8565439596835a54dafa4a47538970798cc0` (`main` HEAD, "Merge pull request #185 from wah-ag/staging") |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`) |
| Reviewed at | 2026-10-17T08:49:23Z |
| **Verdict** | **Cleared**: all seven gates are open, and checks 1, 3, 4, 5 and 6 pass. Check 2 has no entries to judge. |

This is EmployerProfile's first release review. The registry row had no
Release Review and no Release Verdict when it began.

This review read a clean, detached checkout of exactly the reviewed commit
(`git worktree add --detach`, no local changes), after `npm ci` and
`npm run build:tokens`.

Owner rulings applied, not re-raised: 2026-10-08, the component hugs its
content (Figma's unbound 198 width is not built), a long title stays on one
line with an ellipsis, there are no interaction states, `avatarProps`
passes through to Avatar, and DM Sans renders at opsz 12 against Figma's 14
(`docs/employer-profile-prop-names.md:27-53`, `:70-74`); 2026-10-14, the
#122 CSS-import move needs no retest (`docs/retest-waivers.md`, waiver
`d22ee86`); 2026-10-15, intent a11y citations a line or two off pass check 3
(ButtonCTA precedent), and are still reported; 2026-10-15, the publish is
held until every component is Cleared (noted, not a finding).

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/EmployerProfile/EmployerProfile.intent.json` exists at the commit and parses (`require()` in Node reads it; keys `component, figma, use_when, dont_use_when, variant_intent, placement, pairs_with, required_tokens, a11y`). Its one `use_when` entry is sourced to `Figma 32:337 (CardContent/EmployerProfile component description, paragraph 1)`. `dont_use_when` is empty: 32:337 has no Do/Don't usage region, and nothing was added to the intent from outside Figma. |
| 2 | Development is Completed | **Open** | Components row `recRs9f2hoOfitGqJ` reads `Development = Completed` (Design `Done`, Results Summary `Passed`). Production Storybook: `https://flex-ds-sigma.vercel.app/?path=/story/components-cardcontent-employerprofile--default`. Commit: `https://github.com/wah-ag/flex-ds/commit/376c4f5a3f3a73637276b1ac856df44f16cbffaa`, an ancestor of the reviewed commit (`git merge-base --is-ancestor 376c4f5 6fcf856` succeeds). `git diff --stat 376c4f5 6fcf856 -- src/components/EmployerProfile src/components/Avatar src/styles.css` is empty, so the code the board says shipped is the code reviewed. |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0: "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0: "✔ Modes match and every alpha token carries alpha." The reviewed commit is `origin/main`; `git diff --stat 6fcf856 origin/staging -- tokens/` is empty. No pull request is open (`gh pr list --state open` returns `[]`). |
| 4 | Public surface decided | **Open** | Public: a Components row (`recRs9f2hoOfitGqJ`) and a Figma node (32:337); nothing under `docs/` declares it internal (`src/index.ts:4-6` names only FieldControl and FieldLabel as internal). `src/index.ts:14-23` does not export EmployerProfile yet; under the gate that neither opens nor shuts it. |
| 5 | Names final | **Open** | See *Gate 5* below. Every prop is the Figma property name; the one prop with no Figma property, `avatarProps`, records the owner's approval. |
| 6 | States complete | **Open** | See *Gate 6* below. 32:337 is a single component with no variant set and no states; the owner's ruling to build none is at `docs/employer-profile-prop-names.md:49-53`. Its one boolean has a story for each value, and all three Staging Testing rows read `Passed`. |
| 7 | Version meaning known | **Open** | `docs/versioning.md` exists at the commit. EmployerProfile is **New, MINOR**: it has never been exported (`git tag -l 'v*'` is empty; `src/index.ts` does not export it). `docs/versioning.md:26`: "**New**: first time it is exported. MINOR." The banner at `:3-4` still reads "Draft for the owner's review."; as in earlier reviews, the file is treated as the policy in force because a human merged it in #118. |

### Gate 5

`docs/employer-profile-prop-names.md:9-13` maps each Figma property to its prop:

| Figma property | Prop |
| --- | --- |
| `employerTitle` (text) | `employerTitle` |
| `postedTime` (text) | `postedTime` |
| `showHelperText` (boolean) | `showHelperText` |

The code takes exactly those (`EmployerProfile.jsx:19-26`), plus
`avatarProps`, `className` and `...rest`. `avatarProps` has no Figma
property; `docs/employer-profile-prop-names.md:27-35` records: "The owner
approved this name on 2026-10-08." Other HTML attributes pass to the
wrapping `<div>` (`:37`).

Notes, none of them an open rename:

- `docs/employer-profile-prop-names.md:15-17`: "Their exact spelling in the
  Figma panel could not be read through the API, so the Designer should
  confirm them." No other name is proposed. As with Label
  (`reports/release-review/Label-1d42708.md`), this review reads that as no
  open suggestion. If the owner treats it as an open proposal, gate 5 is shut
  and this verdict is Blocked.
- The file's title reads "prop names (for review)". Every name in it is the
  Figma name or carries the owner's 2026-10-08 approval.
- No other file under `docs/` suggests a rename for EmployerProfile or its
  props (`grep -i employer docs/*.md` for rename, suggest or propose finds
  none).

### Gate 6

Figma 32:337 has no variant set and no interaction states. Its one boolean,
`showHelperText`, has a story for each value, and the owner's long-title
ruling has its own story (`EmployerProfile.stories.jsx:44-75`). The
`Tokens` story (`:80`) is a reference table, not a state. The three linked
Staging Testing rows:

| Row | Result | Context |
| --- | --- | --- |
| CardContent/EmployerProfile / showHelperText=true | Passed | Tested on staging `9c5d41344c6a594836f1c7de1b2b3edcc40ad8cb` (back-office re-test after #86/#87); earlier web-scale pass on `e3654f1` kept |
| CardContent/EmployerProfile / showHelperText=false | Passed | same |
| CardContent/EmployerProfile / long title, narrow parent | Passed | same |

`9c5d413` is on `origin/staging` and is an ancestor of the reviewed commit.
Since then, `git diff --stat 9c5d413 6fcf856 -- src/components/EmployerProfile src/components/Avatar src/styles.css`
shows only:

- the intent files (`EmployerProfile.intent.json`, `Avatar.intent.json`),
  which QA does not test;
- `EmployerProfile.jsx` and `Avatar.jsx` each losing `import './X.css';`,
  with `src/styles.css` importing both stylesheets instead (`a91a822`,
  merged in #122 as `d22ee86`). That merge is waived in
  `docs/retest-waivers.md` (owner, 2026-10-14). No style rule changed.

No owner screenshot waiver is missing: each row's Context records
"Screenshots waived by owner".

## Checks

| # | Check | Result |
| --- | --- | --- |
| 1 | Fields present | **Pass** |
| 2 | Every `dont_use_when` names an alternative | **Pass** (no entries; nothing to warn on) |
| 3 | `a11y` specific, not generic | **Pass** (citation one line off; owner precedent) |
| 4 | `required_tokens` resolve | **Pass** |
| 5 | All variants covered | **Pass** (no variant props; `variant_intent` is `{}`) |
| 6 | No two components claim the same job | **Pass** |

### Check 1: Fields present (pass)

All seven keys are present: `use_when` (1 entry), `dont_use_when` (empty),
`variant_intent` (`{}`), `placement` (empty), `pairs_with` (1: `CardHeader`,
source `src/components/CardHeader/CardHeader.jsx:1`), `required_tokens` (6)
and `a11y` (1). Every non-empty entry has a `source`, and `use_when` is not
empty.

### Check 2: Every `dont_use_when` names an alternative (pass, nothing to judge)

`dont_use_when` is empty, so there is no entry without an alternative. The
empty list follows from Figma: 32:337 has no Don't text, and the intent may
only carry what Figma says. A Do/Don't usage region for EmployerProfile
would be the Designer's to add; this review adds nothing.

### Check 3: `a11y` specific, not generic (pass)

| Entry | Source | At `6fcf856` |
| --- | --- | --- |
| "The employer title is a <p> whose title attribute carries the full title." | `EmployerProfile.jsx:32` | Line 32 is `{employerTitle}`. The element is opened at `:31`: `<p className="employer-profile__title" title={employerTitle}>`. |

The entry names an element (`<p>`) and an attribute (`title`) that can be
checked, and the code does what it says. The citation is one line off
because #122 (`a91a822`) removed the CSS import on line 2 after the intent
was written (`8a1d3b2`). Under the owner's 2026-10-15 ruling (ButtonCTA
precedent) that passes; it is reported here. QA's long-title row confirms
the full title in the `title` attribute on the deployed build.

### Check 4: `required_tokens` resolve (pass)

Every one of the six tokens listed is defined in `build/css/` at the commit:
`--text-neutral-bold` and `--text-neutral-secondary` in `tokens.css` and
`tokens-dark.css`; `--spacing-gap-md` and `--spacing-gap-xxs` in
`tokens.css` and `tokens-back-office.css`; `--title-sm` and `--label-md` in
`tokens.css`.

Every `var(--…)` in `EmployerProfile.css` and `EmployerProfile.jsx` is
exactly that set of six, so the list and the code match in both directions.
Avatar's tokens are Avatar's own and are listed in `Avatar.intent.json`.

### Check 5: All variants covered (pass)

The code accepts no variant prop. Figma 32:337 has no variant set; its
properties are two text properties (`employerTitle`, `postedTime`) and one
boolean (`showHelperText`). As in every earlier review (Figma booleans such
as `showIcon`, `showLeading`, `showTrailing` are not counted as variant
props), `variant_intent` is `{}` and nothing is left uncovered.

Not variant props: `employerTitle`, `postedTime` (text), `showHelperText`
(boolean), `avatarProps` (pass-through to Avatar), `className`, `...rest`.

### Check 6: No two components claim the same job (pass)

EmployerProfile's one `use_when` entry was compared with every `use_when`
entry in the other 19 intent files at the commit. The nearest entries, side
by side:

**EmployerProfile and Avatar.**

| EmployerProfile `use_when` | Avatar `use_when` |
| --- | --- |
| "it serves as profile, avatar can change as image, icon and circle shape. It can be used as user profile and brand profile, also in job category." | "Use avatars to provide clear visual identification of users or entities." |
| `Figma 32:337 (CardContent/EmployerProfile component description, paragraph 1)` | `Figma 69:2101 (Avatar Doc Frame › Do, text I69:2101;2406:461;69:2097)` |

Both concern identifying a user or a brand. EmployerProfile's own entry
describes a profile that contains an avatar ("avatar can change as image,
icon and circle shape"), and `EmployerProfile.jsx:1` imports Avatar. One is
built from the other, so they do not compete for the same situation. This
is the same pair, judged the same way, as in the Avatar review
(`reports/release-review/Avatar-376c4f5.md`, check 6). Not a finding.

**EmployerProfile and JobPosition.**

| EmployerProfile `use_when` | JobPosition `use_when` |
| --- | --- |
| "… It can be used as user profile and brand profile, also in job category." | "used for job listing cards, job position title and, how many position opens for this job title and which gender they prefer" |
| `Figma 32:337 (CardContent/EmployerProfile component description, paragraph 1)` | `Figma 32:258 (CardContent/JobPosition component description, paragraph 1)` |

JobPosition claims a job's title, its number of openings and the preferred
gender. EmployerProfile claims a profile (user or brand), which may also
appear "in job category". Neither quoted text claims what the other does:
EmployerProfile says nothing about a job title, openings or gender, and
JobPosition says nothing about a profile. They also sit side by side in the
same parent: `CardHeader.jsx:1-2` imports both. "Also in job category" is
the Designer's wording and is ambiguous; this review reads only what it
says, and finds no shared situation. Not a finding.

**EmployerProfile and NavItems.** NavItems: "call to action from user like
help, notification and messages together with user profile" (`Figma 58:406
(Header/NavItems component description, paragraph 1)`). NavItems claims the
call-to-action items shown beside a user profile, not the profile itself,
and it composes Avatar, not EmployerProfile. Not a finding.

**EmployerProfile and CardItem.** CardItem: "this can be used with card
container to post job listing" (`Figma 32:651`). CardItem is the whole
listing; it composes CardHeader, which composes EmployerProfile. Not a
finding.

## Noted for the owner, not a gate or check

**Usage region.** 32:337 carries only a component description, no Do/Don't
usage region, so `dont_use_when` is empty and `use_when` has one entry. That
does not fail any check. If the Designer adds a usage region in Figma, a
doc-generator Job A re-transpose would carry it into the intent; a draft
kept outside Figma is not a source.

**Typing gap.** `EmployerProfile.jsx:19-26` gives `className` no default,
the same pattern as ButtonCTA, Label and the input fields. Under your
2026-10-15 ruling this does not block an export; it is to be fixed before
the npm publish, with the others.

**Publish held.** Under your 2026-10-15 ruling, version 0.1.0 is approved
but the publish waits until every component is Cleared.

## What each owner is waiting on

No shut gate and no failed check.

- **Owner** (gate 5, informational): the Designer has still to confirm the
  Figma-panel spelling of `employerTitle`, `postedTime` and `showHelperText`
  (`docs/employer-profile-prop-names.md:15-17`). Read here as no open
  suggestion, as for Label.
- **Owner** (check 3, informational): the a11y citation is one line off
  after #122 (`:32` is now `:31`). Passes under your 2026-10-15 ruling; a
  doc-generator re-transpose would correct it if you want it exact.
- **Owner** (gate 7, informational): the banner in `docs/versioning.md`
  still calls the file a draft.
- **Designer, through the owner** (informational): 32:337 has no Do/Don't
  usage region, so EmployerProfile ships with one `use_when` entry and no
  `dont_use_when`.
- **Developer** (next step, once this report is merged): export
  EmployerProfile from `src/index.ts`, as with TextArea. Packaging and
  publishing stay held under your 2026-10-15 ruling.
