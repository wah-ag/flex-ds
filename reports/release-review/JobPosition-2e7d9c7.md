# Release review: JobPosition at 2e7d9c7

| | |
| --- | --- |
| Component | JobPosition (`src/components/JobPosition/`), Figma `CardContent/JobPosition` 32:258, registry row "CardContent/JobPosition" (`recKPVhyWxdrxwBws`) |
| Reviewed commit | `2e7d9c755d3b3248a3ffd9018385f5c2f5a4b1a2` (`main` HEAD, "Merge pull request #188 from wah-ag/staging") |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`) |
| Reviewed at | 2026-10-17T09:12:54Z |
| **Verdict** | **Blocked**: gate 5 (Names final) is shut. The other six gates are open, and checks 1, 3, 4, 5 and 6 pass. Check 2 has no entries to judge. |

This is JobPosition's first release review. The registry row had no Release
Review and no Release Verdict when it began.

This review read a clean, detached checkout of exactly the reviewed commit
(`git worktree add --detach`, no local changes), after `npm ci` and
`npm run build:tokens`.

Owner rulings applied, not re-raised (`docs/job-position-prop-names.md`):
2026-10-09, the pills render at Label's own md padding (`spacing-padding-sm`)
and Figma's 4px override is not built; the component hugs its content; a long
title stays on one line with an ellipsis; the pill row keeps one line and may
overflow; there are no interaction states; DM Sans renders at opsz 12 against
Figma's 14; the pill texts and icons are props. 2026-10-14: the #122 CSS-import
move needs no retest (`docs/retest-waivers.md`, waiver `d22ee86`).
2026-10-15: intent a11y citations a line off pass check 3 (ButtonCTA
precedent), and are still reported. 2026-10-15: the publish is held until
every component is Cleared (noted, not a finding).

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/JobPosition/JobPosition.intent.json` exists at the commit and parses (`JSON.parse` in Node). Keys: `component, figma, use_when, dont_use_when, variant_intent, placement, pairs_with, required_tokens, a11y`. Last written by `bfbc460` ("Intent: fill usage from Figma component descriptions"). |
| 2 | Development is Completed | **Open** | Components row `recKPVhyWxdrxwBws` reads `Development = Completed` (Design `Done`, Synchronization % `100%`, Results Summary `Passed`). Production Storybook: `https://flex-ds-sigma.vercel.app/?path=/story/components-cardcontent-jobposition--default`. Commit: `https://github.com/wah-ag/flex-ds/commit/376c4f5a3f3a73637276b1ac856df44f16cbffaa`, an ancestor of the reviewed commit (`git merge-base --is-ancestor 376c4f5 2e7d9c7` succeeds). |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0: "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0: "✔ Modes match and every alpha token carries alpha." The reviewed commit is `origin/main`, and `git diff --stat origin/main origin/staging` is empty, so no token sync is waiting on `staging`. No pull request is open (`gh pr list --state open` returns `[]`). |
| 4 | Public surface decided | **Open** | Public: a Components row (`recKPVhyWxdrxwBws`) and a Figma node (32:258). Nothing under `docs/` declares it internal; `src/index.ts:4-6` names only FieldControl and FieldLabel as internal. `src/index.ts` does not export JobPosition yet. Under this gate, that neither opens nor shuts it. |
| 5 | Names final | **Shut** | See *Gate 5* below. `docs/job-position-prop-names.md:19-30` proposes four prop names (`openingsText`, `openingsIcon`, `genderText`, `genderIcon`) as "**suggestions for review**", and no owner decision on those names is recorded. |
| 6 | States complete | **Open** | See *Gate 6* below. 32:258 has no variant set and no states. The owner's ruling to build none is at `docs/job-position-prop-names.md` (*States: none, by owner decision (2026-10-09)*). Its one boolean has a story for each value, and all four Staging Testing rows read `Passed`. |
| 7 | Version meaning known | **Open** | `docs/versioning.md` exists at the commit. JobPosition is **New, MINOR**: it has never been exported (`git tag -l 'v*'` is empty, and `src/index.ts` does not export it). `docs/versioning.md:26`: "**New**: first time it is exported. MINOR." The banner at `:3` still reads "Draft for the owner's review."; as in earlier reviews, the file is treated as the policy in force because a human merged it in #118. |

### Gate 5

`docs/job-position-prop-names.md:8-11` maps the two Figma properties:

| Figma property | Prop |
| --- | --- |
| `jobTitle` (text) | `jobTitle` |
| `showLabel` (boolean) | `showLabel` |

The code also takes four props that have no Figma property
(`JobPosition.jsx:28-37`): `openingsText`, `openingsIcon`, `genderText` and
`genderIcon`. The owner's 2026-10-09 ruling, quoted in the same file, settles
*that* the pill texts and icons are props. It does not settle what they are
called. `docs/job-position-prop-names.md:17-23`:

