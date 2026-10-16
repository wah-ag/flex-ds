# Release review: PasswordField at 65928e7

| | |
| --- | --- |
| Component | PasswordField (`src/components/PasswordField/`), Figma `PasswordField` 95:596, doc frame 348:391, registry row "InputField/PasswordField" |
| Reviewed commit | `65928e792d68114803b631baed367ce5729b3331` (`main` HEAD, "Merge pull request #165 from wah-ag/staging") |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`) |
| Reviewed at | 2026-10-16T17:19:23Z |
| **Verdict** | **Blocked**: gate 5 (names final) is shut. The other six gates are open, and checks 1, 3, 4, 5 and 6 pass. Check 2 gives a warning, which does not change the verdict. |

This is PasswordField's first release review. No earlier report exists under
`reports/release-review/`, no pull request for one is open or merged, and the
Components row's Release Review and Release Verdict are empty.

This review read a clean, detached checkout of exactly the reviewed commit
(`git worktree add --detach`, no local changes), after `npm ci` and
`npm run build:tokens`.

Owner rulings applied: 2026-10-16, each input field has its own doc frame
(PasswordField 348:391, never TextField's 71:2194); 2026-10-16, TextField's
intent content is accepted as is and de-duplication happens on
PasswordField's own page; the #122, #154 and #158 waivers; 2026-10-16,
intent-only commits get no GitHub Commits row (`.claude/skills/registry/SKILL.md`);
the 2026-10-15 typing ruling (noted, not a finding).

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/PasswordField/PasswordField.intent.json` exists at the commit and parses as JSON. Last changed in `6850f4d` (#158, merge `333163b`), the re-transposition from PasswordField's own doc frame 348:391; every `use_when` and `dont_use_when` source cites `Figma 348:391`. |
| 2 | Development is Completed | **Open** | Components row `rec2S5x0BbFWozwIr` reads `Development = Completed` (Design `Done`). Production Storybook: `https://flex-ds-sigma.vercel.app/?path=/story/components-passwordfield--idle`. Commit: `https://github.com/wah-ag/flex-ds/commit/b17f75b2f1efd7e3a289cb444eda1c9c10119a2d`. `git diff --stat b17f75b 65928e7` touches only `.claude/agents/devops.md`, `.claude/skills/registry/SKILL.md`, `reports/release-review/TextField-b17f75b.md` and `src/index.ts` (the TextField export line), so the code the board's Commit shipped is the code at the reviewed commit. |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0: "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0: "✔ Modes match and every alpha token carries alpha." `git diff --stat origin/main -- tokens/` and `git diff --stat origin/staging -- tokens/` (`origin/staging` at `ba9bcf1`) are both empty. Every remote token branch (`tokens-update`, `tokens-update-staging`, `component/icon-stroke-token`, `revert-64-tokens-update`, `token-runner-agent`) is an ancestor of the reviewed commit. No pull request is open (`gh pr list --state open` returns `[]`). |
| 4 | Public surface decided | **Open** | Public: it has a Components row (`rec2S5x0BbFWozwIr`) and a Figma node (95:596), and nothing under `docs/` declares it internal (`src/index.ts:4-6` names only FieldControl and FieldLabel as internal). `src/index.ts:15-20` exports Avatar, ButtonCTA, CardContainer, IconButton, Label and TextField, not PasswordField; under the gate that neither opens nor shuts it. |
| 5 | Names final | **Shut** | See *Gate 5: the open suggestion* below. The props match Figma (`docs/password-field-prop-names.md:15-21`; `PasswordField.jsx:47-56`), but the file proposes renaming four `state` values and records no owner decision on it. An open suggestion shuts the gate. |
| 6 | States complete | **Open** | Figma's `state` matrix has 9 values (`docs/password-field-prop-names.md:40-50`); `PasswordField.stories.jsx:68-76` has one story for each (`Idle`, `Hover`, `Active`, `Focus`, `PasswordVisible`, `PasswordInvisible`, `ErrorVisible`, `ErrorInvisible`, `Disable`), each pinned to its Figma variant node (`:8-18`). 9 linked Staging Testing rows, one per state, all `Passed` (Results Summary `Passed`). Every row reads `Tested on staging 43e994622491d7c0a2713d65232b6ffc660bfb96`, an ancestor of the reviewed commit. `git diff --stat 43e9946 65928e7 -- src/components/PasswordField src/components/FieldControl src/components/FieldLabel`: one removed line in each of `PasswordField.jsx`, `FieldControl.jsx` and `FieldLabel.jsx` (#122, waived at `docs/retest-waivers.md:36`), and `PasswordField.intent.json` (intent-only: #105/#108 shipped, #154 and #158 waived at `:40` and `:41`). PasswordField has no `size` in Figma (`docs/password-field-prop-names.md:23-26`); the rows' Size reads `null`. |
| 7 | Version meaning known | **Open** | `docs/versioning.md` exists at the commit. PasswordField is **New, MINOR**: it has never been exported (`git tag -l 'v*'` is empty, and `src/index.ts` does not export it). `docs/versioning.md:26`: "**New**: first time it is exported. MINOR." The banner at `:3-4` still reads "Draft for the owner's review."; as in earlier reviews, the file is treated as the policy in force because a human merged it in #118. |

### Gate 5: the open suggestion

`docs/password-field-prop-names.md:52-56`:

> **For review:** values with spaces are legal JavaScript strings but unusual
> as prop values. If you'd rather have them, the suggested alternatives are
> `passwordVisible`, `passwordInvisible`, `errorVisible` and `errorInvisible`.
> They have not been applied, because prop values follow Figma unless a human
> decides otherwise.

The code takes Figma's values as written, spaces included
(`PasswordField.jsx:32-42`, `state` options `PasswordField.stories.jsx:41`),
which is what Figma names them. What is missing is the owner's decision on
the suggestion: nothing in the file or elsewhere under `docs/` records it
(`grep -rn "passwordVisible" docs/` finds only these lines). The section
"Owner decisions applied (2026-10-04)" (`:64-76`) covers bullets, the caret,
the starting visibility and the focusable eye, not these names. The file's
title still reads "prop and state names (for review)" (`:1`). This is the
same situation as CardContainer's `card slot` suggestion at `64ed84e`, which
shut gate 5 until the owner's ruling was recorded.

The gate opens once `docs/password-field-prop-names.md` records the owner's
decision: keep Figma's spaced values, or rename (which would also need the
Designer to rename the Figma variants, so the names keep matching Figma, and
a Developer change and QA retest).

