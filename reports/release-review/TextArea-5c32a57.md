# Release review: TextArea at 5c32a57

| | |
| --- | --- |
| Component | TextArea (`src/components/TextArea/`), Figma `TextArea` 110:1364, doc frame 349:493, registry row "TextArea" (`rec5mkkrKBezZjf9Z`) |
| Reviewed commit | `5c32a577f0873b81f67d1e97b2a5ff6db8069a88` (`main` HEAD, "Merge pull request #182 from wah-ag/staging") |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`) |
| Reviewed at | 2026-10-17T06:27:37Z |
| **Verdict** | **Cleared**: all seven gates are open, and checks 1, 3, 4, 5 and 6 pass. Check 2 gives a warning, which does not change the verdict. |

This is TextArea's second release review. The first, at `67f095d`
(`reports/release-review/TextArea-67f095d.md`, merged in #180 as `1fcc876`),
was Blocked on gate 5 only: the `textAreaLevelText` → `labelText` suggestion
had no owner decision. Its Release Review and Release Verdict were written
to the registry (Blocked) before this review began.

This review read a clean, detached checkout of exactly the reviewed commit
(`git worktree add --detach`, no local changes), after `npm ci` and
`npm run build:tokens`.

What changed between the two reviewed commits
(`git diff --stat 67f095d 5c32a57`): `docs/text-area-prop-names.md`,
`TextArea.jsx`, `TextArea.stories.jsx` (the rename, #181, `8e9c96c`, merge
`a3d3eec`) and the earlier report itself. No intent file, no token file and
no CSS changed.

Owner rulings applied, not re-raised: 2026-10-04, the height may stay
unbound to tokens, focus and error states are skipped, and the resize grip
is the browser's native one (`docs/text-area-prop-names.md:57-71`);
2026-10-16, TextArea's own doc frame is 349:493; 2026-10-15, intent a11y
citations off by a line or two pass check 3 (ButtonCTA precedent), and are
still reported; 2026-10-15, the publish is held until every component is
Cleared (noted, not a finding); 2026-10-17, screenshot attachments waived
for QA's round on `a3d3eec`.

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/TextArea/TextArea.intent.json` exists at the commit and parses (`require()` in Node reads it). Last changed in `6850f4d` (#158, merge `333163b`); unchanged since the previous review (`git diff --stat 67f095d 5c32a57 -- '*.intent.json'` is empty). Every `use_when` and `dont_use_when` source cites `Figma 349:493`. The intent file never names the label prop, so the rename leaves it accurate apart from the line numbers under check 3. |
| 2 | Development is Completed | **Open** | Components row `rec5mkkrKBezZjf9Z` reads `Development = Completed` (Design `Done`, Results Summary `Passed`). Production Storybook: `https://flex-ds-sigma.vercel.app/?path=/story/components-textarea--idle`. Commit: `https://github.com/wah-ag/flex-ds/commit/5c32a577f0873b81f67d1e97b2a5ff6db8069a88`, which is the reviewed commit itself, so the code the board says shipped is the code reviewed. |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0: "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0: "✔ Modes match and every alpha token carries alpha." The reviewed commit is `origin/main`; `git diff --stat 5c32a57 origin/staging -- tokens/` and `git diff --stat 67f095d 5c32a57 -- tokens/` are both empty. No pull request is open (`gh pr list --state open` returns `[]`). |
| 4 | Public surface decided | **Open** | Public: a Components row (`rec5mkkrKBezZjf9Z`) and a Figma node (110:1364); nothing under `docs/` declares it internal (`src/index.ts:4-7` names only FieldControl and FieldLabel as internal). `src/index.ts:14-22` does not export TextArea yet; under the gate that neither opens nor shuts it. |
| 5 | Names final | **Open** | See *Gate 5* below. The rename suggestion is decided and applied; `docs/text-area-prop-names.md:18-29` records the owner's ruling, dated 2026-10-17. |
| 6 | States complete | **Open** | See *Gate 6* below. Five Figma states, five stories, five Staging Testing rows, all `Passed` on `a3d3eec`; focus and error left out by the owner's ruling at `docs/text-area-prop-names.md:62-65`. |
| 7 | Version meaning known | **Open** | `docs/versioning.md` exists at the commit. TextArea is **New, MINOR**: it has never been exported (`git tag -l 'v*'` is empty; `src/index.ts` does not export it). `docs/versioning.md:26`: "**New**: first time it is exported. MINOR." Because it is new, the `textAreaLevelText` → `labelText` rename is not a breaking change for any consumer: the old name was never published. The banner at `:3-4` still reads "Draft for the owner's review."; as in earlier reviews, the file is treated as the policy in force because a human merged it in #118. |

### Gate 5

`docs/text-area-prop-names.md:10-14` maps each Figma property to its prop:

| Figma property | Prop |
| --- | --- |
| `state` | `state` |
| `placeholderText` | `placeholderText` |
| `labelText` | `labelText` |

The code takes exactly those (`TextArea.jsx:28-34`), plus `id`, `className`
and `...rest`, documented as the textarea's own HTML attributes
(`docs/text-area-prop-names.md:31-36`).

The ruling, at `docs/text-area-prop-names.md:18-29`:

> ### Owner ruling: `textAreaLevelText` renamed to `labelText` (2026-10-17)
>
> … On 2026-10-17 the owner ruled: "Rename textAreaLevelText to labelText.
> I'll rename the property in Figma first."
>
> The Designer renamed the property on the component set (node 110:1364)
> first. `get_design_context` on 2026-10-17 reads it as `labelText`, default
> `Text Area`. The prop was then renamed to match. The default is unchanged.
> `textAreaLevelText` is no longer accepted.

`grep -rn textAreaLevelText src docs stories .storybook` finds the old name
only inside that ruling. The stories' `argTypes` and `args` read `labelText`
(`TextArea.stories.jsx:38`, `:43`), and QA's idle row records that the
deployed story's controls read `state, placeholderText, labelText` and that
the old name no longer changes the label. This review did not read Figma
itself; the Figma property name rests on the Developer's recorded
`get_design_context` read and on QA's comparison against 110:1364.

No suggestion under `docs/` for TextArea is left open.

### Gate 6

Figma's `state` has five values (`docs/text-area-prop-names.md:3-5`,
`:38-46`); `TextArea.stories.jsx` has one story for each (`Idle`, `Hover`,
`Press`, `Active`, `Disable`). The five linked Staging Testing rows:

| Row | Result | Context |
| --- | --- | --- |
| TextArea / idle | Passed | Tested on staging `a3d3eecc698bb8afcfc4809f2ae8692ff92c0976` |
| TextArea / hover | Passed | same |
| TextArea / press | Passed | same |
| TextArea / active | Passed | same |
| TextArea / disable | Passed | same |

`a3d3eec` is the #181 merge that brought the rename, it is on
`origin/staging` (`git merge-base --is-ancestor` succeeds), and
`git diff --stat a3d3eec 5c32a57 -- src/components/TextArea src/components/FieldLabel src/styles.css`
is empty. So every row tested exactly the TextArea and FieldLabel code at the
reviewed commit. Screenshot attachments for this round were waived by the
owner (2026-10-17), as each row's Context records. TextArea has no `size` in
Figma (`docs/text-area-prop-names.md:16`); the rows' Size reads `null`.

## Checks

| # | Check | Result |
| --- | --- | --- |
| 1 | Fields present | **Pass** |
| 2 | Every `dont_use_when` names an alternative | **Warning** (not a blocker) |
| 3 | `a11y` specific, not generic | **Pass** (both citations one line off; owner precedent) |
| 4 | `required_tokens` resolve | **Pass** |
| 5 | All variants covered | **Pass** |
| 6 | No two components claim the same job | **Pass** |

### Check 1: Fields present (pass)

All seven keys are present: `use_when` (3 entries), `dont_use_when` (5),
`variant_intent` (`state`), `placement` (empty), `pairs_with` (empty),
`required_tokens` (16) and `a11y` (2). Every non-empty entry has a `source`,
and `use_when` is not empty.

### Check 2: Every `dont_use_when` names an alternative (warning)

Unchanged since the previous review. One of the five entries names an
alternative: "Don’t use a text area for short, single-line information such
as a name, email address, or postal code. Use TextField." The other four name
none. All five are sourced to
`Figma 349:493 (Text Area › Don’t, text I349:493;2406:416;349:496)`:

- "Don’t make the initial field too small for the expected response."
- "Don’t truncate or silently discard text when users reach a limit."
- "Don’t make the field so short that users can’t review a typical response."
- "Don’t use a text area for sensitive information that needs protected password-style entry."

This review suggests no alternative.

### Check 3: `a11y` specific, not generic (pass)

Each entry names something checkable, and the code does what it says at the
reviewed commit. Both cited lines moved up by one when #181 shortened the
header comment, so each citation is now one line off. Under the owner's
2026-10-15 ruling (ButtonCTA precedent) that passes; it is reported here.