> Figma has no component property for the two pills' text or icon; they are
> instance overrides. The owner ruled that the texts and icons are sample
> defaults that must change per use, so they are props. The names below are
> **suggestions for review**.

| Suggested prop | Passed to | Default |
| --- | --- | --- |
| `openingsText` | first Label's `labelText` | `"3 openings"` |
| `openingsIcon` | first Label's `swapIcon` | `UsersRound` |
| `genderText` | second Label's `labelText` | `"opens to male"` |
| `genderIcon` | second Label's `swapIcon` | `VenusAndMars` |

The component's own comment says the same (`JobPosition.jsx:9-11`: "The names
are proposed for review in docs/job-position-prop-names.md"). So do the
story's docs (`JobPosition.stories.jsx:23-24`: "proposed in
docs/job-position-prop-names.md"). No file under `docs/` records the owner's
decision on these four names. Compare `docs/employer-profile-prop-names.md`,
whose one prop with no Figma property records "The owner approved this name
on 2026-10-08."

Under the gate, "an open suggestion shuts the gate". Four are open. These
names are part of the documented API (`docs/versioning.md`, *What is
versioned*). Renaming one after the first publish would be a Breaking change.

Also noted, not counted as a second finding: `:13-15` says the spelling of
`jobTitle` and `showLabel` in the Figma panel "could not be read through the
API, so the Designer should confirm them". As with Label and EmployerProfile
(`reports/release-review/EmployerProfile-6fcf856.md`, gate 5), this review
reads that as no open suggestion.

### Gate 6

Figma 32:258 has no variant set and no interaction states. Its one boolean,
`showLabel`, has a story for each value: `Default` at
`JobPosition.stories.jsx:54` and `WithoutLabel` at `:59`. The owner's
long-title ruling has its own story (`LongTitleNarrowContainer`, `:67`), and
so does the pill-props ruling (`CustomLabels`, `:88`). The `Tokens` story
(`:104`) is a reference table, not a state. The four linked Staging Testing
rows:

| Row | Result | Context |
| --- | --- | --- |
| CardContent/JobPosition / showLabel=true | Passed | Tested on staging `9c5d41344c6a594836f1c7de1b2b3edcc40ad8cb` (back-office token re-test); earlier web-scale pass on `7baa42a` kept |
| CardContent/JobPosition / showLabel=false | Passed | same |
| CardContent/JobPosition / long title, narrow parent | Passed | same |
| CardContent/JobPosition / custom pill content | Passed | same |

`9c5d413` and `7baa42a` are both ancestors of the reviewed commit. Here is
what changed after `9c5d413` in JobPosition, in Label (which it imports) and
in `src/styles.css`, from
`git diff 9c5d413 2e7d9c7 -- src/components/JobPosition src/components/Label src/styles.css`:

- the intent files (`JobPosition.intent.json`, `Label.intent.json`), which QA
  does not test;
