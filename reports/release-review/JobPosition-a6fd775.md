# Release review: JobPosition at a6fd775

| | |
| --- | --- |
| Component | JobPosition (`src/components/JobPosition/`), Figma `CardContent/JobPosition` 32:258, registry row "CardContent/JobPosition" (`recKPVhyWxdrxwBws`) |
| Reviewed commit | `a6fd7757c3f6361cbad1abc81d9ba01c113ea1da` (`main` HEAD, "Merge pull request #194 from wah-ag/staging") |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`) |
| Reviewed at | 2026-10-17T10:30:25Z |
| **Verdict** | **Cleared**: all seven gates are open, and checks 1, 3, 4, 5 and 6 pass. Check 2 has no entries to judge. |

This is JobPosition's second release review. The first,
`reports/release-review/JobPosition-2e7d9c7.md` (#189, merged as `780187a`),
was Blocked on gate 5 only. The registry still holds that report and its
Blocked verdict.

What changed since then, in `git log 780187a..a6fd775 -- src/components/JobPosition`:

- `c32e905` (#190, merged as `fde3329`): the four pill props `openingsText`,
  `openingsIcon`, `genderText` and `genderIcon` are replaced by
  `openingsLabel` and `genderLabel`, two pass-through objects of Label props
  named after the exposed Figma instances. The owner's 2026-10-17 decision is
  recorded in `docs/job-position-prop-names.md`.
- `fedf346` (#192, merged as `4ab31d9`): intent refresh. `use_when` was
  re-copied from the Designer's reworded description, and the a11y citation
  moved to `JobPosition.jsx:49`. The owner waived it in
  `docs/retest-waivers.md` (#193).
- Shipped to `main` by #194 (`a6fd775`), the reviewed commit.

This review read a clean, detached checkout of exactly the reviewed commit
(`git worktree add --detach`, no local changes), after `npm ci` and
`npm run build:tokens`.

These owner rulings were applied and are not raised again
(`docs/job-position-prop-names.md`):

- 2026-10-09: the pills render at Label's own md padding, and Figma's 4px
  override is not built.
- 2026-10-09: the component hugs its content. A long title stays on one line
  and ends in an ellipsis, and the pill row stays on one line and may
  overflow.
- 2026-10-09: there are no interaction states.
- 2026-10-09: DM Sans renders at opsz 12, against Figma's 14.
- 2026-10-17: the pill props are a pass-through.

Two more rulings come from elsewhere:

- 2026-10-15: publishing is held until every component is Cleared. This is
  noted here, not counted as a finding.
- 2026-10-17: the CardHeader and CardItem stories still pass the old prop
  names. That goes to a later ship and is outside JobPosition's folder (see
  *Noted*).

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/JobPosition/JobPosition.intent.json` exists at the commit and parses (`JSON.parse` in Node prints `parses`). Last written by `fedf346` (#192). |
| 2 | Development is Completed | **Open** | Components row `recKPVhyWxdrxwBws` reads `Development = Completed`, with Design `Done` and Results Summary `Passed`. Production Storybook: `https://flex-ds-sigma.vercel.app/?path=/story/components-cardcontent-jobposition--default`. Commit: `https://github.com/wah-ag/flex-ds/commit/a6fd7757c3f6361cbad1abc81d9ba01c113ea1da`, which is the reviewed commit itself. |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0: "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0: "✔ Modes match and every alpha token carries alpha." The reviewed commit is `origin/main`, so `tokens/` equals `main`. `origin/staging` (`10b3f48`) is an ancestor of `origin/main`, and `git diff --stat origin/main origin/staging` is empty, so no token sync is waiting. `gh pr list --state open` returns `[]`. |
| 4 | Public surface decided | **Open** | It is public: it has a Components row (`recKPVhyWxdrxwBws`) and a Figma node (32:258). Nothing under `docs/` declares it internal; `src/index.ts:4-6` names only FieldControl and FieldLabel as internal. `src/index.ts` does not export JobPosition yet (`:15-24`). Under this gate, that neither opens nor shuts it. |
| 5 | Names final | **Open** | See *Gate 5* below. Every prop is named after a Figma property or an exposed Figma instance. The four earlier suggestions are removed, and the owner's decision is recorded (`docs/job-position-prop-names.md:22-47`). No suggestion is left open. |
| 6 | States complete | **Open** | See *Gate 6* below. 32:258 has no variant set and no states. The owner's ruling to build none is at `docs/job-position-prop-names.md:141-145`. The one boolean has a story for each value, and all four Staging Testing rows read `Passed` on `fde3329`, the merge that brought the newest code. |
| 7 | Version meaning known | **Open** | `docs/versioning.md` exists at the commit. JobPosition is **New, MINOR**: it has never been exported (`git tag -l 'v*'` is empty, and `src/index.ts` does not export it). `docs/versioning.md:26` reads: "**New**: first time it is exported. MINOR." The #190 prop change happened before any publish, so it is part of the new API, not a Breaking change. The banner at `:3` still reads "Draft for the owner's review."; as in earlier reviews, the file is treated as the policy in force because a human merged it in #118. |

### Gate 5

`docs/job-position-prop-names.md:8-13` maps every prop to Figma:

| Figma | Prop |
| --- | --- |
| `jobTitle` (text) | `jobTitle` |
| `show label` (boolean) | `showLabel` (camelCase convention, `docs/button-cta-prop-names.md`) |
| exposed instance `openingsLabel` (32:239, Label) | `openingsLabel` |
| exposed instance `genderLabel` (32:247, Label) | `genderLabel` |

The Figma panel spellings were read through the Plugin API on 2026-10-17
(`:15-20`, evidence at `:69-90`). That settles the "Designer should confirm"
note that the previous review listed as informational.

The owner's decision on the pill props is quoted at `:31-40`:

> "I want different names for the JobPosition pill props; the Designer will
> add Figma properties on 32:258 first."

The owner also chose "Pass-through (Recommended)", and after the Designer's
change said "yes I update it check it". `:42` reads: "The four suggested
props are removed." The code matches. `JobPosition.jsx:39-46` takes
`jobTitle`, `showLabel`, `openingsLabel`, `genderLabel`, `className` and
`...rest`, and nothing else. Each pill object is spread after the Figma
defaults (`:52-53`). Inside the objects, the keys are Label's own props,
whose names are settled in `docs/label-prop-names.md` (`:49-59`).

No file under `docs/` holds an open naming suggestion for JobPosition.

### Gate 6

Figma 32:258 has no variant set and no interaction states, by owner ruling
(`docs/job-position-prop-names.md:141-145`). These stories are in
`JobPosition.stories.jsx` at the commit:

- `showLabel` true: `Default` (`:55`).
- `showLabel` false: `WithoutLabel` (`:60`).
- The long-title ruling: `LongTitleNarrowContainer` (`:68`).
- The pass-through pill props: `CustomLabels` (`:89`), which passes
  `openingsLabel: { labelText: '1 opening' }` and
  `genderLabel: { labelText: 'opens to female', swapIcon: Venus }`
  (`:92-93`).
- `Tokens` (`:110`), a reference table rather than a state.

The four linked Staging Testing rows:

| Row | Result | Context |
| --- | --- | --- |
| CardContent/JobPosition / showLabel=true | Passed | Tested on staging `fde3329b45475b5f596cba1d755edfc2dc304bd9` (merge of PR #190), forced full-matrix retest 2026-10-17, web and back-office |
| CardContent/JobPosition / showLabel=false | Passed | same commit |
| CardContent/JobPosition / long title, narrow parent | Passed | same commit |
| CardContent/JobPosition / custom pill content | Passed | same commit, through the new `openingsLabel` / `genderLabel` API |

`fde3329` is an ancestor of the reviewed commit. Between `fde3329` and
`a6fd775`, `git diff --stat fde3329 a6fd775 -- src/components/JobPosition src/components/Label src/styles.css`
shows only `JobPosition.intent.json` (2 insertions, 2 deletions). QA does not
test intent files, and that merge (`4ab31d9`, #192) is waived in
`docs/retest-waivers.md`. Every row records "Screenshots waived by the owner
this round (2026-10-17)".

## Checks

| # | Check | Result |
| --- | --- | --- |
| 1 | Fields present | **Pass** |
| 2 | Every `dont_use_when` names an alternative | **Pass** (no entries; nothing to warn on) |
| 3 | `a11y` specific, not generic | **Pass** (the citation is exact) |
| 4 | `required_tokens` resolve | **Pass** |
| 5 | All variants covered | **Pass** (no variant props; `variant_intent` is `{}`) |
| 6 | No two components claim the same job | **Pass** |

### Check 1: Fields present (pass)

All seven keys are present:

- `use_when`: 1 entry.
- `dont_use_when`: empty.
- `variant_intent`: `{}`.
- `placement`: empty.
- `pairs_with`: 1 entry, `CardHeader`, source
  `src/components/CardHeader/CardHeader.jsx:2`.
- `required_tokens`: 4 tokens.
- `a11y`: 1 entry.

Every non-empty entry has a `source`, and `use_when` is not empty.

### Check 2: Every `dont_use_when` names an alternative (pass, nothing to judge)

`dont_use_when` is empty. 32:258 carries only a component description and no
Do/Don't usage region.

### Check 3: `a11y` specific, not generic (pass)

| Entry | Source | At `a6fd775` |
| --- | --- | --- |
| "The job title is a <p> whose title attribute carries the full title." | `src/components/JobPosition/JobPosition.jsx:49` | Line 49 is `<p className="job-position__title" title={jobTitle}>{jobTitle}</p>`. |

The entry names an element (`<p>`) and an attribute (`title`) that can be
checked, and the code does what it says. The previous review found the
citation one line off; #192 fixed it, and it is now exact. QA's long-title row
confirms on the deployed build that the full title is in the `title`
attribute.

### Check 4: `required_tokens` resolve (pass)

Each of the four listed tokens is defined in `build/css/` at the commit:

- `--spacing-gap-sm` and `--spacing-gap-xxs` in `tokens.css` and
  `tokens-back-office.css`;
- `--text-neutral-bold` in `tokens.css` and `tokens-dark.css`;
- `--title-md` in `tokens.css`.

`JobPosition.css` references exactly those four `var(--…)`s, and
`JobPosition.jsx` references none, so the list and the code match in both
directions. Label's tokens belong to Label and are listed in
`Label.intent.json`.

### Check 5: All variants covered (pass)

JobPosition accepts no variant prop of its own, and Figma 32:258 has no
variant set. `jobTitle` is text and `showLabel` is a boolean; Figma booleans
have not been counted as variant props in any review.

`openingsLabel` and `genderLabel` are objects of Label props. A consumer can
pass Label's `category`, `size` or `state` through them. Those variants are
Label's, and `Label.intent.json` covers them under `variant_intent`
(`category`: brand, info, success, error, warning, normal; `size`: lg, md,
sm; `state`: idle, hover). This review does not count them as JobPosition
variants. That matches the pass-through precedent: BtnGroup's
`buttonCTAProps` carries ButtonCTA's variants, and BtnGroup's own
`variant_intent` is `{}`. The defaults are `brand / md / idle`
(`JobPosition.jsx:35`).

### Check 6: No two components claim the same job (pass)

JobPosition's one `use_when` entry was compared with every `use_when` entry in
the other 19 intent files at the commit. The nearest entries:

| JobPosition `use_when` | Other `use_when` | Judgement |
| --- | --- | --- |
| "used for job listing cards, job position title and labels that show how many position opens for this job title and which gender they prefer" (`Figma 32:258 (CardContent/JobPosition component description, paragraph 1)`) | CardItem: "this can be used with card container to post job listing" (`Figma 32:651 (CardContent/CardItem component description, paragraph 1)`) | CardItem is the whole listing. It composes CardHeader, which imports JobPosition (`CardHeader.jsx:2`), so one is built from the other. Not a finding. |
| same | EmployerProfile: "it serves as profile, avatar can change as image, icon and circle shape. It can be used as user profile and brand profile, also in job category." (`Figma 32:337 (CardContent/EmployerProfile component description, paragraph 1)`) | EmployerProfile claims a profile. JobPosition claims a job title with its openings and preferred gender. The two sit side by side in CardHeader. Not a finding. |
| same | Target: "there may be small field like experience, salary and job type, use this target format by changing text" (`Figma 32:273 (CardContent/Target component description, paragraph 1)`) | Target claims small fields such as experience, salary and job type. JobPosition claims the title, openings and gender. No shared situation. Not a finding. |
| same | Label: "Use labels to provide short, meaningful contextual information." (`Figma 71:2279 (Label Doc Frame › Do, text I71:2279;2406:461;71:2275)`) | JobPosition imports Label for its pills (`JobPosition.jsx:2`), so one is built from the other. Not a finding. |

## Noted for the owner, not a gate or check

**Old prop names in the composing stories.** Two stories outside
JobPosition's folder still pass the removed prop names:

- `src/components/CardHeader/CardHeader.stories.jsx:89`:
  `jobPositionProps: { jobTitle: 'Staff Frontend Engineer', openingsText: '1 opening' }`
- `src/components/CardItem/CardItem.stories.jsx:95`:
  `jobPositionProps: { ..., openingsText: '1 opening', genderText: 'open to all' }`

At this commit, JobPosition spreads unknown props onto its root `<div>`
(`JobPosition.jsx:45,48`), so in those stories the pills show their defaults
rather than the story's text. The owner accepted on 2026-10-17 that this
waits for a later ship. Neither component is in this review.

**Usage region.** 32:258 still carries only a component description and no
Do/Don't usage region.

**Pill padding.** Figma's 4px pill padding is still deferred to a Label
padding prop. Once that exists, `openingsLabel` / `genderLabel` can carry it
with no JobPosition API change.

**Typing gap.** `JobPosition.jsx:39-46` gives `className` no default, the same
pattern as ButtonCTA, Label and EmployerProfile. Under the owner's 2026-10-15
ruling, this does not block an export; it is to be fixed before the npm
publish.

**Publish held.** Under the owner's 2026-10-15 ruling, version 0.1.0 is
approved, but publishing waits until every component is Cleared.

## What each owner is waiting on

No gate is shut and no check failed. These lines are informational:

- **Owner** (gate 7): the banner in `docs/versioning.md` still calls the file
  a draft.
- **Owner** (noted): CardHeader and CardItem stories still pass
  `openingsText` / `genderText`, as accepted on 2026-10-17 for a later ship.
- **Designer, through the owner**: 32:258 has no Do/Don't usage region.