The other names: `state`, `labelText`, `showLeading`, `showTrailing` and
`swapLeadingIcon` are the Figma properties in camelCase, the convention
agreed for ButtonCTA (`docs/password-field-prop-names.md:11-13`). `id`,
`className` and `...rest` are the input's own HTML attributes passed through
(`:28-33`).

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

All seven keys are present: `use_when` (4 entries), `dont_use_when` (3),
`variant_intent` (`state`), `placement` (empty), `pairs_with` (empty),
`required_tokens` (1) and `a11y` (6). Every non-empty entry has a `source`,
and `use_when` is not empty.

### Check 2: Every `dont_use_when` names an alternative (warning)

None of the three entries names another component or variant to use
instead. All three are sourced to
`Figma 348:391 (Password Field › Don’t, text I348:391;2406:416;348:394)`:

- "Don’t reveal the password by default or make the visibility control difficult to find or understand."
- "Don’t clear the password after an error unless there is a clear security reason."
- "Don’t use a password field for information that isn’t secret."

This review suggests no alternative.

### Check 3: `a11y` specific, not generic (pass)

Each entry names something checkable, the code does what it says, and every
citation is exact at the reviewed commit:

| Entry | Source | The cited line at `65928e7` |
| --- | --- | --- |
| "The label is a native <label> tied to the input’s id." | `PasswordField.jsx:67` | `<FieldLabel labelText={labelText} htmlFor={inputId} />` |
| "The input is type=\"password\" while hidden and type=\"text\" while shown." | `PasswordField.jsx:71` | `type={visible ? 'text' : 'password'}` |
| "The show/hide toggle’s aria-label is \"Show <labelText>\", and its aria-pressed is true while the password is shown." | `PasswordField.jsx:79-80` | ``trailingLabel={`Show ${labelText}`}`` and `trailingPressed={visible}`, rendered as `aria-label={trailingLabel}` and `aria-pressed={trailingPressed}` at `FieldControl.jsx:140-141` |
| "The show/hide toggle is in the tab order." | `PasswordField.jsx:81` | `trailingFocusable`, which leaves `tabIndex` unset at `FieldControl.jsx:142` |
| "state=\"disable\" sets disabled on the input." | `FieldControl.jsx:116` | `disabled={isDisabled}`; PasswordField maps `disable` to the `disable` look (`PasswordField.jsx:41`) |
| "The error states (\"error visible\", \"error invisible\") set aria-invalid on the input." | `FieldControl.jsx:117` | `aria-invalid={state === 'error' ? true : undefined}`; both map to `error` (`PasswordField.jsx:39-40`) |

### Check 4: `required_tokens` resolve (pass)

