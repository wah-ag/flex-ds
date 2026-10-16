# Release review: TextField at 56b0d41

| | |
| --- | --- |
| Component | TextField (`src/components/TextField/`), Figma `InputField` 64:556, registry row "InputField/TextField" |
| Reviewed commit | `56b0d41dfb3b3d5009e49cccb583a3a79a187502` (`main` HEAD, "Merge pull request #156 from wah-ag/staging") |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`) |
| Reviewed at | 2026-10-16T16:25:01Z |
| **Verdict** | **Blocked**: all seven gates are open, and checks 1, 3, 4 and 5 pass, but check 6 fails. Check 2 gives a warning, which does not change the verdict. |

This is a new review, not a resume. The previous review, at `e7e2523`
(`reports/release-review/TextField-e7e2523.md`, merged in #153), was Blocked
on check 6 (five `use_when` entries shared word for word with
PasswordField). Its verdict was never written to the board; the board still
holds the `52c7a19` review. Since `e7e2523`: #154 (`1cdf12f`, commit
`389a63f`) re-transposed the TextField, PasswordField, TextArea and
SearchField intent files each from its own Figma doc frame (71:2194,
348:391, 349:493, 224:2304), and #155 waived `1cdf12f` in
`docs/retest-waivers.md:40`. `git diff --stat e7e2523 56b0d41` touches only
those four intent files, `docs/retest-waivers.md` and the previous report.

This review read a clean, detached checkout of exactly the reviewed commit
(`git worktree add --detach`, no local changes), after `npm ci` and
`npm run build:tokens`.

Owner rulings applied: 2026-10-16, "All contents in textfield now is assume
as okay." (TextField's intent wording from 71:2194 is accepted as is); the
2026-10-14 TextField rows ruling; the #122, #150 and #154 waivers; the
2026-10-15 one-line citation tolerance (not needed: every citation is
exact); the 2026-10-15 typing ruling (noted, not a finding).

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/TextField/TextField.intent.json` exists at the commit and parses as JSON. Last changed in `389a63f` ("intent: re-transpose input fields from their own doc frames"), merged as `1cdf12f` (#154). |
| 2 | Development is Completed | **Open** | Components row `recjtfqlF3tFst2qV` reads `Development = Completed` (Design `Done`). Production Storybook: `https://flex-ds-sigma.vercel.app/?path=/story/components-textfield--lg-idle`. Commit: `https://github.com/wah-ag/flex-ds/commit/56b0d41dfb3b3d5009e49cccb583a3a79a187502`, the reviewed commit. Release Review and Release Verdict still read the `52c7a19` review (`…/blob/bc296df…/reports/release-review/TextField-52c7a19.md`, `Blocked`). |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0: "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0: "✔ Modes match and every alpha token carries alpha." `git diff --stat origin/main -- tokens/` and `git diff --stat origin/staging -- tokens/` (`origin/staging` at `219434f`) are both empty. Every remote token branch (`tokens-update`, `tokens-update-staging`, `component/icon-stroke-token`, `revert-64-tokens-update`, `token-runner-agent`) is an ancestor of the reviewed commit. No pull request is open (`gh pr list --state open` returns `[]`). |
| 4 | Public surface decided | **Open** | Public: it has a Components row (`recjtfqlF3tFst2qV`) and a Figma node (64:556), and nothing under `docs/` declares it internal. `src/index.ts:15-19` exports Avatar, ButtonCTA, CardContainer, IconButton and Label, not TextField; under the gate that neither opens nor shuts it. |
| 5 | Names final | **Open** | Unchanged since `e7e2523` (`git diff --stat e7e2523 56b0d41 -- docs/` touches only `docs/retest-waivers.md`). `docs/textfield-prop-names.md` records the owner's decision to build Figma `InputField` as `TextField` and "The owner confirmed these names on 2026-10-03." No rename of a TextField prop is suggested under `docs/`. |
| 6 | States complete | **Open** | 2 sizes × 7 states = 14 story exports (`TextField.stories.jsx`, `state` options at `:35-38`, `size` at `:39`), 14 linked Staging Testing rows, all `Passed` (Total Staging Tests 14; Staging Passed Count 14; Results Summary `Passed`). The lg and sm `hover` rows read `Tested on staging f1cb5c6ab4ad84fa0b072f9ae058ddc729f7ce13` (#111); the other 12 read `Tested on staging 43e994622491d7c0a2713d65232b6ffc660bfb96`, which the owner ruled on 2026-10-14 "stand as Passed". Both are ancestors of the reviewed commit. `git diff --stat f1cb5c6 56b0d41 -- src/components/TextField src/components/FieldControl src/components/FieldLabel`: one removed line in each of `TextField.jsx`, `FieldControl.jsx`, `FieldLabel.jsx` (#122, `d22ee86`, waived at `docs/retest-waivers.md:36`) and `TextField.intent.json` (#150 and #154, waived at `:39` and `:40`). States left out are recorded as owner decisions in `docs/textfield-prop-names.md`. |
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

All seven keys are present: `use_when` (6 entries), `dont_use_when` (5),
`variant_intent` (`state`, `size`), `placement` (empty), `pairs_with`
(empty), `required_tokens` (1) and `a11y` (5). Every non-empty entry has a
`source`, and `use_when` is not empty.

### Check 2: Every `dont_use_when` names an alternative (warning)

None of the five entries names an alternative. #154 removed the one that
did ("Don’t use PasswordField for text the user needs to read back, such as
a name or email. Use TextField.") and its content now sits in `use_when`.
All five are sourced to `Figma 71:2194 (Text Field › Don’t, text
I71:2194;2406:416;71:2187)`:

- "Don’t use unclear or overly long labels."
- "Don’t rely on placeholder text as the only label."
- "Don’t use inconsistent formats for the same type of information."
- "Don’t leave users without clear feedback when their input is invalid."
- "Don’t add unnecessary input fields when the information is not required."

This review suggests no alternative. Under the owner's 2026-10-16 ruling the
wording is accepted as is.

### Check 3: `a11y` specific, not generic (pass)

Each entry names something checkable, the code does what it says, and every
citation is exact at the reviewed commit:

| Entry | Source | The cited line at `56b0d41` |
| --- | --- | --- |
| "The label is a native <label> tied to the input’s id." | `TextField.jsx:55` | `<FieldLabel labelText={labelText} htmlFor={inputId} />` |
| "The field is a native <input>; state=\"disable\" sets disabled." | `FieldControl.jsx:116` | `disabled={isDisabled}` on the `<input>` opened at `:107` |
| "state=\"error\" sets aria-invalid on the input." | `FieldControl.jsx:117` | `aria-invalid={state === 'error' ? true : undefined}` |
| "The clear button’s aria-label is \"Clear <labelText>\"." | `TextField.jsx:68` | ``trailingLabel={`Clear ${labelText}`}`` (rendered as `aria-label={trailingLabel}` at `FieldControl.jsx:140`) |
| "The clear button is out of the tab order (tabIndex -1)." | `FieldControl.jsx:142` | `tabIndex={trailingFocusable ? undefined : -1}` |

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

The PasswordField overlap from the `e7e2523` review is gone: PasswordField's
`use_when` now comes from its own frame (348:391) and shares no entry with
TextField word for word. Three pairs remain. The first is word for word;
the other two are this review's judgement on paraphrases, quoted in full so
the owner can weigh them.

**Pair A, TextArea (identical text).**

| TextField `use_when` | TextArea `use_when` |
| --- | --- |
| "Use placeholder text only when an example or format helps users understand the expected input." | "Use placeholder text only when an example or format helps users understand the expected input." |
| `Figma 71:2194 (Text Field › Do, text I71:2194;2406:461;71:2190)` | `Figma 349:493 (Text Area › Do, text I349:493;2406:461;349:499)` |

Does either `dont_use_when` send this situation to the other?

- **TextField's** five `dont_use_when` entries (all `Figma 71:2194 (Text
  Field › Don’t, text I71:2194;2406:416;71:2187)`) name no other component.
  "Don’t rely on placeholder text as the only label." concerns placeholders
  but sends nothing to TextArea.
- **TextArea's** `dont_use_when` holds "Don’t use a text area for short,
  single-line information such as a name, email address, or postal code."
  (`Figma 349:493 (Text Area › Don’t, text I349:493;2406:416;349:496)`). It
  sends short single-line input away from TextArea, but it names no
  component, and the placeholder entry is not limited to single-line input:
  it applies equally to a multi-line response. TextArea's `use_when` "Use a
  text area when the response may naturally span more than one line; use a
  text field for short values." does name the text field, but it is a
  `use_when`, not a `dont_use_when`, and it too is about length, not
  placeholders.

The exception does not apply. Pair A fails.

**Pair B, PasswordField (same situation, different words).**

| TextField `use_when` | PasswordField `use_when` |
| --- | --- |
| "Keep labels, helper text, and validation messages concise and clear." | "Use clear and descriptive labels to indicate what users should enter." |
| `Figma 71:2194 (Text Field › Do, text I71:2194;2406:461;71:2190)` | `Figma 348:391 (Password Field › Do, text I348:391;2406:461;348:397)` |

Both describe writing the label of a text-entry field so that it is clear.
Neither names its own component or anything only it does. PasswordField's
`dont_use_when` ("Don’t reveal the password by default…", "Don’t clear the
password after an error…", "Don’t use a password field for information that
isn’t secret.", all `Figma 348:391 (Password Field › Don’t, text
I348:391;2406:416;348:394)`) names no other component, and TextField's names
none. The exception does not apply. Pair B fails.

**Pair C, SearchField (same situation, different words).**

| TextField `use_when` | SearchField `use_when` |
| --- | --- |
| "Use placeholder text only when an example or format helps users understand the expected input." | "Add a hint or example when it helps users understand what they can search for." |
| `Figma 71:2194 (Text Field › Do, text I71:2194;2406:461;71:2190)` | `Figma 224:2304 (Search Field › Do, text I224:2304;2406:461;224:2301)` |

Both describe adding an in-field example when it helps users understand
what to enter; SearchField's names the search input, TextField's covers any
expected input, which includes a search query. SearchField's four
`dont_use_when` entries (all `Figma 224:2304 (Search Field › Don’t, text
I224:2304;2406:416;224:2297)`) name no other component; the nearest, "Don’t
use the search field for unrelated actions, such as filtering a form
section or entering a URL, without making that purpose clear.", sends
nothing to TextField. TextField's name none. The exception does not apply.
Pair C fails.

Pair A alone blocks. Pairs B and C are judgements; if the owner rules that
general field-writing guidance shared across input fields is not a "job" in
the sense of check 6, that ruling would cover all three, and this review
records no such ruling today.

Checked and not findings:

- TextField's "Use TextField for the text the user needs to read back, such
  as a name or email." (`Figma 71:2194 (Text Field › Do, …71:2190)`) against
  PasswordField's "Use PasswordField for passwords, PINs or other secrets."
  and "Use PasswordField when the value must be hidden while typing."
  (`Figma 348:391`): different situations (readable versus secret values).
- TextField's "Use the appropriate focus, error, disabled, and filled
  states." against ButtonCTA's "Provide clear interaction states, including
  hover, pressed, focus, and disabled.": states of a button, not of an
  input; different situations. Likewise "Keep input fields consistent in
  height, spacing, alignment, and styling." against Label's, CardContainer's
  and Avatar's consistency entries, each about its own kind of element.
- No other intent file's `use_when` describes a TextField situation.

## Noted for the owner, not a gate or check

**Typing gap, unchanged.** `TextField.jsx` changed by one CSS import line
since `f1cb5c6` (#122) and not at all since `52c7a19`, so the emitted
declaration still types `id` and `className` as required `any` (no
defaults), and `state` and `size` as plain `string`. Under the owner's
2026-10-15 ruling this does not block an export; it is to be fixed before
the npm publish, with ButtonCTA's and Label's.

**No GitHub Commits rows for `171356e` and `389a63f`.** As reported by
DevOps at the re-ship; it does not affect gate 2, which reads Development.
The Developer owns that table.

## What each owner is waiting on

- **Owner** (check 6): TextField's "Use placeholder text only when an
  example or format helps users understand the expected input." is word for
  word TextArea's (`Figma 71:2194` and `Figma 349:493`), and neither
  `dont_use_when` sends it to the other (Pair A). Pairs B (PasswordField,
  labels) and C (SearchField, hint or example) are the same kind of
  overlap in different words. Each needs a Figma doc-frame change by the
  Designer (then doc-generator Job A re-transposes), or your ruling under
  `docs/`. Then ask for "release TextField" again.
- **Owner** (check 2, warning only, does not block): none of the five
  `dont_use_when` entries names an alternative. Accepted as is under your
  2026-10-16 ruling.
- **Owner** (gate 7, informational): the banner in `docs/versioning.md`
  still calls the file a draft.
- **Owner** (typing, informational): `id` and `className` type as required
  `any`; to be fixed before the publish, by your 2026-10-15 ruling.
- **Developer** (informational, through the owner): no GitHub Commits rows
  exist for `171356e` (#150) and `389a63f` (#154).
