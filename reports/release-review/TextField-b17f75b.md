# Release review: TextField at b17f75b

| | |
| --- | --- |
| Component | TextField (`src/components/TextField/`), Figma `InputField` 64:556, registry row "InputField/TextField" |
| Reviewed commit | `b17f75b2f1efd7e3a289cb444eda1c9c10119a2d` (`main` HEAD, "Merge pull request #160 from wah-ag/staging") |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`) |
| Reviewed at | 2026-10-16T16:47:51Z |
| **Verdict** | **Cleared**: all seven gates are open, and checks 1, 3, 4, 5 and 6 pass. Check 2 gives a warning, which does not change the verdict. |

This is a new review, not a resume. The previous review, at `56b0d41`
(`reports/release-review/TextField-56b0d41.md`, merged in #157), was Blocked
on check 6 (Pair A word for word with TextArea; Pairs B and C, paraphrases,
with PasswordField and SearchField). Its verdict was never written to the
board; the board still holds the `52c7a19` review. Since `56b0d41`: the
Designer edited the PasswordField, TextArea and SearchField doc frames, #158
(`333163b`, commit `6850f4d`) re-transposed those three intent files, #159
waived `333163b` in `docs/retest-waivers.md:41`, and #160 shipped `staging`
to `main`. `git diff --stat 56b0d41 b17f75b` touches only those three intent
files, `docs/retest-waivers.md` and the previous report. Nothing under
`src/components/TextField`, `FieldControl` or `FieldLabel` changed, and
TextField's own intent file (71:2194) is unchanged.

This review read a clean, detached checkout of exactly the reviewed commit
(`git worktree add --detach`, no local changes), after `npm ci` and
`npm run build:tokens`.

Owner rulings applied: 2026-10-16, "All contents in textfield now is assume
as okay." (TextField's intent wording from 71:2194 is accepted as is); the
2026-10-14 TextField rows ruling; the #122, #150, #154 and #158 waivers; the
2026-10-15 one-line citation tolerance (not needed: every citation is
exact); the 2026-10-15 typing ruling (noted, not a finding).

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/TextField/TextField.intent.json` exists at the commit and parses as JSON. Last changed in `389a63f` (#154). |
| 2 | Development is Completed | **Open** | Components row `recjtfqlF3tFst2qV` reads `Development = Completed` (Design `Done`). Production Storybook: `https://flex-ds-sigma.vercel.app/?path=/story/components-textfield--lg-idle`. Commit: `https://github.com/wah-ag/flex-ds/commit/56b0d41dfb3b3d5009e49cccb583a3a79a187502`. TextField was not in the #160 ship, and `git diff --stat 56b0d41 b17f75b -- src/components/TextField src/components/FieldControl src/components/FieldLabel` is empty, so the code the board's Commit shipped is the code at the reviewed commit. Release Review and Release Verdict still read the `52c7a19` review (`…/blob/bc296df…/reports/release-review/TextField-52c7a19.md`, `Blocked`). |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0: "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0: "✔ Modes match and every alpha token carries alpha." `git diff --stat origin/main -- tokens/` and `git diff --stat origin/staging -- tokens/` (`origin/staging` at `5ba9dc3`) are both empty. Every remote token branch (`tokens-update`, `tokens-update-staging`, `component/icon-stroke-token`, `revert-64-tokens-update`, `token-runner-agent`) is an ancestor of the reviewed commit. No pull request is open (`gh pr list --state open` returns `[]`). |
| 4 | Public surface decided | **Open** | Public: it has a Components row (`recjtfqlF3tFst2qV`) and a Figma node (64:556), and nothing under `docs/` declares it internal. `src/index.ts:15-19` exports Avatar, ButtonCTA, CardContainer, IconButton and Label, not TextField; under the gate that neither opens nor shuts it. |
| 5 | Names final | **Open** | Unchanged since `56b0d41` (`git diff --stat 56b0d41 b17f75b -- docs/` touches only `docs/retest-waivers.md`). `docs/textfield-prop-names.md:9-10`: "The owner confirmed these names on 2026-10-03." No rename of a TextField prop is suggested under `docs/`. |
| 6 | States complete | **Open** | 2 sizes × 7 states = 14 story exports (`TextField.stories.jsx`, `state` options at `:35-38`, `size` at `:39`), 14 linked Staging Testing rows, all `Passed` (Total Staging Tests 14; Staging Passed Count 14; Results Summary `Passed`). The lg and sm `hover` rows read `Tested on staging f1cb5c6ab4ad84fa0b072f9ae058ddc729f7ce13` (#111); the other 12 read `Tested on staging 43e994622491d7c0a2713d65232b6ffc660bfb96`, which the owner ruled on 2026-10-14 "stand as Passed". Both are ancestors of the reviewed commit. `git diff --stat f1cb5c6 b17f75b -- src/components/TextField src/components/FieldControl src/components/FieldLabel`: one removed line in each of `TextField.jsx`, `FieldControl.jsx`, `FieldLabel.jsx` (#122, waived at `docs/retest-waivers.md:36`) and `TextField.intent.json` (#150 and #154, waived at `:39` and `:40`). States left out are recorded as owner decisions in `docs/textfield-prop-names.md`. |
| 7 | Version meaning known | **Open** | `docs/versioning.md` exists at the commit. TextField is **New, MINOR**: it has never been exported (`git tag -l 'v*'` is empty, and `src/index.ts` does not export it). `docs/versioning.md:26`: "**New**: first time it is exported. MINOR." The banner at `:3-4` still reads "Draft for the owner's review."; as in earlier reviews, the file is treated as the policy in force because a human merged it in #118. |

## Checks

| # | Check | Result |
| --- | --- | --- |
| 1 | Fields present | **Pass** |
| 2 | Every `dont_use_when` names an alternative | **Warning** (not a blocker) |
| 3 | `a11y` specific, not generic | **Pass** |
| 4 | `required_tokens` resolve | **Pass** |
| 5 | All variants covered | **Pass** |
| 6 | No two components claim the same job | **Pass** |

### Check 1: Fields present (pass)

All seven keys are present: `use_when` (6 entries), `dont_use_when` (5),
`variant_intent` (`state`, `size`), `placement` (empty), `pairs_with`
(empty), `required_tokens` (1) and `a11y` (5). Every non-empty entry has a
`source`, and `use_when` is not empty.

### Check 2: Every `dont_use_when` names an alternative (warning)

None of the five entries names an alternative. All five are sourced to
`Figma 71:2194 (Text Field › Don’t, text I71:2194;2406:416;71:2187)`:

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

| Entry | Source | The cited line at `b17f75b` |
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

### Check 6: No two components claim the same job (pass)

Every `use_when` entry of every intent file at the commit was read against
TextField's six. The three pairs from the `56b0d41` review were judged
again from the text at this commit.

**Pair A, TextArea: gone.** TextArea's `use_when` no longer holds "Use
placeholder text only when an example or format helps users understand the
expected input." (removed in `6850f4d`). No entry in TextArea's three
`use_when` entries mentions placeholders.

**Pair B, PasswordField: no longer the same situation.**

| TextField `use_when` | PasswordField `use_when` |
| --- | --- |
| "Keep labels, helper text, and validation messages concise and clear." | "Label which password is needed, such as current, new or confirm password." |
| `Figma 71:2194 (Text Field › Do, text I71:2194;2406:461;71:2190)` | `Figma 348:391 (Password Field › Do, text I348:391;2406:461;348:397)` |

PasswordField's entry now describes saying *which* password a field asks
for (current, new or confirm). That situation exists only where a secret is
entered, which TextField's own `use_when` does not cover ("Use TextField for
the text the user needs to read back, such as a name or email.") and
PasswordField's `dont_use_when` keeps on its side ("Don’t use a password
field for information that isn’t secret."). TextField's entry is about the
length and clarity of its own label, helper and validation text. Different
situations; no finding.

**Pair C, SearchField: no longer the same situation.**

| TextField `use_when` | SearchField `use_when` |
| --- | --- |
| "Use placeholder text only when an example or format helps users understand the expected input." | "Say what can be searched in the hint, such as ‘Search jobs or companies’." |
| `Figma 71:2194 (Text Field › Do, text I71:2194;2406:461;71:2190)` | `Figma 224:2304 (Search Field › Do, text I224:2304;2406:461;224:2301)` |

SearchField's entry now describes naming the search scope in the hint; the
situation (telling users what a search covers) exists only in a search
input. TextField's entry is about whether to show a placeholder at all
(only when an example or format helps). Both touch in-field text, but the
situation each describes is different, and a shared mechanism is not a
shared job. No finding. This is a judgement on paraphrase; it is recorded
here with both entries so the owner can weigh it.

Checked and not findings:

- TextField's "Use TextField for the text the user needs to read back, such
  as a name or email." against TextArea's "Use a text area when the response
  may naturally span more than one line; use a text field for short
  values." (`Figma 349:493 (Text Area › Do, …349:499)`): the overlap on
  short values is sent to TextField by TextArea's `dont_use_when` "Don’t use
  a text area for short, single-line information such as a name, email
  address, or postal code. Use TextField." (`Figma 349:493 (Text Area ›
  Don’t, text I349:493;2406:416;349:496)`), so the exception applies.
- The same TextField entry against PasswordField's "Use PasswordField for
  passwords, PINs or other secrets." and "Use PasswordField when the value
  must be hidden while typing." (`Figma 348:391`): readable versus secret
  values; different situations.
- TextField's "Use the appropriate focus, error, disabled, and filled
  states." against ButtonCTA's "Provide clear interaction states, including
  hover, pressed, focus, and disabled.": states of a button, not of an
  input. Likewise "Keep input fields consistent in height, spacing,
  alignment, and styling." against Label's, CardContainer's and Avatar's
  consistency entries, each about its own kind of element.
- TextField's "Provide clear error and validation messages when input needs
  correction." has no counterpart in any other intent file.
- No other intent file's `use_when` describes a TextField situation.

## Noted for the owner, not a gate or check

**Typing gap, unchanged.** `TextField.jsx` has changed by one CSS import
line since `f1cb5c6` (#122) and not at all since `52c7a19`, so the emitted
declaration still types `id` and `className` as required `any` (no
defaults), and `state` and `size` as plain `string`. Under the owner's
2026-10-15 ruling this does not block an export; it is to be fixed before
the npm publish, with ButtonCTA's and Label's.

**No GitHub Commits rows for `171356e` and `389a63f`.** As noted in the
`56b0d41` review; it does not affect gate 2, which reads Development. The
Developer owns that table.

## What each owner is waiting on

No gate is shut and no blocking check failed.

- **Owner** (check 2, warning only, does not block): none of the five
  `dont_use_when` entries names an alternative. Accepted as is under your
  2026-10-16 ruling.
- **Owner** (check 6, informational): Pair C is a judgement on paraphrase;
  both entries are quoted above if you weigh it differently.
- **Owner** (gate 7, informational): the banner in `docs/versioning.md`
  still calls the file a draft.
- **Owner** (typing, informational): `id` and `className` type as required
  `any`; to be fixed before the publish, by your 2026-10-15 ruling.
- **Developer** (informational, through the owner): no GitHub Commits rows
  exist for `171356e` (#150) and `389a63f` (#154).
