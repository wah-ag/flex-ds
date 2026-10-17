# Release review: NavLabel at c08b62f

| | |
| --- | --- |
| Component | NavLabel (`src/components/NavLabel/`), Figma `Header/NavLabel` 55:34, registry row "Header/NavLabel" (`rechwJYBFIUMleFcf`) |
| Reviewed commit | `c08b62fff5dded75a7de3d175d66861ded40da12` (`main` HEAD, "Merge pull request #197 from wah-ag/staging") |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`) |
| Reviewed at | 2026-10-17T15:18:56Z |
| **Verdict** | **Blocked**: gate 5 (names final) is shut, because the `type` → `state` rename suggestion has no recorded owner decision. Check 3 (`a11y` specific) fails, because all three source citations now point three lines away from the code they describe, which is outside the owner's off-by-one ruling. Gates 1-4, 6 and 7 are open, and checks 1, 4, 5 and 6 pass. Check 2 gives a warning, which does not change the verdict. |

This is NavLabel's first release review.

This review read a clean, detached checkout of exactly the reviewed commit
(`git worktree add --detach`, no local changes), after `npm ci` and
`npm run build:tokens`.

These owner rulings were applied and are not raised again
(`docs/nav-label-prop-names.md:55-117`):

- 2026-10-04 ("gaps can accept"): the underline is 4 high and its top-left
  radius is 4, both unbound and used as Figma draws them. Width has no token,
  so the label hugs its content. No focused, pressed or disabled state is
  designed. The variable name `var(--border-radius-control-2xs)` is accepted
  as it is.
- 2026-10-14 (#113, #114): the hover underline has no fill but keeps its
  4-high slot, active paints the bar, and idle (191:1243) keeps the empty
  slot ("option a").
- 2026-10-14 (#115, `857f997`): the text slot hugs its line height and sits
  at y 12.
- 2026-10-14: for the re-ship, the idle, active and both showNavLine-off rows
  (tested on `a265879`) stand as Passed with no retest.
- 2026-10-14 (#122, `d22ee86`): the CSS import moved into `styles.css` with no
  QA retest (`docs/retest-waivers.md`).
- 2026-10-15: publishing is held until every component is Cleared. This is
  noted here and not counted as a finding.

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/NavLabel/NavLabel.intent.json` exists at the commit and parses (`JSON.parse` in Node prints `parses`). It was last written by `bfbc460` (#108, 2026-10-13). |
| 2 | Development is Completed | **Open** | Components row `rechwJYBFIUMleFcf` reads `Development = Completed`, with Design `Done` and Results Summary `Passed`. Production Storybook: `https://flex-ds-sigma.vercel.app/?path=/story/components-header-navlabel--idle`. Commit: `https://github.com/wah-ag/flex-ds/commit/376c4f5a3f3a73637276b1ac856df44f16cbffaa`. Release Review, Release Verdict and Astro Link are empty. |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0 ("✔ Tokens built → build/css, build/ios, build/android"). `npm run check:tokens` exits 0 ("✔ Modes match and every alpha token carries alpha."). The reviewed commit is `origin/main`, so `tokens/` equals `main`. `origin/staging` (`fde047d`) is an ancestor of `origin/main`, and `git diff --stat origin/main origin/staging` is empty, so no token sync is waiting. `gh pr list --state open` returns `[]`. |
| 4 | Public surface decided | **Open** | It is public: it has a Components row (`rechwJYBFIUMleFcf`) and a Figma node (55:34). Nothing under `docs/` declares it internal, and `src/index.ts:4-6` names only FieldControl and FieldLabel as internal. `src/index.ts` does not export NavLabel yet (`:15-25`). Under this gate, that neither opens nor shuts it. |
| 5 | Names final | **Shut** | See *Gate 5* below. `docs/nav-label-prop-names.md:29-36` holds a suggested rename, `type` → `state`, marked "(not applied)", and records no owner decision. |
| 6 | States complete | **Open** | See *Gate 6* below. Figma's three variants (idle, hover, active) each have a story and a `Passed` row. The focused, pressed and disabled states are left out by the owner's ruling at `docs/nav-label-prop-names.md:109-113`. |
| 7 | Version meaning known | **Open** | `docs/versioning.md` exists at the commit. NavLabel is **New, MINOR**: it has never been exported (`git tag -l 'v*'` is empty, and `src/index.ts` does not export it). `docs/versioning.md:26` reads: "**New**: first time it is exported. MINOR." The 2026-10-14 changes (#113-#115) happened before any publish, so they are part of the new component, not a Breaking or Changed class. The banner at `:3` still reads "Draft for the owner's review."; as in earlier reviews, the file is treated as the policy in force because a human merged it in #118. |

### Gate 5 (shut)

`docs/nav-label-prop-names.md:9-13` maps each Figma property to its prop:

| Figma property | Prop | Default |
| --- | --- | --- |
| `type` (variant: idle, hover, active) | `type` | `idle` |
| `navLabelText` (text) | `navLabelText` | `Nav Label` |
| `showNavLine` (boolean) | `showNavLine` | `true` |

`NavLabel.jsx:29-35` takes exactly these, plus `className` and `...rest`, so
the code matches Figma's names.

The file also holds an open suggestion, `:29-36`:

> #### Suggested rename (not applied)
>
> | `type` | `state` | It holds idle, hover and active, which are states. `state` is the name Label, TextArea and the other components already use for the same idea, and it does not shadow the HTML `type` attribute. |
>
> The prop keeps the Figma name until the Designer renames the property in
> Figma, or a human decides otherwise.

Neither has happened. The file records no owner decision on it, either
"keep `type`" or "rename". None of the owner rulings dated 2026-10-04 or
2026-10-14 in the same file is about this name. An open suggestion shuts the
gate. This is the same reading as the first TextArea (`5c32a57`) and
JobPosition (`2e7d9c7`) reviews.

`:21-27` explains why `type` was kept as spelled. NavLabel consumes `type` and
never forwards it, so it never reaches the `<a>`'s own HTML `type`
attribute. That is the reason the suggestion was not applied. It does not
record a decision.

Informational, not part of the shut gate: `:15-17` says the Figma panel
spelling of `navLabelText` and `showNavLine` "was not readable through the
API and should be confirmed by the Designer".

### Gate 6 (open)

Figma 55:34 has three variants: `type=idle` (191:1243), `type=hover` (55:32)
and `type=active` (55:33) (`docs/nav-label-prop-names.md:3-5`). The owner
ruled on 2026-10-04 that no focused, pressed or disabled state is designed and
none is invented (`:109-113`).

These stories are in `NavLabel.stories.jsx` at the commit:

| Story | Args | Line |
| --- | --- | --- |
| `Idle` | `type: 'idle'`, `showNavLine: true` | `:58` |
| `Hover` | `type: 'hover'`, `showNavLine: true` | `:59` |
| `Active` | `type: 'active'`, `showNavLine: true` | `:60` |
| `HoverNoNavLine` | `type: 'hover'`, `showNavLine: false` | `:61` |
| `ActiveNoNavLine` | `type: 'active'`, `showNavLine: false` | `:62` |

The five linked Staging Testing rows:

| Row | Result | Context (tested commit) |
| --- | --- | --- |
| Header/NavLabel / idle | Passed | `a2658797479c2967942b6c225c7f1f6bf48d16ea` |
| Header/NavLabel / hover | Passed | `cb5ca0003428d43da861eb13fe2b5bd9c89615f7` (merge of #115, `857f997`) |
| Header/NavLabel / active | Passed | `a2658797479c2967942b6c225c7f1f6bf48d16ea` |
| Header/NavLabel / hover, showNavLine off | Passed | `a2658797479c2967942b6c225c7f1f6bf48d16ea` |
| Header/NavLabel / active, showNavLine off | Passed | `a2658797479c2967942b6c225c7f1f6bf48d16ea` |

Both tested commits are ancestors of the reviewed commit. The four rows on
`a265879` predate #113-#115. The owner ruled on 2026-10-14 that they stand as
Passed for the re-ship ("They stand, ship now"). Since `cb5ca00`,
`git diff --stat cb5ca00 c08b62f -- src/components/NavLabel` shows one line
removed from `NavLabel.jsx`. That is the #122 CSS import move (`d22ee86`),
which is waived in `docs/retest-waivers.md`.

`showNavLine` is a Figma boolean, not a state. Booleans have not been counted
as states in any review. There is no story or row for idle with
`showNavLine` off. It is listed here for completeness and is not a finding.

**Owner question, not a finding.** With `showNavLine` off, the text sits at
the bottom of the 48-high box (y 24), as Figma's auto layout draws it with
Nav Underline hidden (`docs/nav-label-prop-names.md:93-95`,
`NavLabel.css:79-83`). The owner has never ruled on whether the Designer
wants it centred. That does not shut this gate: the rows passed against
Figma's layout. It is raised for the owner below.

## Checks

| # | Check | Result |
| --- | --- | --- |
| 1 | Fields present | **Pass** |
| 2 | Every `dont_use_when` names an alternative | **Warning** (1 entry names none) |
| 3 | `a11y` specific, not generic | **Fail** (all three citations point three lines away from the behaviour, outside the off-by-one ruling) |
| 4 | `required_tokens` resolve | **Pass** |
| 5 | All variants covered | **Pass** |
| 6 | No two components claim the same job | **Pass** |

### Check 1: Fields present (pass)

All seven keys are present:

- `use_when`: 1 entry.
- `dont_use_when`: 1 entry.
- `variant_intent`: `type` with `idle`, `hover` and `active`.
- `placement`: empty.
- `pairs_with`: 1 entry, `NavItems`, source
  `src/components/NavItems/NavItems.jsx:2`.
- `required_tokens`: 8 tokens.
- `a11y`: 3 entries.

Every non-empty entry has a `source`, and `use_when` is not empty. The
`pairs_with` citation was re-read at the commit and is correct:
`NavItems.jsx:2` is `import { NavLabel } from '../NavLabel/NavLabel';`.

### Check 2: Every `dont_use_when` names an alternative (warning)

- "don't use on side navigation" (source: `Figma 55:34 (Header/NavLabel component description, paragraph 1, second clause)`)

It names neither another component nor another variant to use instead. This
is a warning only. This review does not suggest an alternative.

### Check 3: `a11y` specific, not generic (fail)

| Entry | Source | At `c08b62f` |
| --- | --- | --- |
| "Renders a native <a>; `href` and other attributes pass through." | `src/components/NavLabel/NavLabel.jsx:36` | Line 36 is `const look = TYPES.includes(type) ? type : 'idle';`. The `<a` is at line 39, and `{...rest}` is at line 41. |
| "Sets aria-current=\"page\" when type=\"active\"." | `src/components/NavLabel/NavLabel.jsx:37` | Line 37 is blank. `aria-current={look === 'active' ? 'page' : undefined}` is at line 40. |
| "The underline is aria-hidden=\"true\"." | `src/components/NavLabel/NavLabel.jsx:43` | Line 43 is `data-type={look}`. `{showNavLine && <span className="nav-label__line" aria-hidden="true" />}` is at line 46. |

Each entry names something checkable: an element (`<a>`), an attribute
(`aria-current="page"`) and `aria-hidden="true"`. The behaviour each entry
describes is still true at the commit. The code does what the entries say,
so this is not a build-state finding.

The sources no longer point at that behaviour. At `bfbc460`, when the intent
was last written, the `<a` was at line 36, `aria-current` at 37 and
`aria-hidden` at 43. After that, #113, #114 and #115 (`309f95e`, `faa017e`,
`857f997`) added comment lines to the header block, and #122 (`a91a822`)
removed the `import './NavLabel.css';` line. The net shift is three lines,
and each cited line now holds different code. The owner's ruling of
2026-10-15 ("The a11y citations being one line off doesn't fail check 3")
covered a one-line shift. This review does not extend it to this case. The
CardContainer review at `a864dd8` read a three-line shift the same way.

### Check 4: `required_tokens` resolve (pass)

Each of the eight listed tokens is defined in `build/css/` at the commit:

| Token | Defined in |
| --- | --- |
| `--background-interactive-brand-idle` | `tokens.css`, `tokens-dark.css` |
| `--border-radius-control-2xs` | `tokens.css`, `tokens-back-office.css` |
| `--size-control-lg` | `tokens.css`, `tokens-back-office.css` |
| `--spacing-gap-sm` | `tokens.css`, `tokens-back-office.css` |
| `--spacing-padding-sm` | `tokens.css`, `tokens-back-office.css` |
| `--text-interactive-brand-idle` | `tokens.css`, `tokens-dark.css` |
| `--text-neutral-primary` | `tokens.css`, `tokens-dark.css` |
| `--title-md` | `tokens.css` |

`NavLabel.css` references exactly those eight `var(--…)`s, and
`NavLabel.jsx` references none, so the list and the code match in both
directions. The two raw `4px` values (`NavLabel.css:105`, `:109`) are the
owner's 2026-10-04 exceptions and reference no token.

### Check 5: All variants covered (pass)

The one variant prop is `type`. The code accepts `idle`, `hover` and `active`
(`NavLabel.jsx:27`) and falls back to `idle` for anything else (`:36`).
`variant_intent.type` has all three as keys. Every meaning is `null`, which
counts as covered:

- `type.idle`: `null`
- `type.hover`: `null`
- `type.active`: `null`

`navLabelText` is text and `showNavLine` is a boolean. Figma booleans have not
been counted as variant props in any review.

### Check 6: No two components claim the same job (pass)

NavLabel's one `use_when` entry was compared with every `use_when` entry in
the other 19 intent files at the commit. The nearest entries:

| NavLabel `use_when` | Other `use_when` | Judgement |
| --- | --- | --- |
| "used as a header navigation label" (`Figma 55:34 (Header/NavLabel component description, paragraph 1, first clause)`) | NavItems: "call to action from user like help, notification and messages together with user profile" (`Figma 58:406 (Header/NavItems component description, paragraph 1)`) | NavItems imports NavLabel (`NavItems.jsx:2`), so one is built from the other. NavItems claims the header's action group, and NavLabel claims a navigation label. Not a finding. |
| same | IconButton: "it serves as icon button and use in header, back office table row actions" (`Figma 45:324 (IconButton component description, paragraph 1)`) | IconButton claims an icon-only action. NavLabel claims a text navigation label. Both appear in the header, but they do not do the same job there. Not a finding. |

Two `dont_use_when` entries elsewhere mention navigation. ButtonCTA has
"Don’t use buttons for navigation when a link is more appropriate." and
CardContainer mentions "app bars and navigation". Neither is a `use_when`
claim, so neither is compared here.

## Noted for the owner, not a gate or check

**showNavLine-off text position.** See *Gate 6*. The text sits at y 24 as
Figma's layout draws it. Whether the Designer wants it centred has never been
ruled on.

**Typing gap.** `NavLabel.jsx:29-35` gives `className` no default, the same
pattern as ButtonCTA, Label and the components reviewed after them. Under
the owner's 2026-10-15 ruling, this does not block an export. It is to be
fixed before the npm publish.

**Publish held.** Under the owner's 2026-10-15 ruling, version 0.1.0 is
approved, but publishing waits until every component is Cleared.

## What each owner is waiting on

- **Owner** (gate 5, blocker): decide the `type` → `state` suggestion in
  `docs/nav-label-prop-names.md:29-36`. Either keep `type` as Figma names it,
  or rename it (in Figma first, then in code). Record the decision in that
  file through a pull request into `staging`, merged by a human. A rename is
  then built by the Developer and retested by QA, and the intent is
  refreshed, before a new "release NavLabel".
- **doc-generator, Job A** (check 3, blocker): re-transpose
  `src/components/NavLabel/NavLabel.intent.json` at the current
  `NavLabel.jsx`. The three `a11y` sources `NavLabel.jsx:36`, `:37` and `:43`
  now point at `const look = …`, a blank line and `data-type={look}`. The
  behaviour they describe is at lines 39-41, 40 and 46. Job A's pull request
  goes into `staging`, and a human merges it. After it reaches `main`, a new
  "release NavLabel" reviews it again. If the owner decides to rename `type`,
  doing the rename first saves a second re-transposition.
- **Owner** (check 3, alternative): if the owner extends the 2026-10-15
  citation ruling to cover a three-line shift, the check passes. That
  decision is the owner's. This review does not make it.
- **Owner** (check 2, warning only, does not block): "don't use on side
  navigation" in Figma 55:34 names no alternative.
- **Owner** (gate 6, question): the showNavLine-off text position (y 24,
  bottom) has never been ruled on.
- **Owner** (gate 7, informational): the banner in `docs/versioning.md` still
  calls the file a draft.
- **Designer, through the owner** (gate 5, informational): confirm the Figma
  panel spelling of `navLabelText` and `showNavLine`
  (`docs/nav-label-prop-names.md:15-17`).