| Entry | Source | At `5c32a57` |
| --- | --- | --- |
| "The label is a native <label> tied to the textarea’s id." | `TextArea.jsx:43` | Line 43 is `<textarea`. The label is at `:42`: `<FieldLabel labelText={labelText}htmlFor={textAreaId} />`. FieldLabel renders a `<label>` with `htmlFor` (`FieldLabel.jsx:11-14`), and the `<textarea>` takes `id={textAreaId}` (`TextArea.jsx:45`), defaulting to `useId()` (`:36-37`). |
| "Renders a native <textarea>; state=\"disable\" sets disabled." | `TextArea.jsx:50` | Line 50 is `/>`. The attribute is at `:49`: `disabled={look === 'disable'}`, on the `<textarea>` opened at `:43`, with `look` at `:38`. |

Line 42 has no space between `{labelText}` and `htmlFor`. It is valid JSX:
esbuild compiles it to `jsx(FieldLabel, { labelText, htmlFor: textAreaId })`,
so the label is still tied to the textarea, and QA's rows confirm it on the
deployed build. Noted for the Developer below as formatting only; it is not
a gate or check failure.

### Check 4: `required_tokens` resolve (pass)

Every one of the 16 tokens listed is defined in `build/css/` at the commit:
the 10 colour roles in `tokens.css` and `tokens-dark.css`; the five scale
tokens (`--border-radius-control-xs`, `--border-width-default`,
`--spacing-gap-sm`, `--spacing-padding-md`, `--spacing-padding-sm`) in
`tokens.css` and `tokens-back-office.css`; `--body-md` in `tokens.css`.

Every `var(--…)` in `TextArea.css` and `TextArea.jsx` is listed, apart from
the component's own custom properties (`--text-area-background`,
`--text-area-border`, `--text-area-height`, `--text-area-max-height`,
`--text-area-min-height`, `--text-area-placeholder`, `--text-area-text`),
which `TextArea.css` defines itself and which are not tokens. The list and
the code match exactly in both directions. `TextArea.css` is unchanged since
the previous review.

### Check 5: All variants covered (pass)

The code accepts one variant prop, `state`, with five values (`idle`,
`hover`, `press`, `active`, `disable`; `TextArea.jsx:26`; any other value
falls back to `idle` at `:38`). Every value is a key in
`variant_intent.state`, and no key is left over. All five have a `null`
meaning, which counts as covered.

Not variant props: `placeholderText`, `labelText`, and the pass-throughs
`id`, `className`, `...rest`.

### Check 6: No two components claim the same job (pass)

No intent file changed between `67f095d` and `5c32a57`, so the comparison in
the previous review stands, re-read at this commit against the other 19
intent files. The closest pair:

| TextArea `use_when` | TextField `use_when` |
| --- | --- |
| "Use a text area when the response may naturally span more than one line; use a text field for short values." | "Use TextField for the text the user needs to read back, such as a name or email." |
| `Figma 349:493 (Text Area › Do, text I349:493;2406:461;349:499)` | `Figma 71:2194 (Text Field › Do, text I71:2194;2406:461;71:2190)` |

TextArea claims multi-line responses and sends short values to a text field;
its `dont_use_when` sends "short, single-line information such as a name,
email address, or postal code" to TextField by name. No overlap is left.
PasswordField's entries concern secrets, which TextArea's `dont_use_when`
keeps away from it; SearchField's concern search queries.

## Noted for the owner, not a gate or check

**Typing gap.** `TextArea.jsx:28-34` gives `className` no default, the same
pattern as ButtonCTA, Label, TextField, PasswordField and SearchField. Under
your 2026-10-15 ruling this does not block an export; it is to be fixed
before the npm publish, with the others.

**Publish held.** Under your 2026-10-15 ruling, version 0.1.0 is approved
but the publish waits until every component is Cleared.

**Owner exceptions in force.** The unbound height, the skipped focus and
error states, and the native resize handle are your 2026-10-04 rulings,
recorded at `docs/text-area-prop-names.md:57-71`. They were applied, not
re-raised.

## What each owner is waiting on

No shut gate and no failed check.

- **Owner** (check 2, warning only, does not block): four of the five
  `dont_use_when` entries name no alternative, and two repeat each other.
  The wording is the Designer's, on 349:493.
- **Owner** (check 3, informational): both a11y citations are one line off
  after #181 (`:43` is now `:42`, `:50` is now `:49`). Passes under your
  2026-10-15 ruling; a re-transpose by doc-generator would correct them if
  you want them exact.
- **Owner** (gate 7, informational): the banner in `docs/versioning.md`
  still calls the file a draft.
- **Developer** (informational, through the owner): `TextArea.jsx:42` reads
  `labelText={labelText}htmlFor={textAreaId}` with no space between the two
  attributes. It compiles correctly; formatting only.
- **Developer** (next step, once this report is merged): export TextArea
  from `src/index.ts`, as with PasswordField and SearchField. Packaging and
  publishing stay held under your 2026-10-15 ruling.