- `PasswordField.css:11` references one token, `--spacing-gap-sm`; `PasswordField.jsx` references none. `required_tokens` lists exactly `--spacing-gap-sm`.
- Defined at `build/css/tokens.css:255` and `build/css/tokens-back-office.css:36` at the commit.

### Check 5: All variants covered (pass)

The code accepts one variant prop, `state`, with nine values (`idle`,
`hover`, `active`, `focus`, `password visible`, `password invisible`,
`error visible`, `error invisible`, `disable`; `PasswordField.jsx:32-42`).
Every value is a key in `variant_intent.state`. All nine have a `null`
meaning, which counts as covered.

Not variant props: `labelText`, `showLeading`, `showTrailing`,
`swapLeadingIcon`, and the pass-throughs `id`, `className`, `...rest`.

### Check 6: No two components claim the same job (pass)

Every `use_when` entry of every intent file at the commit was read against
PasswordField's four.

**TextField's five Do bullets are no longer in PasswordField's intent.**
TextField's `use_when` (`Figma 71:2194`) holds "Keep labels, helper text, and
validation messages concise and clear.", "Use placeholder text only when an
example or format helps users understand the expected input.", "Provide
clear error and validation messages when input needs correction.", "Use the
appropriate focus, error, disabled, and filled states." and "Keep input
fields consistent in height, spacing, alignment, and styling." None of them
appears in PasswordField's file, word for word or paraphrased.

**PasswordField's label entry against TextField's: different situations.**

| PasswordField `use_when` | TextField `use_when` |
| --- | --- |
| "Label which password is needed, such as current, new or confirm password." | "Keep labels, helper text, and validation messages concise and clear." |
| `Figma 348:391 (Password Field › Do, text I348:391;2406:461;348:397)` | `Figma 71:2194 (Text Field › Do, text I71:2194;2406:461;71:2190)` |

PasswordField's entry is about saying *which* password a field asks for, a
situation that exists only where a secret is entered. TextField's is about
the length and clarity of its own label, helper and validation text. The
`b17f75b` TextField review reached the same judgement on this pair.

Checked and not findings:

- PasswordField's "Use PasswordField for passwords, PINs or other secrets."
  and "Use PasswordField when the value must be hidden while typing." against
  TextField's "Use TextField for the text the user needs to read back, such
  as a name or email.": secret versus readable values. PasswordField's
  `dont_use_when` "Don’t use a password field for information that isn’t
  secret." keeps the readable case off its side, and TextArea's "Don’t use a
  text area for sensitive information that needs protected password-style
  entry." keeps the secret case off TextArea's.
- PasswordField's "Use password visibility controls for PasswordField when
  appropriate." has no counterpart in any other intent file.
- SearchField's four `use_when` entries are about search scope, finding the
  field, keeping the query visible and search-as-you-type; none describes a
  secret value.
- No other intent file's `use_when` mentions passwords, PINs, secrets or
  hidden values.

## Noted for the owner, not a gate or check

**Typing gap.** `PasswordField.jsx:47-56` gives `id` and `className` no
default, the same pattern as ButtonCTA, Label and TextField. Under the
owner's 2026-10-15 ruling this does not block an export; it is to be fixed
before the npm publish, with the others.

**Intent `figma` field.** `PasswordField.intent.json:3` links the component
node (95-596), while every entry cites the doc frame 348:391. That is the
same shape as the other input fields and not a finding.

**Design gaps already recorded.** `docs/password-field-prop-names.md:78-112`
lists the Designer's open gaps (empty cells drawn with the open eye, no
focus look for the eye, the hover eye ignoring `showTrailing`, the hover
border and focus leading icon differing from TextField's Figma). They are
recorded owner decisions or Designer items, not shut gates.

## What each owner is waiting on

- **Owner** (gate 5, blocks): record your decision on the suggested `state`
  value renames in `docs/password-field-prop-names.md:52-56`: keep Figma's
  values as written (`password visible`, `password invisible`,
  `error visible`, `error invisible`), or adopt `passwordVisible`,
  `passwordInvisible`, `errorVisible`, `errorInvisible` (a rename also needs
  the Designer to rename the Figma variants, a Developer change and a QA
  retest). The gate opens once the decision is in `docs/` on `main`.
- **Owner** (check 2, warning only, does not block): none of the three
  `dont_use_when` entries names an alternative. "Don’t use a password field
  for information that isn’t secret." is the one where naming TextField
  would help a reader most; that wording is the Designer's, on 348:391.
- **Owner** (gate 7, informational): the banner in `docs/versioning.md`
  still calls the file a draft.
- **Owner** (typing, informational): `id` and `className` have no defaults;
  to be fixed before the publish, by your 2026-10-15 ruling.
