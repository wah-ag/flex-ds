# Release review: TextField at 52c7a19

| | |
| --- | --- |
| Component | TextField (`src/components/TextField/`), Figma `InputField` 64:556, registry row "InputField/TextField" |
| Reviewed commit | `52c7a192c98f843cb30124ec869412dc6a959280` (`main` HEAD, "Merge pull request #148 from wah-ag/staging") |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`) |
| Reviewed at | 2026-10-15T17:23:55Z |
| **Verdict** | **Blocked**: all seven gates are open, but check 3 and check 6 fail. Check 2 gives a warning, which does not change the verdict. |

This is the first release review of TextField. The review read a clean,
detached checkout of exactly this commit (`git worktree add --detach`, no
local changes), after `npm ci` and `npm run build:tokens`.

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/TextField/TextField.intent.json` exists at the commit and parses as JSON. It was written in `8a1d3b2` ("Intent files for the 20 Completed components", 2026-10-13) and has not changed since. |
| 2 | Development is Completed | **Open** | Components row `recjtfqlF3tFst2qV` reads `Development = Completed`. Production Storybook: `https://flex-ds-sigma.vercel.app/?path=/story/components-textfield--lg-idle`. Commit: `https://github.com/wah-ag/flex-ds/commit/376c4f5a3f3a73637276b1ac856df44f16cbffaa`. Release Review and Release Verdict are empty. |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0: "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0: "✔ Modes match and every alpha token carries alpha." The reviewed commit is `main` HEAD, so `tokens/` equals `main`. `git diff --stat 52c7a19 origin/staging -- tokens/` is empty. Every remote token branch (`tokens-update`, `tokens-update-staging`, `component/icon-stroke-token`, `revert-64-tokens-update`, `token-runner-agent`) is an ancestor of the reviewed commit. No pull request is open (`gh pr list --state open` returns `[]`). |
| 4 | Public surface decided | **Open** | The component is public. It has a Components row (`recjtfqlF3tFst2qV`) and a Figma node (64:556), and nothing under `docs/` declares it internal. At this commit `src/index.ts` exports Avatar, ButtonCTA, CardContainer, IconButton and Label (lines 15-19), not TextField. Under the gate, that neither opens nor shuts it. |
| 5 | Names final | **Open** | `docs/textfield-prop-names.md:3-5` records the owner's decision (2026-10-03) to build Figma `InputField` as `TextField`. `docs/textfield-prop-names.md:7-23` maps every Figma property to its prop (`state`, `size`, `labelText`, `placeholderText`, `showLeading`, `showTrailing`, `swapLeadingIcon`, `swapTrailingIcon`) and records that "The owner confirmed these names on 2026-10-03." `TextField.jsx:36-49` takes exactly those, plus the native pass-throughs `type`, `id`, `className` and `...rest`, documented under "Not from Figma" (`docs/textfield-prop-names.md:25-30`). No rename of a TextField prop is suggested under `docs/`. See *Gate 5: notes* below. |
| 6 | States complete | **Open** | 2 sizes × 7 states = 14 Figma variant nodes (`TextField.stories.jsx:8-13`), 14 story exports (`TextField.stories.jsx:80-94`), and 14 linked Staging Testing rows. Total Staging Tests reads 14, and Staging Testing Results Summary reads `Passed` only. The lg and sm `hover` rows read `Tested on staging f1cb5c6ab4ad84fa0b072f9ae058ddc729f7ce13` (the #111 merge, `56dccda`, which moved the hover border to `border-interactive-brand-hover`). The other 12 rows read `Tested on staging 43e994622491d7c0a2713d65232b6ffc660bfb96`; the owner ruled on 2026-10-14 that they "stand as Passed" for the #111 change. Both tested commits are ancestors of the reviewed commit. Since `f1cb5c6`, the only change under `TextField/`, `FieldControl/` or `FieldLabel/` is one removed `import './X.css';` line in each `.jsx` (`git diff --stat f1cb5c6 52c7a19`), from #122 (merged as `d22ee86`), which `docs/retest-waivers.md:36` lists as waived. States left out (holding a value unfocused, error with hover or focus, press) are recorded as owner decisions (`docs/textfield-prop-names.md:75-85`). |
| 7 | Version meaning known | **Open** | `docs/versioning.md` exists at the commit. TextField's class under it is **New, MINOR**, because TextField has never been exported: `git tag -l 'v*'` is empty, and `src/index.ts` at the commit does not export it. `docs/versioning.md:26` reads: "**New**: first time it is exported. MINOR." |

### Gate 5: notes

These do not shut the gate.

- `docs/field-control-prop-names.md:13-17` proposes the names `FieldControl`
  and `FieldLabel` "for review". They are the internal, code-only
  subcomponents TextField imports, not TextField or one of its props, and
  they are not exported. This review does not read them as an open
  suggestion for TextField.
- `docs/textfield-prop-names.md:62-73` ("Implementation choices that need a
  review") and `:93-97` ("Question for the Designer") are behaviour
  questions, not rename suggestions.

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
| 3 | `a11y` specific, not generic | **Fail** |
| 4 | `required_tokens` resolve | **Pass** |
| 5 | All variants covered | **Pass** |
| 6 | No two components claim the same job | **Fail** |

### Check 1: Fields present (pass)

All seven keys are present: `use_when` (7 entries), `dont_use_when` (7),
`variant_intent` (`state`, `size`), `placement` (empty), `pairs_with`
(empty), `required_tokens` (1), and `a11y` (5). Every non-empty entry has a
`source`, and `use_when` is not empty.

### Check 2: Every `dont_use_when` names an alternative (warning)

None of the seven entries names another component or variant to use
instead. All are sourced to `Figma 71:2194 (Input Field Doc Frame › Don’t,
text I71:2194;2406:416;71:2187)`:

- "Don’t use unclear or overly long labels."
- "Don’t rely on placeholder text as the only label."
- "Don’t use the wrong input type for the information being collected."
- "Don’t use inconsistent formats for the same type of information."
- "Don’t leave users without clear feedback when their input is invalid."
- "Don’t use error messages that do not explain how to correct the input."
- "Don’t add unnecessary input fields when the information is not required."

This review suggests no alternative.

### Check 3: `a11y` specific, not generic (fail)

Each of the five entries names something checkable, and the code does what
each says. Every source citation is stale at the reviewed commit:

| Entry | Cited | At `52c7a19` the cited line reads | The behaviour is at | Off by |
| --- | --- | --- | --- | --- |
| "The label is a native <label> tied to the input’s id." | `TextField.jsx:53` | `  return (` | `TextField.jsx:55` (`<FieldLabel … htmlFor={inputId} />`, rendering `<label htmlFor>` at `FieldLabel.jsx:11-14`) | 2 |
| "The field is a native <input>; state=\"disable\" sets disabled." | `FieldControl.jsx:117` | `aria-invalid={…}` | `FieldControl.jsx:116` | 1 |
| "state=\"error\" sets aria-invalid on the input." | `FieldControl.jsx:118` | `onChange={(event) => {` | `FieldControl.jsx:117` | 1 |
| "The clear button’s aria-label is \"Clear <labelText>\"." | `TextField.jsx:65` | `showLeading={showLeading}` | `TextField.jsx:68` (`trailingLabel={\`Clear ${labelText}\`}`, rendered as `aria-label` at `FieldControl.jsx:140`) | 3 |
| "The clear button is out of the tab order (tabIndex -1)." | `FieldControl.jsx:143` | `disabled={isDisabled}` | `FieldControl.jsx:142` | 1 |

Why they moved: the intent was written at `8a1d3b2`, where all five
citations were exact. #111 (`56dccda`) then added comment lines to
`TextField.jsx`, moving the two TextField citations by 3 and 4, and #122
(`d22ee86`) removed the CSS import line from both files, moving every
citation up by 1.

On 2026-10-15 the owner ruled, for ButtonCTA: "The a11y citations being one
line off doesn't fail check 3." This review applies that ruling to the three
`FieldControl.jsx` citations, which are one line off from the same #122
change. It does **not** extend it to the two `TextField.jsx` citations: they
are two and three lines off, partly from a code change (#111), and their
cited lines now point at unrelated code. The ruling's words cover one line,
and this review does not widen an owner ruling on its own. Those two entries
fail check 3.

If the owner rules that any stale line citation passes while the behaviour
is unchanged, this finding falls away.

### Check 4: `required_tokens` resolve (pass)

- `TextField.css` references one token, `--spacing-gap-sm` (line 12), and `TextField.jsx` references none. `required_tokens` lists exactly `--spacing-gap-sm`.
- It is defined in `build/css/tokens.css:255` and `build/css/tokens-back-office.css:36` at the commit.

The tokens of the imported FieldControl and FieldLabel are in their own
stylesheets, not in TextField's own CSS or JSX, so the check does not count
them.

### Check 5: All variants covered (pass)

The code accepts two variant props: `state` (`idle`, `hover`, `active`,
`typing`, `focus`, `error`, `disable`) and `size` (`lg`, `sm`)
(`TextField.stories.jsx:35-39`, `docs/textfield-prop-names.md:14-15`). Every
value is a key in `variant_intent`.

All nine values have a `null` meaning, which counts as covered. Figma gives
no per-state or per-size intent.

These props are not counted as variant props: `labelText`,
`placeholderText` (text), `showLeading`, `showTrailing` (boolean),
`swapLeadingIcon`, `swapTrailingIcon` (instance swap), and `type`, `id`,
`className` and `...rest` (DOM pass-throughs).

### Check 6: No two components claim the same job (fail)

All seven of TextField's `use_when` entries appear word for word as
PasswordField's first seven `use_when` entries, with the same source:

| TextField `use_when` | PasswordField `use_when` |
| --- | --- |
| "Use clear and descriptive labels to indicate what users should enter." | "Use clear and descriptive labels to indicate what users should enter." |
| "Use the appropriate input type based on the information being collected." | "Use the appropriate input type based on the information being collected." |
| "Keep labels, helper text, and validation messages concise and clear." | "Keep labels, helper text, and validation messages concise and clear." |
| "Use placeholder text only when an example or format helps users understand the expected input." | "Use placeholder text only when an example or format helps users understand the expected input." |
| "Provide clear error and validation messages when input needs correction." | "Provide clear error and validation messages when input needs correction." |
| "Use the appropriate focus, error, disabled, and filled states." | "Use the appropriate focus, error, disabled, and filled states." |
| "Keep input fields consistent in height, spacing, alignment, and styling." | "Keep input fields consistent in height, spacing, alignment, and styling." |

Source, both sides: `Figma 71:2194 (Input Field Doc Frame › Do, text
I71:2194;2406:461;71:2190)`.

Neither component's `dont_use_when` sends the situation to the other.
TextField's seven entries (quoted under check 2) name no other component.
PasswordField's eighth entry, "Don’t expose password values as plain text by
default." (same Don’t source), says nothing about TextField. PasswordField's
eighth `use_when`, "Use password visibility controls for Password fields when
appropriate.", is its only distinguishing entry, and TextField has no entry
that sends password entry to PasswordField.

The cause is upstream: both intent files transpose the one shared Input
Field Doc Frame (71:2194), which gives no guidance on choosing between the
two. A reader of the intent files cannot tell when to use TextField rather
than PasswordField.

For completeness, these are not findings: TextArea's `dont_use_when`, "don't
use as text field that needs only short text input" (`Figma 110:1364`),
already sends short input away from TextArea. SearchField's `use_when`
entries (`Figma 199:102`) are specific to job-title and brand search.

## Noted for the owner, not a gate or check

**Typing gap, the same as ButtonCTA's and Label's.** A declaration emitted
from `TextField.jsx` at the commit (`tsc --allowJs --declaration
--emitDeclarationOnly`) reads `id: any;` and `className: any;` as
**required**, because neither has a default in the destructuring
(`TextField.jsx:46-47`). `state` and `size` come out as plain `string`, not
their unions, and the return type is `any`. Under the owner's 2026-10-15
ruling this does not block an export; it is to be fixed before the npm
publish, together with ButtonCTA's and Label's. No gate or check covers it,
so this review does not make it a finding.

## What each owner is waiting on

- **doc-generator (Job A)** (check 3): re-transpose the two `a11y` source
  citations in `TextField.intent.json` that point at the wrong lines:
  `TextField.jsx:53` (now `:55`) and `TextField.jsx:65` (now `:68`). The
  three `FieldControl.jsx` citations are one line off as well; the owner's
  off-by-one ruling covers them, but a re-transposition would correct them
  too.
- **Owner** (check 6): TextField and PasswordField share seven identical
  `use_when` entries from the Input Field Doc Frame (71:2194), and neither
  `dont_use_when` separates them. Decide how they are told apart. If the
  Designer is to add guidance to the Doc Frame, that goes to the Designer
  through you, then doc-generator re-transposes both intent files.
  PasswordField's intent file carries the same overlap from its side.
- **Owner** (check 3, alternative): if you rule that a stale line citation
  passes check 3 whenever the behaviour is unchanged, the doc-generator item
  above is not needed.
- **Owner** (check 2, warning only, does not block): none of the seven
  `dont_use_when` entries names an alternative.
- **Owner** (gate 7, informational): the banner in `docs/versioning.md` still
  calls the file a draft.
- **Owner** (typing, informational): TextField's `id` and `className` type
  as required `any`, as ButtonCTA's and Label's do. To be fixed before the
  publish, by your 2026-10-15 ruling.
