# Release review: ButtonCTA at a25043e

| | |
| --- | --- |
| Component | ButtonCTA (`src/components/ButtonCTA/`) |
| Reviewed commit | `a25043e085975e720d10fb68e48af5053a40b130` (`main` HEAD, "Merge pull request #120 from wah-ag/staging") |
| `package.json` version at that commit | `0.1.0` (package `@wah-ag/flex-ds`) |
| Reviewed at | 2026-10-14T16:49:58Z |
| **Verdict** | **Cleared**: all seven gates are open and checks 1, 3, 4, 5 and 6 pass. Check 2 gives a warning, which does not change the verdict. |

This review replaces nothing. The earlier review,
`reports/release-review/ButtonCTA-8a648b6.md`, read Blocked at `8a648b6`
because gate 7 was shut (no `docs/versioning.md`). This is a fresh review at
a new commit.

The review read a clean, detached checkout of exactly this commit (level with
`origin/main`, no local changes), after `npm ci` and `npm run build:tokens`.

Between `8a648b6` and this commit nothing under `src/` changed
(`git diff --stat 8a648b6 HEAD` touches only `.claude/agents/release.md`,
`.claude/skills/registry/SKILL.md`, `.claude/skills/release-review/SKILL.md`,
`docs/versioning.md`, `package.json`, `package-lock.json` and the earlier
report). Every gate and check below was still run again at this commit.

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/ButtonCTA/ButtonCTA.intent.json` exists at the commit and parses as JSON (read with `require()`). |
| 2 | Development is Completed | **Open** | Components row `recxAh3Dd401nLLVr` reads `Development = Completed`. Production Storybook is set: `https://flex-ds-sigma.vercel.app/?path=/story/components-buttoncta--primary-lg-idle`. Staging Testing Results Summary reads only `Passed`. |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0: "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0: "✔ Modes match and every alpha token carries alpha." The reviewed commit is `main` HEAD, so `tokens/` equals `main`. `git diff --stat HEAD origin/tokens-update -- tokens/` (`origin/tokens-update` at `bf5f961`) and `git diff --stat HEAD origin/staging -- tokens/` are both empty: no token sync is waiting to merge. |
| 4 | Public surface decided | **Open** | The component is public: it has a Components row (`recxAh3Dd401nLLVr`) and a Figma node (`16:438`). Nothing under `docs/` declares it internal. `src/index.ts` does not exist at this commit; that does not decide this gate (the export comes only after Cleared). |
| 5 | Names final | **Open** | `docs/button-cta-prop-names.md:3-14` maps every Figma property of node 16:438 to its prop ("as agreed with the owner on 2026-09-30"): `category`, `size`, `state`, `buttonLabel`, `leadingIcon`, `trailingIcon`, `swapIcon`. `ButtonCTA.jsx:11-22` takes exactly these, plus `type`. `docs/button-cta-prop-names.md:16-24` documents `type` as the HTML attribute and records that the earlier `htmlType` clash is gone. No rename suggestion is open. |
| 6 | States complete | **Open** | The Figma matrix is 2 categories × 3 sizes × 6 states = 36 variant nodes (`ButtonCTA.stories.jsx:8-21`). There are 36 story exports (`ButtonCTA.stories.jsx:67-103`), one per cell. There are 36 linked Staging Testing rows; all 36 read `Passed`, and every row's Context reads `Tested on staging 65ff1ac83965620f855b99f42be3682f245beca1`. That commit is an ancestor of the reviewed commit (`git merge-base --is-ancestor`), and the only change under `src/components/ButtonCTA/` since then is the added intent file (`git diff --stat 65ff1ac HEAD -- src/components/ButtonCTA`: `ButtonCTA.intent.json \| 166 +++`). |
| 7 | Version meaning known | **Open** | `docs/versioning.md` exists at the commit (added in `07d714a`, merged into `staging` by a human, `wah-ag`, in #118 at 2026-10-14T16:25:49Z, and shipped to `main` in #120). Classification of ButtonCTA under it: **New, MINOR.** The specific change: ButtonCTA is exported for the first time. The repository has no `v*` tag (`git tag -l 'v*'` is empty) and `src/index.ts` does not exist at the commit, so ButtonCTA has never been exported. `docs/versioning.md`, *Classifying a component in a release*: "**New**: first time it is exported. MINOR." and *What each part means*: "A new component exported from `src/index.ts`." is a MINOR example. |

### Gate 7: the banner in `docs/versioning.md`

Lines 3-4 of `docs/versioning.md` still read: "**Draft for the owner's
review.** Release-review gate 7 reads this file. It counts only once a human
has merged it."

The banner sets its own condition: the file counts once a human has merged
it. That condition is met. `gh pr view 118` reports it merged into `staging`
by `wah-ag` (`is_bot: false`), and it reached `main` in #120, also merged by
`wah-ag`. This review therefore reads the file as the policy in force and
opens gate 7 on it. The banner text itself is now out of date; that is a
wording matter for the owner and is not a finding against ButtonCTA. If the
owner did not mean the merge of #118 as approval of the policy, gate 7 should
be read as shut and this verdict as Blocked.

One point the policy does not state, recorded so that nobody fills it in:
the package is at `0.1.0` with no `v*` tag. The file says a new component is
a MINOR change, but it does not say whether the first publish is `0.1.0`
itself or a bump from it. That choice is DevOps's version proposal and the
owner's approval. It does not affect ButtonCTA's class.

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

All seven keys are present: `use_when` (6 entries), `dont_use_when` (8),
`variant_intent` (category, size, state), `placement` (1), `pairs_with` (4),
`required_tokens` (37), `a11y` (3). Every non-empty entry has a `source`, and
`use_when` is not empty.

### Check 2: Every `dont_use_when` names an alternative (warning)

None of the eight entries says what to use instead, either as a component
(by folder name) or as a variant. All eight come from
`Figma 17:826 (Buttons Doc Frame › Don’t, text I17:826;2406:416;17:819)`:

1. "Don’t use multiple Primary buttons together when one clear primary action is sufficient."
2. "Don’t use a Primary button for secondary or less important actions." Here "secondary" describes the kind of action. It does not tell the reader to use a variant instead.
3. "Don’t use Secondary buttons when the action is the main focus of the screen."
4. "Don’t mix different button sizes within the same action group without a clear purpose."
5. "Don’t use buttons for navigation when a link is more appropriate." "a link" does not name a component folder.
6. "Don’t use overly long button labels that make the button difficult to scan or fit within the layout."
7. "Don’t use button styles inconsistently across similar actions or screens."
8. "Don’t remove or alter the button’s required interaction states, such as hover, pressed, focus, or disabled."

This review suggests no alternatives.

### Check 3: `a11y` specific, not generic (pass)

Each entry names something checkable, and the code at the commit does what
the entry says:

- "Renders a native <button>, with type=\"button\" by default." (`src/components/ButtonCTA/ButtonCTA.jsx:26`). Confirmed: `<button` at line 26, `type = 'button'` default at line 19, applied at line 28.
- "state=\"disable\" sets the native disabled attribute." (`src/components/ButtonCTA/ButtonCTA.jsx:34`). Confirmed: `disabled={state === 'disable'}`.
- "The icons are aria-hidden=\"true\" and focusable=\"false\"; the visible text is buttonLabel." (`src/components/ButtonCTA/ButtonCTA.jsx:23`). Confirmed: line 23, with `buttonLabel` rendered at line 37.

### Check 4: `required_tokens` resolve (pass)

- The `var(--…)` references in `ButtonCTA.css` and `ButtonCTA.jsx` give 37 unique tokens, and `required_tokens` lists 37. The two sets are identical: no token is used without being listed, and none is listed without being used.
- All 37 are defined in `build/css/*.css` at the commit.

### Check 5: All variants covered (pass)

The code accepts three variant props: `category` (`primary`, `secondary`),
`size` (`lg`, `md`, `sm`) and `state` (`idle`, `hover`, `press`, `focus`,
`disable`, `error`), from `ButtonCTA.jsx:12-14,29,32-34` and the CSS classes
in `ButtonCTA.css`. Every value is a key in `variant_intent`.

These meanings are `null` (covered, with no Figma text):
`size.lg`, `size.md`, `size.sm`, `state.idle`, `state.hover`, `state.press`,
`state.focus`, `state.disable`, `state.error`.

Not counted as variant props: `buttonLabel` (Figma text property),
`leadingIcon` and `trailingIcon` (Figma booleans), `swapIcon` (Figma instance
swap) and `type` (HTML attribute, `docs/button-cta-prop-names.md:16`).

### Check 6: No two components claim the same job (pass)

Every `use_when` in every intent file at the commit was compared with
ButtonCTA's six. ButtonCTA's entries are all guidance on how to use a button
(labels, size, style consistency, variant choice, interaction states,
spacing). None describes a situation that another component's `use_when`
also claims.

The nearest entries are set out so the judgement can be checked:

- ButtonCTA: "Use the appropriate size based on the context and layout." (`Figma 17:826 (Buttons Doc Frame › Do, text I17:826;2406:461;17:822)`)
- Avatar: "Use the appropriate size based on the context and layout." (`Figma 69:2101 (Avatar Doc Frame › Do, text I69:2101;2406:461;69:2097)`)

Identical wording, but each is about choosing a size within its own
component's scale; neither is a situation in which a reader would pick one
component over the other.

- IconButton: "it serves as icon button and use in header, back office table row actions" (`Figma 45:324 (IconButton component description, paragraph 1)`)
- ShotAction: "it can be used as toggle button on job listings card for actions like favorite, saved" (`Figma 31:191 (ShotAction component description, paragraph 1)`)
- BtnGroup: "button group for user action, save toggle button and share button is for external link sharing" (`Figma 32:573 (CardContent/BtnGroup component description, paragraph 1)`)

These name specific situations (icon-only actions, a toggle, a card's action
group). No ButtonCTA `use_when` entry names any of those situations, so there
is no pair that claims the same job. Not a finding.

## What each owner is waiting on

- **Owner** (check 2, warning only, does not block; the routing table names no owner for it): none of ButtonCTA's eight `dont_use_when` entries in Figma 17:826 names an alternative. They are listed above.
- **Owner** (gate 7, open, for information): the banner at the top of `docs/versioning.md` still calls the file a draft, though its own condition (a human merge) is met. This review read the merge of #118 as the policy being in force; see *Gate 7: the banner*.
- No shut gate and no failed blocker check. Next, after this report is merged: the Developer exports ButtonCTA from `src/index.ts`.
