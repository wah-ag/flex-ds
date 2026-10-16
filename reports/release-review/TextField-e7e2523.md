# Release review: TextField at e7e2523

| | |
| --- | --- |
| Component | TextField (`src/components/TextField/`), Figma `InputField` 64:556, registry row "InputField/TextField" |
| Reviewed commit | `e7e2523138087b8b8e0b440b9b82f605ec1a39fa` (`main` HEAD, "Merge pull request #152 from wah-ag/staging") |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`) |
| Reviewed at | 2026-10-15T18:27:03Z |
| **Verdict** | **Blocked**: all seven gates are open, and checks 1, 3, 4 and 5 pass, but check 6 fails. Check 2 gives a warning, which does not change the verdict. |

This is a new review, not a resume. The previous review, at `52c7a19`
(`reports/release-review/TextField-52c7a19.md`, merged in #149), was Blocked
on checks 3 and 6. Since then #150 (`01fdf2e`) re-transposed
`TextField.intent.json` from TextField's own doc frame (Figma 71:2194), and
#151 waived `01fdf2e` in `docs/retest-waivers.md`. This review read a clean,
detached checkout of exactly the reviewed commit (`git worktree add
--detach`, no local changes), after `npm ci` and `npm run build:tokens`.

Owner rulings applied: 2026-10-16, "All contents in textfield now is assume
as okay." (TextField's intent wording from 71:2194 is accepted as is); the
2026-10-14 TextField rows ruling; the #122 waiver; the 2026-10-15 one-line
citation tolerance (not needed at this commit: every citation is exact).

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/TextField/TextField.intent.json` exists at the commit and parses as JSON. Last changed in `171356e` ("intent: refresh TextField from its own doc frame (71:2194)"), merged as `01fdf2e` (#150). |
| 2 | Development is Completed | **Open** | Components row `recjtfqlF3tFst2qV` reads `Development = Completed`. Production Storybook: `https://flex-ds-sigma.vercel.app/?path=/story/components-textfield--lg-idle`. Commit: `https://github.com/wah-ag/flex-ds/commit/e7e2523138087b8b8e0b440b9b82f605ec1a39fa`. Release Review and Release Verdict read the previous review (`…/blob/bc296df…/reports/release-review/TextField-52c7a19.md`, `Blocked`). |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0: "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0: "✔ Modes match and every alpha token carries alpha." `git diff --stat origin/main -- tokens/` and `git diff --stat origin/staging -- tokens/` are both empty. Every remote token branch (`tokens-update`, `tokens-update-staging`, `component/icon-stroke-token`, `revert-64-tokens-update`, `token-runner-agent`) is an ancestor of the reviewed commit. No pull request is open (`gh pr list --state open` returns `[]`). |
| 4 | Public surface decided | **Open** | Public: it has a Components row (`recjtfqlF3tFst2qV`) and a Figma node (64:556), and nothing under `docs/` declares it internal. `src/index.ts:15-19` exports Avatar, ButtonCTA, CardContainer, IconButton and Label, not TextField; under the gate that neither opens nor shuts it. |
| 5 | Names final | **Open** | Unchanged since `52c7a19` (`git diff --stat 52c7a19 e7e2523 -- docs/` touches only `docs/retest-waivers.md`). `docs/textfield-prop-names.md:3-5` records the owner's decision to build Figma `InputField` as `TextField`; `:7-23` maps every Figma property to its prop and records "The owner confirmed these names on 2026-10-03." `TextField.jsx:36-49` takes exactly those plus the documented native pass-throughs. No rename of a TextField prop is suggested under `docs/`. `docs/field-control-prop-names.md` concerns the internal FieldControl and FieldLabel, as noted in the previous review. |
| 6 | States complete | **Open** | 2 sizes × 7 states = 14 Figma variant nodes (`TextField.stories.jsx:8-13`), 14 story exports, 14 linked Staging Testing rows, all `Passed` (Total Staging Tests 14; Results Summary `Passed`). The lg and sm `hover` rows read `Tested on staging f1cb5c6ab4ad84fa0b072f9ae058ddc729f7ce13` (#111); the other 12 read `Tested on staging 43e994622491d7c0a2713d65232b6ffc660bfb96`, which the owner ruled on 2026-10-14 "stand as Passed". Both are ancestors of the reviewed commit. Since `f1cb5c6`, the changes under `TextField/`, `FieldControl/` and `FieldLabel/` are one removed CSS import line per `.jsx` (#122, `d22ee86`, waived at `docs/retest-waivers.md:36`) and `TextField.intent.json` (#150, `01fdf2e`, waived at `docs/retest-waivers.md:39`). States left out are recorded as owner decisions (`docs/textfield-prop-names.md:75-85`). |
| 7 | Version meaning known | **Open** | `docs/versioning.md` exists at the commit. TextField is **New, MINOR**: it has never been exported (`git tag -l 'v*'` is empty, and `src/index.ts` does not export it). `docs/versioning.md:26`: "**New**: first time it is exported. MINOR." The banner at `:3-4` still reads "Draft for the owner's review."; as in earlier reviews, the file is treated as the policy in force because a human merged it in #118. |

## Checks

| # | Check | Result |
| --- | --- | --- |
| 1 | Fields present | **Pass** |
| 2 | Every `dont_use_when` names an alternative | **Warning** (not a blocker) |
| 3 | `a11y` specific, not generic | **Pass** |
| 4 | `required_tokens` resolve | **Pass** |
| 5 | All variants covered | **Pass** |
| 6 | No two components claim the same job | **Fail** |

### Check 1: Fields present (pass)

All seven keys are present: `use_when` (5 entries), `dont_use_when` (7),
`variant_intent` (`state`, `size`), `placement` (empty), `pairs_with`
(empty), `required_tokens` (1) and `a11y` (5). Every non-empty entry has a
`source`, and `use_when` is not empty.

### Check 2: Every `dont_use_when` names an alternative (warning)

One entry names an alternative: "Don’t use PasswordField for text the user
needs to read back, such as a name or email. Use TextField." The other six
name none. All are sourced to `Figma 71:2194 (Text Field › Don’t, text
I71:2194;2406:416;71:2187)`:

- "Don’t use unclear or overly long labels."
- "Don’t rely on placeholder text as the only label."
- "Don’t use inconsistent formats for the same type of information."
- "Don’t leave users without clear feedback when their input is invalid."
- "Don’t add unnecessary input fields when the information is not required."
- "Don’t expose password values as plain text by default."

This review suggests no alternative. Under the owner's 2026-10-16 ruling the
wording is accepted as is.

### Check 3: `a11y` specific, not generic (pass)

Each entry names something checkable, the code does what it says, and every
citation is exact at the reviewed commit:

| Entry | Source | The cited line at `e7e2523` |
| --- | --- | --- |
| "The label is a native <label> tied to the input’s id." | `TextField.jsx:55` | `<FieldLabel labelText={labelText} htmlFor={inputId} />` (renders `<label htmlFor>`, `FieldLabel.jsx:11-14`) |
| "The field is a native <input>; state=\"disable\" sets disabled." | `FieldControl.jsx:116` | `disabled={isDisabled}` on the `<input>` opened at `:107` |
| "state=\"error\" sets aria-invalid on the input." | `FieldControl.jsx:117` | `aria-invalid={state === 'error' ? true : undefined}` |
| "The clear button’s aria-label is \"Clear <labelText>\"." | `TextField.jsx:68` | ``trailingLabel={`Clear ${labelText}`}`` (rendered as `aria-label` at `FieldControl.jsx:140`) |
| "The clear button is out of the tab order (tabIndex -1)." | `FieldControl.jsx:142` | `tabIndex={trailingFocusable ? undefined : -1}` |

The previous review's check-3 finding is resolved. No tolerance was needed.

### Check 4: `required_tokens` resolve (pass)

- `TextField.css:12` references one token, `--spacing-gap-sm`; `TextField.jsx` references none. `required_tokens` lists exactly `--spacing-gap-sm`.
- Defined at `build/css/tokens.css:255` and `build/css/tokens-back-office.css:36` at the commit.

### Check 5: All variants covered (pass)

The code accepts `state` (`idle`, `hover`, `active`, `typing`, `focus`,
`error`, `disable`) and `size` (`lg`, `sm`) (`TextField.stories.jsx:35-39`).
Every value is a key in `variant_intent`. All nine have a `null` meaning,
which counts as covered.

Not variant props: `labelText`, `placeholderText`, `showLeading`,
`showTrailing`, `swapLeadingIcon`, `swapTrailingIcon`, and the pass-throughs
`type`, `id`, `className`, `...rest`.

### Check 6: No two components claim the same job (fail)

All five of TextField's `use_when` entries appear word for word in
PasswordField's `use_when` (its entries 3 to 7):

| TextField `use_when` | PasswordField `use_when` |
| --- | --- |
| "Keep labels, helper text, and validation messages concise and clear." | "Keep labels, helper text, and validation messages concise and clear." |
| "Use placeholder text only when an example or format helps users understand the expected input." | "Use placeholder text only when an example or format helps users understand the expected input." |
| "Provide clear error and validation messages when input needs correction." | "Provide clear error and validation messages when input needs correction." |
| "Use the appropriate focus, error, disabled, and filled states." | "Use the appropriate focus, error, disabled, and filled states." |
| "Keep input fields consistent in height, spacing, alignment, and styling." | "Keep input fields consistent in height, spacing, alignment, and styling." |

Sources:

- TextField (`src/components/TextField/TextField.intent.json`, at `e7e2523`): `Figma 71:2194 (Text Field › Do, text I71:2194;2406:461;71:2190)`
- PasswordField (`src/components/PasswordField/PasswordField.intent.json`, unchanged since `8a1d3b2`): `Figma 71:2194 (Input Field Doc Frame › Do, text I71:2194;2406:461;71:2190)`

Both sides cite the same Figma text node.

Does either `dont_use_when` send the situation to the other?

- **TextField's** `dont_use_when` holds "Don’t use PasswordField for text the
  user needs to read back, such as a name or email. Use TextField." (`Figma
  71:2194 (Text Field › Don’t, text I71:2194;2406:416;71:2187)`). It sends
  readable-text input to TextField itself, not to the other component, and
  it lives in TextField's file, not PasswordField's. The five shared entries
  are general field guidance, not "text the user needs to read back", so
  this entry does not separate them either.
- **PasswordField's** eight `dont_use_when` entries (all `Figma 71:2194
  (Input Field Doc Frame › Don’t, text I71:2194;2406:416;71:2187)`) name no
  other component. None sends anything to TextField.

So the exception in the check does not apply, and check 6 fails.
PasswordField's own distinguishing entry, "Use password visibility controls
for Password fields when appropriate.", is its eighth `use_when` and has no
counterpart in TextField.

The overlap now comes from PasswordField's side: its intent file still
transposes the old shared reading of 71:2194, which by the owner's
2026-10-16 ruling is TextField's own doc frame (PasswordField's own frame is
pending).

Not findings, for completeness: TextArea's `dont_use_when`, "don't use as
text field that needs only short text input" (`Figma 110:1364`), already
sends short input away from TextArea; SearchField's `use_when` entries
(`Figma 199:102`) are specific to job-title and brand search. No other
intent file's `use_when` matches a TextField entry.

## Noted for the owner, not a gate or check

**Typing gap, unchanged.** `TextField.jsx` is unchanged since `52c7a19`
(`git diff --stat 52c7a19 e7e2523` touches only the intent file,
the waivers file and the previous report), so the emitted declaration still
types `id` and `className` as required `any` (no defaults at
`TextField.jsx:46-47`), and `state` and `size` as plain `string`. Under the
owner's 2026-10-15 ruling this does not block an export; it is to be fixed
before the npm publish, with ButtonCTA's and Label's. No gate or check covers
it.

**No GitHub Commits row for `171356e`.** The GitHub Commits table has no row
with hash `171356e`, and TextField's row links only `8dcd5f`, `610f23`,
`a99b95` and `56dccd`. It does not affect gate 2, which reads Development.
The Developer owns that table.

## What each owner is waiting on

- **Owner** (check 6): TextField and PasswordField share five identical
  `use_when` entries, both cited to the same Figma text node in 71:2194,
  and neither `dont_use_when` sends the shared situation to the other. By
  your 2026-10-16 plan, this clears once PasswordField's documentation is
  fixed: its own doc frame from the Designer, then doc-generator (Job A)
  re-transposes `PasswordField.intent.json`. Then ask for "release TextField"
  again.
- **Owner** (check 2, warning only, does not block): six of the seven
  `dont_use_when` entries name no alternative. Accepted as is under your
  2026-10-16 ruling.
- **Owner** (gate 7, informational): the banner in `docs/versioning.md`
  still calls the file a draft.
- **Owner** (typing, informational): `id` and `className` type as required
  `any`; to be fixed before the publish, by your 2026-10-15 ruling.
- **Developer** (informational, through the owner): no GitHub Commits row
  exists for `171356e` (#150).