- `JobPosition.jsx` and `Label.jsx` each losing `import './X.css';`, with
  `src/styles.css` importing the stylesheets instead (`a91a822`, merged in
  #122 as `d22ee86`). That merge is waived in `docs/retest-waivers.md`;
- Label's `normal` category (`13fb6b0`, merged in #110 as `b1bf351`). It
  adds `.label--normal` rules and comments to `Label.css:111-123` and
  `Label.jsx`, and changes no rule for `.label--brand`, the only category
  JobPosition renders (`JobPosition.jsx:43-44`). Production commit `376c4f5`
  already contains it. Labelled additive here; no waiver names this merge
  for JobPosition, and that is the owner's call, not a gate finding.
- `Label.stories.jsx`, which JobPosition does not use.

Every row's Context records "Screenshots waived by owner".

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
`variant_intent` (`{}`), `placement` (empty), `pairs_with` (1 entry:
`CardHeader`, source `src/components/CardHeader/CardHeader.jsx:2`, which is
`import { JobPosition } from '../JobPosition/JobPosition';`),
`required_tokens` (4) and `a11y` (1). Every non-empty entry has a `source`,
and `use_when` is not empty.

### Check 2: Every `dont_use_when` names an alternative (pass, nothing to judge)

`dont_use_when` is empty. 32:258 carries only a component description and no
Do/Don't usage region, so the intent has nothing to carry.

### Check 3: `a11y` specific, not generic (pass)

| Entry | Source | At `2e7d9c7` |
| --- | --- | --- |
| "The job title is a <p> whose title attribute carries the full title." | `src/components/JobPosition/JobPosition.jsx:41` | Line 41 is `{showLabel && (`. The element is at `:40`: `<p className="job-position__title" title={jobTitle}>{jobTitle}</p>`. |

The entry names an element (`<p>`) and an attribute (`title`) that can be
checked, and the code does what it says. The citation is one line off,
because #122 (`a91a822`) removed the CSS import on line 3 after the intent
was written. Under the owner's 2026-10-15 ruling that passes, and it is
reported here. QA's long-title row confirms that the full title is in the
`title` attribute on the deployed build.

### Check 4: `required_tokens` resolve (pass)

Each of the four tokens listed is defined in `build/css/` at the commit:

- `--spacing-gap-sm` and `--spacing-gap-xxs` in `tokens.css` and
  `tokens-back-office.css`;
- `--text-neutral-bold` in `tokens.css` and `tokens-dark.css`;
- `--title-md` in `tokens.css`.

`JobPosition.css` references exactly those four `var(--…)`s, and
`JobPosition.jsx` references none, so the list and the code match in both
directions. Label's tokens belong to Label and are listed in
`Label.intent.json`.

### Check 5: All variants covered (pass)

The code accepts no variant prop. Figma 32:258 has no variant set. Its
properties are one text property (`jobTitle`) and one boolean (`showLabel`).
In every earlier review, Figma booleans were not counted as variant props, so
`variant_intent` is `{}` here and nothing is left uncovered. The Labels are
rendered at a fixed `category="brand" size="md" state="idle"`
(`JobPosition.jsx:43-44`), which is not exposed as a prop.

Not variant props: `jobTitle` (text), `showLabel` (boolean), `openingsText`
and `genderText` (text), `openingsIcon` and `genderIcon` (a Lucide
component), `className`, `...rest`.

### Check 6: No two components claim the same job (pass)

JobPosition's one `use_when` entry was compared with every `use_when` entry
in the other 19 intent files at the commit. The nearest entries:

| JobPosition `use_when` | Other `use_when` | Judgement |
| --- | --- | --- |
| "used for job listing cards, job position title and, how many position opens for this job title and which gender they prefer" (`Figma 32:258 (CardContent/JobPosition component description, paragraph 1)`) | CardItem: "this can be used with card container to post job listing" (`Figma 32:651 (CardContent/CardItem component description, paragraph 1)`) | CardItem is the whole listing. It composes CardHeader, which imports JobPosition (`CardHeader.jsx:2`). One is built from the other. Not a finding. |
| same | EmployerProfile: "it serves as profile, avatar can change as image, icon and circle shape. It can be used as user profile and brand profile, also in job category." (`Figma 32:337 (CardContent/EmployerProfile component description, paragraph 1)`) | EmployerProfile claims a profile. JobPosition claims a job title, its openings and the preferred gender. Neither text claims what the other does, and they sit side by side in CardHeader (`CardHeader.jsx:1-2`). Same pair, same judgement as `reports/release-review/EmployerProfile-6fcf856.md`. Not a finding. |
| same | Target: "there may be small field like experience, salary and job type, use this target format by changing text" (`Figma 32:273 (CardContent/Target component description, paragraph 1)`) | Target claims small fields such as experience, salary and job type. JobPosition claims the title, openings and gender. No shared situation. Not a finding. |
| same | Label: "Use labels to provide short, meaningful contextual information." (`Figma 71:2279 (Label Doc Frame › Do, text I71:2279;2406:461;71:2275)`) | JobPosition imports Label for its pills (`JobPosition.jsx:2`). One is built from the other. Not a finding. |

## Noted for the owner, not a gate or check

**Usage region.** 32:258 carries only a component description and no Do/Don't
usage region. As a result `dont_use_when` is empty and `use_when` has one
entry. This fails no check.

**Pill padding.** Figma's 4px pill padding is still deferred to a Label
padding prop, by the owner's 2026-10-09 ruling. When it lands, JobPosition's
pills changing to `xs` is a visible change. Under `docs/versioning.md` that is
a PATCH (a fix that makes a component match Figma), unless it adds a prop to
JobPosition.

**Typing gap.** `JobPosition.jsx:28-37` gives `className` no default, the same
pattern as ButtonCTA, Label and EmployerProfile. Under the owner's 2026-10-15
ruling this does not block an export; it is to be fixed before the npm
publish.

**Publish held.** Under the owner's 2026-10-15 ruling, version 0.1.0 is
approved, but the publish waits until every component is Cleared.

## What each owner is waiting on

- **Owner** (gate 5, shut): decide the names of the four pill props
  `openingsText`, `openingsIcon`, `genderText` and `genderIcon`, proposed as
  "suggestions for review" in `docs/job-position-prop-names.md:17-30`.
  Approving them as they are, or renaming them (adding Figma properties to
  32:258 first, as with TextArea), needs a recorded decision under `docs/`.
- **Owner** (gate 5, informational): the Designer has still to confirm the
  Figma-panel spelling of `jobTitle` and `showLabel`
  (`docs/job-position-prop-names.md:13-15`). Read here as no open suggestion,
  as for Label and EmployerProfile.
- **Owner** (check 3, informational): the a11y citation is one line off after
  #122 (`:41` is now `:40`). This passes under the 2026-10-15 ruling. A
  doc-generator re-transpose would correct it if wanted.
- **Owner** (gate 7, informational): the banner in `docs/versioning.md` still
  calls the file a draft.
- **Designer, through the owner** (informational): 32:258 has no Do/Don't
  usage region.
