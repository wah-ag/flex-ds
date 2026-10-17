# Release review: SearchField at b1fa345

| | |
| --- | --- |
| Component | SearchField (`src/components/SearchField/`), Figma `SearchBarItem/SearchField` 199:102, doc frame 224:2304, registry row "SearchBarItem/SearchField" (`recpIb6uO1bFYbzL5`) |
| Reviewed commit | `b1fa34537a836eeb8bfc7329f7e8364b51c2fb23` (`main` HEAD, "Merge pull request #176 from wah-ag/staging") |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`) |
| Reviewed at | 2026-10-17T05:13:40Z |
| **Verdict** | **Cleared**: all seven gates are open, and checks 1, 3, 4, 5 and 6 pass. Check 2 gives a warning, which does not change the verdict. |

This is SearchField's first release review.

This review read a clean, detached checkout of exactly the reviewed commit
(`git worktree add --detach`, no local changes), after `npm ci` and
`npm run build:tokens`.

Owner rulings applied: 2026-10-10, SearchField fills its container, draws
the focus ring outside the box, has no pressed state and no clear button,
uses `labelText` as its aria-label, and is a plain input
(`docs/search-field-prop-names.md:31-44`, `:57-60`); 2026-10-16, each input
field has its own doc frame (SearchField 224:2304); the #122, #154 and #158
waivers (`docs/retest-waivers.md:36`, `:40`, `:41`); 2026-10-16, intent-only
commits get no GitHub Commits row (`.claude/skills/registry/SKILL.md`);
2026-10-15, the publish is held until every component is Cleared (noted, not
a finding).

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/SearchField/SearchField.intent.json` exists at the commit and parses as JSON (`node -e "JSON.parse(...)"` prints `parses`). Last changed in `6850f4d` (#158, merge `333163b`). Every `use_when` and `dont_use_when` source cites `Figma 224:2304`. |
| 2 | Development is Completed | **Open** | Components row `recpIb6uO1bFYbzL5` reads `Development = Completed` (Design `Done`, Results Summary `Passed`, 6 of 6 rows, Synchronization 100%). Production Storybook: `https://flex-ds-sigma.vercel.app/?path=/story/components-searchbaritem-searchfield--idle`. Commit: `https://github.com/wah-ag/flex-ds/commit/b17f75b2f1efd7e3a289cb444eda1c9c10119a2d`, an ancestor of the reviewed commit; `git diff --stat b17f75b b1fa345 -- src/components/SearchField src/components/FieldControl` is empty, so the code the board says shipped is the code reviewed. Release Review and Release Verdict are empty. |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0: "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0: "✔ Modes match and every alpha token carries alpha." `git diff --stat origin/main -- tokens/` and `git diff --stat origin/staging -- tokens/` are both empty (`origin/staging` has no commit that is not on `main`). Every remote token branch (`tokens-update`, `tokens-update-staging`, `component/icon-stroke-token`, `revert-64-tokens-update`, `token-runner-agent`) is an ancestor of the reviewed commit. No pull request is open (`gh pr list --state open` returns `[]`). |
| 4 | Public surface decided | **Open** | Public: it has a Components row (`recpIb6uO1bFYbzL5`) and a Figma node (199:102), and nothing under `docs/` declares it internal (`src/index.ts:4-6` names only FieldControl and FieldLabel as internal). `src/index.ts:15-21` exports Avatar, ButtonCTA, CardContainer, IconButton, Label, PasswordField and TextField, not SearchField; under the gate that neither opens nor shuts it. |
| 5 | Names final | **Open** | See *Gate 5* below. |
| 6 | States complete | **Open** | Figma's `state` matrix has 6 values (`docs/search-field-prop-names.md:48-55`); `SearchField.stories.jsx:61-66` has one story for each (`Idle`, `Hover`, `Typing`, `Focus`, `ErrorState`, `Disable`), each pinned to its Figma variant node (`:9-16`). 6 linked Staging Testing rows, one per state (idle, hover, typing, focus, error, disable), all `Passed`, all reading `Tested on staging 2d983b1f3c0b16922715dccf2ca3ab50f07aead7`, an ancestor of the reviewed commit. See *Gate 6* below for what changed since. SearchField has no `size` in Figma (`docs/search-field-prop-names.md:35-37`); the rows' Size reads `null`. |
| 7 | Version meaning known | **Open** | `docs/versioning.md` exists at the commit. SearchField is **New, MINOR**: it has never been exported (`git tag -l 'v*'` is empty, and `src/index.ts` does not export it). `docs/versioning.md:26`: "**New**: first time it is exported. MINOR." The banner at `:3-4` still reads "Draft for the owner's review."; as in earlier reviews, the file is treated as the policy in force because a human merged it in #118. |

### Gate 5

`docs/search-field-prop-names.md:25-29` maps each Figma property to its prop:
`state` (variant, 6 values) → `state`, label text → `labelText`, show
leading → `showLeading`, the Figma properties in camelCase as agreed for
ButtonCTA. The code takes exactly those (`SearchField.jsx:38-44`), and
`state` takes Figma's six values as written (`:36`), the same six the story
control offers (`SearchField.stories.jsx:38`, `Object.keys(NODES)`).
`className` and `...rest` are the input's own HTML attributes passed through
(`docs/search-field-prop-names.md:41-44`).

The file's title still reads "(for review)" (`:1`), but it suggests no
rename: "No name was changed from Figma, so there is nothing else to review
here." (`:62`). `grep -rn -i -E "for review|suggest" docs/` finds no other
open suggestion for SearchField.

### Gate 6

`git diff --stat 2d983b1 b1fa345 -- src/components/SearchField src/components/FieldControl`
(SearchField imports FieldControl, which imports nothing else from
`src/components/`):

- `FieldControl.jsx`: one removed line, `import './FieldControl.css';`, from
  `a91a822`, brought by #122 (merge `d22ee86`), waived at
  `docs/retest-waivers.md:36`. `FieldControl.css` is unchanged.
- `SearchField.intent.json`: added and refreshed by intent-only merges
  (#105 and #108, shipped earlier; #154 and #158, waived at `:40` and `:41`).

`SearchField.jsx` and `SearchField.stories.jsx` are unchanged since
`2d983b1`. So every row's pass covers the code at the reviewed commit, by
test or by recorded waiver.

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

All seven keys are present: `use_when` (4 entries), `dont_use_when` (4),
`variant_intent` (`state`), `placement` (empty), `pairs_with` (empty),
`required_tokens` (empty) and `a11y` (3). Every non-empty entry has a
`source`, and `use_when` is not empty.

### Check 2: Every `dont_use_when` names an alternative (warning)

None of the four entries names another component or variant to use instead.
All four are sourced to
`Figma 224:2304 (Search Field › Don’t, text I224:2304;2406:416;224:2297)`:

- "Don’t clear the query unexpectedly when results update or users return to the field."
- "Don’t make users guess whether they need to press Enter or wait for automatic results."
- "Don’t clear the query unexpectedly when results refresh, the user navigates back, or the field loses focus."
- "Don’t use the search field for unrelated actions, such as filtering a form section or entering a URL, without making that purpose clear."

The first and third say nearly the same thing; both are on the doc frame as
written. This review suggests no alternative.

### Check 3: `a11y` specific, not generic (pass)

Each entry names something checkable, and the code does what it says at the
reviewed commit:

| Entry | Source | The cited line at `b1fa345` |
| --- | --- | --- |
| "Renders no visible label; labelText is the input’s placeholder and its aria-label." | `SearchField.jsx:53` | `aria-label={labelText}`, with `placeholderText={labelText}` on the line above (`:52`), rendered as `placeholder={placeholderText}` at `FieldControl.jsx:113`. FieldControl renders no `<label>` (`FieldControl.jsx:90-159`), and SearchField passes no label. |
| "The field is a native <input>; state=\"disable\" sets disabled." | `FieldControl.jsx:116` | `disabled={isDisabled}`, with `isDisabled = state === 'disable'` at `:81`, on the `<input>` at `:107`. SearchField passes `disable` through (`SearchField.jsx:36`, `:50`). |
| "state=\"error\" sets aria-invalid on the input." | `FieldControl.jsx:117` | `aria-invalid={state === 'error' ? true : undefined}`; SearchField passes `error` through (`SearchField.jsx:36`, `:50`). |

The first entry's source names `:53`, the aria-label half; the placeholder
half is at `:52`. The text is true of the code, and under the owner's
2026-10-15 ruling an off-by-one citation passes this check.

### Check 4: `required_tokens` resolve (pass)

`required_tokens` is empty, and SearchField's own code references no token:
it has no CSS file (`docs/search-field-prop-names.md:15-18`;
`src/styles.css:7` "SearchField has no stylesheet of its own: it is
FieldControl."), and `grep -rn "var(--" src/components/SearchField` finds
nothing. The tokens it renders with are FieldControl's own.

### Check 5: All variants covered (pass)

The code accepts one variant prop, `state`, with six values (`idle`,
`hover`, `typing`, `focus`, `error`, `disable`; `SearchField.jsx:36`; any
other value falls back to `idle` at `:50`). Every value is a key in
`variant_intent.state`, and no key is left over. All six have a `null`
meaning, which counts as covered.

Not variant props: `labelText`, `showLeading` (a boolean Figma property),
and the pass-throughs `className`, `...rest`.

### Check 6: No two components claim the same job (pass)

Every `use_when` entry of the other 19 intent files at the commit was read
against SearchField's four. All four of SearchField's are about a search
query: what the hint says can be searched, keeping the search input easy to
find, keeping the query visible while results are reviewed, and searching as
users type. No other `use_when` mentions search, queries or results.

The closest pair is the hint and placeholder guidance:

| SearchField `use_when` | TextField `use_when` |
| --- | --- |
| "Say what can be searched in the hint, such as ‘Search jobs or companies’." | "Use placeholder text only when an example or format helps users understand the expected input." |
| `Figma 224:2304 (Search Field › Do, text I224:2304;2406:461;224:2301)` | `Figma 71:2194 (Text Field › Do, text I71:2194;2406:461;71:2190)` |

SearchField's entry is about naming the scope of a search; TextField's is
about when a general field should show a placeholder at all. Different
situations.

- TextField's "Use TextField for the text the user needs to read back, such
  as a name or email." names form values, not a search query; no SearchField
  entry claims form values.
- TextField's "Keep input fields consistent in height, spacing, alignment,
  and styling." is about consistency across fields, not about choosing a
  component for a situation, and SearchField's "Keep the search input easy
  to find and accessible within the interface." is about where the search
  sits.
- PasswordField's and TextArea's entries concern secrets and multi-line
  responses; SearchField claims neither.

## Noted for the owner, not a gate or check

**Placeholder as the only label.** TextField's `dont_use_when` reads "Don’t
rely on placeholder text as the only label." (`Figma 71:2194`). SearchField
has no visible label and uses `labelText` as its placeholder and aria-label,
which is your 2026-10-10 ruling (`docs/search-field-prop-names.md:31-33`).
The aria-label gives the input an accessible name, so this is not a check 3
failure, and check 6 compares `use_when` entries only; it is noted because a
reader of the docs site will see both.

**Typing gap.** `SearchField.jsx:38-44` gives `className` no default, the
same pattern as ButtonCTA, Label, TextField and PasswordField. Under your
2026-10-15 ruling this does not block an export; it is to be fixed before
the npm publish, with the others.

**Publish held.** Under your 2026-10-15 ruling, version 0.1.0 is approved
but the publish waits until every component is Cleared.

**prop-names title.** `docs/search-field-prop-names.md:1` still reads
"(for review)" although the file records no open suggestion.

## What each owner is waiting on

No gate is shut and no check fails.

- **Owner** (check 2, warning only, does not block): none of the four
  `dont_use_when` entries names an alternative, and two of them repeat each
  other. "Don’t use the search field for unrelated actions, such as
  filtering a form section or entering a URL, …" is the one where naming
  TextField would help a reader most; that wording is the Designer's, on
  224:2304.
- **Owner** (gate 7, informational): the banner in `docs/versioning.md`
  still calls the file a draft.
- **Owner** (typing, informational): `className` has no default; to be fixed
  before the publish, by your 2026-10-15 ruling.
