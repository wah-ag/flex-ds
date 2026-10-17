# Release review: TextArea at 67f095d

| | |
| --- | --- |
| Component | TextArea (`src/components/TextArea/`), Figma `TextArea` 110:1364, doc frame 349:493, registry row "TextArea" (`rec5mkkrKBezZjf9Z`) |
| Reviewed commit | `67f095d6db460dfb76deb9e00e440d88a7c3e33a` (`main` HEAD, "Merge pull request #179 from wah-ag/staging") |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`) |
| Reviewed at | 2026-10-17T05:41:38Z |
| **Verdict** | **Blocked**: gate 5 (Names final) is shut. The other six gates are open, and checks 1, 3, 4, 5 and 6 pass. Check 2 gives a warning, which does not change the verdict. |

This is TextArea's first release review.

This review read a clean, detached checkout of exactly the reviewed commit
(`git worktree add --detach`, no local changes), after `npm ci` and
`npm run build:tokens`.

Owner rulings applied: 2026-10-04, TextArea's box height may stay unbound to
tokens (120 default, 120 minimum, 150 maximum), focus and error states are
skipped for now, and the resize grip is the browser's native vertical resize
rather than a drawn icon (`docs/text-area-prop-names.md:53-67`); 2026-10-16,
each input field has its own doc frame (TextArea 349:493); the #122, #154 and
#158 waivers (`docs/retest-waivers.md:36`, `:40`, `:41`); 2026-10-15, the
publish is held until every component is Cleared (noted, not a finding).

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/TextArea/TextArea.intent.json` exists at the commit and parses as JSON (`node -e "JSON.parse(...)"` prints `parses`). Last changed in `6850f4d` (#158, merge `333163b`). Every `use_when` and `dont_use_when` source cites `Figma 349:493`, TextArea's own doc frame. |
| 2 | Development is Completed | **Open** | Components row `rec5mkkrKBezZjf9Z` reads `Development = Completed` (Design `Done`, Results Summary `Passed`, 5 of 5 rows, Synchronization 100%). Production Storybook: `https://flex-ds-sigma.vercel.app/?path=/story/components-textarea--idle`. Commit: `https://github.com/wah-ag/flex-ds/commit/b17f75b2f1efd7e3a289cb444eda1c9c10119a2d`, an ancestor of the reviewed commit; `git diff --stat b17f75b 67f095d -- src/components/TextArea src/components/FieldLabel` is empty, so the code the board says shipped is the code reviewed. Release Review and Release Verdict are empty. |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0: "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0: "✔ Modes match and every alpha token carries alpha." `git diff --stat origin/main -- tokens/` and `git diff --stat 67f095d origin/staging -- tokens/` are both empty (`origin/staging` has no commit that is not on `main`). Every remote token branch (`tokens-update`, `tokens-update-staging`, `component/icon-stroke-token`, `revert-64-tokens-update`, `token-runner-agent`) is an ancestor of the reviewed commit. No pull request is open (`gh pr list --state open` returns `[]`). |
| 4 | Public surface decided | **Open** | Public: it has a Components row (`rec5mkkrKBezZjf9Z`) and a Figma node (110:1364), and nothing under `docs/` declares it internal (`src/index.ts:4-6` names only FieldControl and FieldLabel as internal). `src/index.ts` does not export TextArea yet; under the gate that neither opens nor shuts it. |
| 5 | Names final | **Shut** | See *Gate 5* below. `docs/text-area-prop-names.md:18-25` holds an open rename suggestion, `textAreaLevelText` → `labelText`, with no owner decision recorded. |
| 6 | States complete | **Open** | Figma's `state` matrix has 5 values (`docs/text-area-prop-names.md:3-5`, `:34-42`); `TextArea.stories.jsx:60-64` has one story for each (`Idle`, `Hover`, `Press`, `Active`, `Disable`), each pinned to its Figma variant node (`:7-13`). 5 linked Staging Testing rows, one per state, all `Passed`, all reading `Tested on staging 43e994622491d7c0a2713d65232b6ffc660bfb96`, an ancestor of the reviewed commit and on `origin/staging`. Focus and error are left out by the owner's ruling, recorded at `docs/text-area-prop-names.md:58-61`. See *Gate 6* below for what changed since. TextArea has no `size` in Figma (`:16`); the rows' Size reads `null`. |
| 7 | Version meaning known | **Open** | `docs/versioning.md` exists at the commit. TextArea is **New, MINOR**: it has never been exported (`git tag -l 'v*'` is empty, and `src/index.ts` does not export it). `docs/versioning.md:26`: "**New**: first time it is exported. MINOR." The banner at `:3-4` still reads "Draft for the owner's review."; as in earlier reviews, the file is treated as the policy in force because a human merged it in #118. |

### Gate 5

`docs/text-area-prop-names.md:10-14` maps each Figma property to its prop:
`state` → `state`, `placeholderText` → `placeholderText`,
`textAreaLevelText` → `textAreaLevelText`. The code takes exactly those
(`TextArea.jsx:29-36`), plus `id`, `className` and `...rest`, documented as
the textarea's own HTML attributes (`docs/text-area-prop-names.md:27-32`).
Every prop is the Figma name as written.

The file then proposes a rename (`docs/text-area-prop-names.md:18-25`):

> ### Suggested rename (not applied)
>
> | Figma name | Suggested | Why |
> | --- | --- | --- |
> | `textAreaLevelText` | `labelText` | It sets the label above the box. "Level" reads as a misspelling of "Label". `labelText` is the name TextField, PasswordField and FieldLabel already use. |
>
> The prop keeps the Figma name until the Designer renames the property in
> Figma, or a human decides otherwise.

`TextArea.jsx:8-9` repeats it: "a rename to `labelText` is proposed for
review, not applied." No owner decision on it is recorded in that file or
anywhere else under `docs/` (`grep -rn -i "textAreaLevelText" docs/` finds
only `docs/text-area-prop-names.md`; the "Owner rulings applied
(2026-10-04)" section at `:53-68` covers height, states and the resize handle
only). An open suggestion shuts the gate, as it did for CardContainer at
`64ed84e` (`reports/release-review/CardContainer-64ed84e.md`).

The decision matters for the version as well: the name ships as public API
on the first export, and changing it after publish is a MINOR (breaking)
change under `docs/versioning.md:16`.

### Gate 6

`git diff --stat 43e9946 67f095d -- src/components/TextArea src/components/FieldLabel`
(TextArea imports FieldLabel, which imports nothing else from
`src/components/`):

- `TextArea.jsx` and `FieldLabel.jsx`: one removed line each,
  `import './TextArea.css';` and `import './FieldLabel.css';`, from
  `a91a822`, brought by #122 (merge `d22ee86`), waived at
  `docs/retest-waivers.md:36`. Both stylesheets now load from
  `src/styles.css:15` and `:27`, and are unchanged.
- `TextArea.intent.json`: added and refreshed by intent-only merges
  (#105 and #108, shipped earlier; #154 and #158, waived at `:40` and `:41`).

`TextArea.css` and `TextArea.stories.jsx` are unchanged since `43e9946`. So
every row's pass covers the code at the reviewed commit, by test or by
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

All seven keys are present: `use_when` (3 entries), `dont_use_when` (5),
`variant_intent` (`state`), `placement` (empty), `pairs_with` (empty),
`required_tokens` (16) and `a11y` (2). Every non-empty entry has a `source`,
and `use_when` is not empty.

### Check 2: Every `dont_use_when` names an alternative (warning)

One of the five entries names an alternative: "Don’t use a text area for
short, single-line information such as a name, email address, or postal
code. Use TextField." The other four name none. All five are sourced to
`Figma 349:493 (Text Area › Don’t, text I349:493;2406:416;349:496)`:

- "Don’t make the initial field too small for the expected response."
- "Don’t truncate or silently discard text when users reach a limit."
- "Don’t make the field so short that users can’t review a typical response."
- "Don’t use a text area for sensitive information that needs protected password-style entry."

The first and third say nearly the same thing; both are on the doc frame as
written. This review suggests no alternative.

### Check 3: `a11y` specific, not generic (pass)

Each entry names something checkable, and the code does what it says at the
reviewed commit:

| Entry | Source | The cited line at `67f095d` |
| --- | --- | --- |
| "The label is a native <label> tied to the textarea’s id." | `TextArea.jsx:43` | `<FieldLabel labelText={textAreaLevelText} htmlFor={textAreaId} />`. FieldLabel renders a `<label>` with `htmlFor={htmlFor}` (`FieldLabel.jsx:11-14`), and the `<textarea>` takes `id={textAreaId}` (`TextArea.jsx:46`), which defaults to `useId()` when no `id` is passed (`:37-38`). |
| "Renders a native <textarea>; state=\"disable\" sets disabled." | `TextArea.jsx:50` | `disabled={look === 'disable'}` on the `<textarea>` opened at `:44`, with `look` at `:39`. |

### Check 4: `required_tokens` resolve (pass)

Every one of the 16 tokens listed is defined in `build/css/` at the commit:
the 10 colour roles in `tokens.css` and `tokens-dark.css`; the five scale
tokens (`--border-radius-control-xs`, `--border-width-default`,
`--spacing-gap-sm`, `--spacing-padding-md`, `--spacing-padding-sm`) in
`tokens.css` and `tokens-back-office.css`; `--body-md` in `tokens.css`.

Every `var(--…)` in `TextArea.css` and `TextArea.jsx` is listed, apart from
the component's own custom properties (`--text-area-height`,
`--text-area-min-height`, `--text-area-max-height`, `--text-area-border`,
`--text-area-background`, `--text-area-text`, `--text-area-placeholder`),
which are defined in `TextArea.css` itself and are not tokens. The three
height values are the raw values the owner's 2026-10-04 ruling allows
(`TextArea.css:7-13`). The list and the code match exactly in both
directions.

### Check 5: All variants covered (pass)

The code accepts one variant prop, `state`, with five values (`idle`,
`hover`, `press`, `active`, `disable`; `TextArea.jsx:27`; any other value
falls back to `idle` at `:39`). Every value is a key in
`variant_intent.state`, and no key is left over. All five have a `null`
meaning, which counts as covered.

Not variant props: `placeholderText`, `textAreaLevelText`, and the
pass-throughs `id`, `className`, `...rest`.

### Check 6: No two components claim the same job (pass)

Every `use_when` entry of the other 19 intent files at the commit was read
against TextArea's three. Two of TextArea's are about the box's size and
line-height; one is about choosing between a text area and a text field.
The closest pair:

| TextArea `use_when` | TextField `use_when` |
| --- | --- |
| "Use a text area when the response may naturally span more than one line; use a text field for short values." | "Use TextField for the text the user needs to read back, such as a name or email." |
| `Figma 349:493 (Text Area › Do, text I349:493;2406:461;349:499)` | `Figma 71:2194 (Text Field › Do, text I71:2194;2406:461;71:2190)` |

TextArea claims multi-line responses and itself sends short values to a text
field; its `dont_use_when` sends "short, single-line information such as a
name, email address, or postal code" to TextField by name. TextField's entry
names short values (a name, an email). No overlap is left.

- TextField's "Keep input fields consistent in height, spacing, alignment,
  and styling." is about consistency across fields; TextArea's "Set a useful
  default size …" is about the box's own starting height. Different
  situations.
- PasswordField's entries concern secrets, and TextArea's `dont_use_when`
  keeps sensitive entry away from it. SearchField's concern search queries.
  TextArea claims neither.

## Noted for the owner, not a gate or check

**Typing gap.** `TextArea.jsx:29-36` gives `className` no default, the same
pattern as ButtonCTA, Label, TextField, PasswordField and SearchField. Under
your 2026-10-15 ruling this does not block an export; it is to be fixed
before the npm publish, with the others.

**Publish held.** Under your 2026-10-15 ruling, version 0.1.0 is approved
but the publish waits until every component is Cleared.

**Owner exceptions in force.** The unbound height, the skipped focus and
error states, and the native resize handle are your 2026-10-04 rulings,
recorded at `docs/text-area-prop-names.md:53-67`. They were applied, not
re-raised.

## What each owner is waiting on

- **Owner** (gate 5, blocker): `docs/text-area-prop-names.md:18-25` suggests
  renaming Figma's `textAreaLevelText` to `labelText` "for review", and no
  decision is recorded under `docs/`. The gate opens once your decision is
  recorded there: either keep `textAreaLevelText` (the Figma name, as the
  code has it now), or rename, in which case the Designer renames the Figma
  property first and the Developer, QA and doc-generator follow, as they did
  for CardContainer's `cardSlot`.
- **Owner** (check 2, warning only, does not block): four of the five
  `dont_use_when` entries name no alternative, and two repeat each other.
  "Don’t use a text area for sensitive information that needs protected
  password-style entry." is the one where naming PasswordField would help a
  reader most; that wording is the Designer's, on 349:493.
- **Owner** (gate 7, informational): the banner in `docs/versioning.md`
  still calls the file a draft.
- **Owner** (typing, informational): `className` has no default; to be fixed
  before the publish, by your 2026-10-15 ruling.
- After the gate 5 decision reaches `main`, a new "release TextArea" reviews
  it again at that commit.
