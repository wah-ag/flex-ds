# Release review: PasswordField at dc29e10

| | |
| --- | --- |
| Component | PasswordField (`src/components/PasswordField/`), Figma `PasswordField` 95:596, doc frame 348:391, registry row "InputField/PasswordField" |
| Reviewed commit | `dc29e101817de3b9d4ededa6b9a3748e7467b407` (`main` HEAD, "Merge pull request #173 from wah-ag/staging"), the commit the owner named |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`) |
| Reviewed at | 2026-10-16T18:24:56Z |
| **Verdict** | **Cleared**: all seven gates are open, and checks 1, 3, 4, 5 and 6 pass. Check 2 gives a warning, which does not change the verdict. |

This is PasswordField's second release review. The first, at `65928e7`
(`reports/release-review/PasswordField-65928e7.md`, #166, merge `43258c4`),
was Blocked on gate 5 only. Since then, on `main`: the owner's decision to
rename the four spaced `state` values, recorded in
`docs/password-field-prop-names.md` (#168/#169, shipped in #170); the code,
story and docs rename (#168, merge `3298feb`); the intent re-keyed to the
camelCase values (#171, merge `d96d21e`); and the retest waivers for
`3298feb` (#169) and `d96d21e` (#172), shipped in #173.

This review read a clean, detached checkout of exactly the reviewed commit
(`git worktree add --detach`, no local changes), after `npm ci` and
`npm run build:tokens`.

Owner rulings applied: 2026-10-16, each input field has its own doc frame
(PasswordField 348:391); 2026-10-16, the `state` rename (gate 5); the #122,
#154, #158, #168 and #171 waivers; 2026-10-16, intent-only commits get no
GitHub Commits row (`.claude/skills/registry/SKILL.md`); 2026-10-15, export
and packaging are held until every component is Cleared, and the typing gap
is fixed before the publish (noted, not findings).

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/PasswordField/PasswordField.intent.json` exists at the commit and parses as JSON (`node -e "JSON.parse(...)"`). Last changed in `fa903aa` (#171, merge `d96d21e`), which re-keyed `variant_intent.state` to the camelCase values and updated the error-state a11y text. Every `use_when` and `dont_use_when` source cites `Figma 348:391`. |
| 2 | Development is Completed | **Open** | Components row `rec2S5x0BbFWozwIr` reads `Development = Completed` (Design `Done`, Results Summary `Passed`). Production Storybook: `https://flex-ds-sigma.vercel.app/?path=/story/components-passwordfield--idle`. Commit: `https://github.com/wah-ag/flex-ds/commit/dc29e101817de3b9d4ededa6b9a3748e7467b407`, the reviewed commit itself, so the code the board says shipped is the code reviewed. |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0: "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0: "✔ Modes match and every alpha token carries alpha." `git diff --stat origin/main -- tokens/` and `git diff --stat origin/staging -- tokens/` are both empty (`origin/staging` has no commit that is not on `main`). Every remote token branch (`tokens-update`, `tokens-update-staging`, `component/icon-stroke-token`, `revert-64-tokens-update`, `token-runner-agent`) is an ancestor of the reviewed commit. No pull request is open (`gh pr list --state open` returns `[]`). |
| 4 | Public surface decided | **Open** | Public: it has a Components row (`rec2S5x0BbFWozwIr`) and a Figma node (95:596), and nothing under `docs/` declares it internal (`src/index.ts:4-6` names only FieldControl and FieldLabel as internal). `src/index.ts:15-20` exports Avatar, ButtonCTA, CardContainer, IconButton, Label and TextField, not PasswordField; under the gate that neither opens nor shuts it. |
| 5 | Names final | **Open** | See *Gate 5* below. The props match Figma (`docs/password-field-prop-names.md:15-21`; `PasswordField.jsx:49-58`), the `state` values match the renamed Figma variants (`:40-50`; `PasswordField.jsx:33-43`), and the one suggestion under `docs/` for this component records the owner's decision (`:52-58`). |
| 6 | States complete | **Open** | Figma's `state` matrix has 9 values (`docs/password-field-prop-names.md:40-50`); `PasswordField.stories.jsx:68-76` has one story for each (`Idle`, `Hover`, `Active`, `Focus`, `PasswordVisible`, `PasswordInvisible`, `ErrorVisible`, `ErrorInvisible`, `Disable`), each pinned to its Figma variant node (`:8-18`). 9 linked Staging Testing rows, one per state, all `Passed`. The four renamed rows (passwordVisible, passwordInvisible, errorVisible, errorInvisible) read `Tested on staging 3298febbb9dd68dfb650c6a7b2569c166fa275ce`; the other five (idle, hover, active, focus, disable) read `Tested on staging 43e994622491d7c0a2713d65232b6ffc660bfb96`. Both are ancestors of the reviewed commit. See *Gate 6* below for what changed since each. PasswordField has no `size` in Figma (`docs/password-field-prop-names.md:23-26`); the rows' Size reads `null`. |
| 7 | Version meaning known | **Open** | `docs/versioning.md` exists at the commit. PasswordField is **New, MINOR**: it has never been exported (`git tag -l 'v*'` is empty, and `src/index.ts` does not export it). `docs/versioning.md:26`: "**New**: first time it is exported. MINOR." The `state` rename does not change the class: no released consumer ever had the spaced values. The banner at `:3-4` still reads "Draft for the owner's review."; as in earlier reviews, the file is treated as the policy in force because a human merged it in #118. |

### Gate 5

`docs/password-field-prop-names.md:52-58`:

> **Decided (owner, 2026-10-16):** the four spaced values (`password visible`,
> `password invisible`, `error visible`, `error invisible`) are renamed to
> `passwordVisible`, `passwordInvisible`, `errorVisible` and `errorInvisible`.
> The Designer renamed the Figma variants first (95:591, 95:594, 95:592,
> 95:589), so the prop values still follow Figma exactly. The old spaced values
> are no longer accepted. The other five values are unchanged. This closes the
> open suggestion that blocked the release review at 65928e7 (gate 5).

The code takes exactly those values (`PasswordField.jsx:33-43`, the `LOOK`
map; `STARTS_VISIBLE` at `:46`), and the story control offers exactly the
nine (`PasswordField.stories.jsx:41`, `Object.keys(NODES)`). The four
renamed variant nodes in the stories (`:13-16`) are the four the decision
names. `grep -rn -i -E "for review|suggest" docs/` finds nothing open for
PasswordField; the file's title no longer reads "(for review)" (`:1`).

The other names are unchanged from the `65928e7` review: `state`,
`labelText`, `showLeading`, `showTrailing` and `swapLeadingIcon` are the
Figma properties in camelCase (`:11-13`), and `id`, `className` and
`...rest` are the input's own HTML attributes passed through (`:28-33`).

### Gate 6

`git diff --stat 3298feb dc29e10 -- src/components/PasswordField src/components/FieldControl src/components/FieldLabel`
changes only `PasswordField.intent.json` (#171, merge `d96d21e`, waived at
`docs/retest-waivers.md:43`).

`git diff --stat 43e9946 dc29e10` over the same folders: one removed line in
each of `FieldControl.jsx` and `FieldLabel.jsx` and part of
`PasswordField.jsx` (#122, waived at `:36`); the `state` rename in
`PasswordField.jsx` and `PasswordField.stories.jsx` (#168, merge `3298feb`,
waived for the five unchanged rows at `:42`, and the four renamed rows
retested on `3298feb`); and `PasswordField.intent.json` (intent-only: #105
and #108 shipped earlier, #154, #158 and #171 waived at `:40`, `:41`, `:43`).

So every row's pass covers the code at the reviewed commit, by test or by
recorded waiver.

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

Unchanged since `65928e7`. None of the three entries names another component
or variant to use instead. All three are sourced to
`Figma 348:391 (Password Field › Don’t, text I348:391;2406:416;348:394)`:

- "Don’t reveal the password by default or make the visibility control difficult to find or understand."
- "Don’t clear the password after an error unless there is a clear security reason."
- "Don’t use a password field for information that isn’t secret."

This review suggests no alternative.

### Check 3: `a11y` specific, not generic (pass)

Each entry names something checkable, the code does what it says, and every
citation is exact at the reviewed commit:

| Entry | Source | The cited line at `dc29e10` |
| --- | --- | --- |
| "The label is a native <label> tied to the input’s id." | `PasswordField.jsx:69` | `<FieldLabel labelText={labelText} htmlFor={inputId} />` |
| "The input is type=\"password\" while hidden and type=\"text\" while shown." | `PasswordField.jsx:73` | `type={visible ? 'text' : 'password'}` |
| "The show/hide toggle’s aria-label is \"Show <labelText>\", and its aria-pressed is true while the password is shown." | `PasswordField.jsx:81-82` | ``trailingLabel={`Show ${labelText}`}`` and `trailingPressed={visible}`, rendered as `aria-label={trailingLabel}` and `aria-pressed={trailingPressed}` at `FieldControl.jsx:140-141` |
| "The show/hide toggle is in the tab order." | `PasswordField.jsx:83` | `trailingFocusable`, which leaves `tabIndex` unset at `FieldControl.jsx:142` |
| "state=\"disable\" sets disabled on the input." | `FieldControl.jsx:116` | `disabled={isDisabled}`, with `isDisabled = state === 'disable'` at `:81`; PasswordField maps `disable` to the `disable` look (`PasswordField.jsx:42`) |
| "The error states (\"errorVisible\", \"errorInvisible\") set aria-invalid on the input." | `FieldControl.jsx:117` | `aria-invalid={state === 'error' ? true : undefined}`; both map to `error` (`PasswordField.jsx:40-41`) |

The a11y text now quotes the camelCase values, matching the code.

### Check 4: `required_tokens` resolve (pass)

- `PasswordField.css:11` references one token, `--spacing-gap-sm`; `PasswordField.jsx` references none. `required_tokens` lists exactly `--spacing-gap-sm`.
- Defined at `build/css/tokens.css:255` and `build/css/tokens-back-office.css:36` at the commit.

### Check 5: All variants covered (pass)

The code accepts one variant prop, `state`, with nine values (`idle`,
`hover`, `active`, `focus`, `passwordVisible`, `passwordInvisible`,
`errorVisible`, `errorInvisible`, `disable`; `PasswordField.jsx:33-43`).
Every value is a key in `variant_intent.state`, and no key is left over. All
nine have a `null` meaning, which counts as covered.

Not variant props: `labelText`, `showLeading`, `showTrailing`,
`swapLeadingIcon`, and the pass-throughs `id`, `className`, `...rest`.

### Check 6: No two components claim the same job (pass)

Every `use_when` entry of all 20 intent files at the commit was read against
PasswordField's four. Since `65928e7` no other intent file has changed
(`git diff --stat 65928e7 dc29e10` touches only PasswordField's), and
PasswordField's own `use_when` is unchanged, so the judgement of the
`65928e7` review stands. In short:

| PasswordField `use_when` | TextField `use_when` |
| --- | --- |
| "Label which password is needed, such as current, new or confirm password." | "Keep labels, helper text, and validation messages concise and clear." |
| `Figma 348:391 (Password Field › Do, text I348:391;2406:461;348:397)` | `Figma 71:2194 (Text Field › Do, text I71:2194;2406:461;71:2190)` |

PasswordField's entry is about saying *which* password a field asks for;
TextField's is about the clarity of its own label, helper and validation
text. Different situations.

- PasswordField's "Use PasswordField for passwords, PINs or other secrets."
  and "Use PasswordField when the value must be hidden while typing." against
  TextField's "Use TextField for the text the user needs to read back, such
  as a name or email.": secret versus readable values. PasswordField's
  `dont_use_when` "Don’t use a password field for information that isn’t
  secret." keeps the readable case off its side, and TextArea's "Don’t use a
  text area for sensitive information that needs protected password-style
  entry." keeps the secret case off TextArea's.
- "Use password visibility controls for PasswordField when appropriate." has
  no counterpart in any other intent file.
- Label's, ButtonCTA's and Avatar's entries that mention labels are about
  their own label text, not a field for a secret. No other `use_when`
  mentions passwords, PINs, secrets or hidden values.

## Noted for the owner, not a gate or check

**Typing gap.** `PasswordField.jsx:49-58` gives `id` and `className` no
default, the same pattern as ButtonCTA, Label and TextField. Under the
owner's 2026-10-15 ruling this does not block an export; it is to be fixed
before the npm publish, with the others.

**Export and packaging held.** Under the owner's 2026-10-15 ruling, the
export from `src/index.ts` and the packaging wait until every component is
Cleared.

**Staging Testing row names.** The four renamed rows keep their primary
names with the old spaced values ("InputField/PasswordField / password
visible", and so on); their Variants and Context name the camelCase values.
The name is QA's column and does not decide any gate.

**Design gaps already recorded.** `docs/password-field-prop-names.md` lists
the Designer's open gaps and the owner's 2026-10-04 decisions. They are
recorded decisions or Designer items, not shut gates.

## What each owner is waiting on

No gate is shut and no check fails.

- **Owner** (check 2, warning only, does not block): none of the three
  `dont_use_when` entries names an alternative. "Don’t use a password field
  for information that isn’t secret." is the one where naming TextField
  would help a reader most; that wording is the Designer's, on 348:391.
- **Owner** (gate 7, informational): the banner in `docs/versioning.md`
  still calls the file a draft.
- **Owner** (typing, informational): `id` and `className` have no defaults;
  to be fixed before the publish, by your 2026-10-15 ruling.
