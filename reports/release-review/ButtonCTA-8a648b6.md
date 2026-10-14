# Release review: ButtonCTA at 8a648b6

| | |
| --- | --- |
| Component | ButtonCTA (`src/components/ButtonCTA/`) |
| Reviewed commit | `8a648b67c1dd43391b933e15749787303c940b53` (`main` HEAD, "Merge pull request #116 from wah-ag/staging") |
| `package.json` version at that commit | `1.0.0` |
| Reviewed at | 2026-10-14T16:16:26Z |
| **Verdict** | **Blocked**: gate 7 is shut. Every other gate is open and checks 1, 3, 4, 5 and 6 pass. Check 2 gives a warning. |

The review read a clean checkout of exactly this commit (level with
`origin/main`, no local changes), after `npm ci` and `npm run build:tokens`.

## Gates

| # | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Intent written | **Open** | `src/components/ButtonCTA/ButtonCTA.intent.json` exists at the commit and parses as JSON (it was read with `require()`). |
| 2 | Development is Completed | **Open** | Components row `recxAh3Dd401nLLVr` reads `Development = Completed`. Production Storybook is set: `https://flex-ds-sigma.vercel.app/?path=/story/components-buttoncta--primary-lg-idle`. |
| 3 | Tokens clean | **Open** | `npm run build:tokens` exits 0: "✔ Tokens built → build/css, build/ios, build/android". `npm run check:tokens` exits 0: "✔ Modes match and every alpha token carries alpha." The reviewed commit is `main` HEAD, so `tokens/` equals `main`. `git diff --stat HEAD origin/tokens-update -- tokens/` and `git diff --stat HEAD origin/staging -- tokens/` are both empty, so no token sync is waiting to merge. |
| 4 | Public surface decided | **Open** | The component is public: it has a Components row (`recxAh3Dd401nLLVr`) and a Figma node (`16:438`). Nothing under `docs/` declares it internal. `src/index.ts` does not exist at this commit. That does not decide this gate (the export comes only after Cleared). |
| 5 | Names final | **Open** | `docs/button-cta-prop-names.md:3-14` maps every Figma property of node 16:438 to its prop ("as agreed with the owner on 2026-09-30"): `category`, `size`, `state`, `buttonLabel`, `leadingIcon`, `trailingIcon`, `swapIcon`. `ButtonCTA.jsx:11-22` takes exactly these, plus `type`. `docs/button-cta-prop-names.md:16-24` documents `type` as the HTML attribute and records that the earlier `htmlType` clash is gone. No rename suggestion is open. |
| 6 | States complete | **Open** | The Figma matrix is 2 categories × 3 sizes × 6 states = 36 variant nodes (`ButtonCTA.stories.jsx:8-21`). There are 36 stories (`ButtonCTA.stories.jsx:67-103`), one per cell. There are 36 linked Staging Testing rows and all 36 read `Passed`. Every row's Context reads `Tested on staging 65ff1ac83965620f855b99f42be3682f245beca1`. That commit is an ancestor of the reviewed commit. Since then, the only change under `src/components/ButtonCTA/` is the added intent file (`git diff --stat 65ff1ac… HEAD -- src/components/ButtonCTA`: `ButtonCTA.intent.json | 166 +++`). |
| 7 | Version meaning known | **Shut** | `docs/versioning.md` does not exist at the commit (`ls docs/versioning.md`: "No such file or directory"), and the repository has no `v*` tag (`git tag -l 'v*'` is empty). Without a policy, ButtonCTA cannot be classified as new, breaking, changed or unchanged. No scheme is assumed. |

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

- "Renders a native <button>, with type=\"button\" by default.": `src/components/ButtonCTA/ButtonCTA.jsx:26`. Confirmed: `<button` at line 26, `type = 'button'` default at line 19, applied at line 28.
- "state=\"disable\" sets the native disabled attribute.": `src/components/ButtonCTA/ButtonCTA.jsx:34`. Confirmed: `disabled={state === 'disable'}`.
- "The icons are aria-hidden=\"true\" and focusable=\"false\"; the visible text is buttonLabel.": `src/components/ButtonCTA/ButtonCTA.jsx:23`. Confirmed: line 23, with `buttonLabel` rendered at line 37.

### Check 4: `required_tokens` resolve (pass)

- The `var(--…)` references in `ButtonCTA.css` and `ButtonCTA.jsx` give 37 unique tokens, and `required_tokens` lists 37. The two sets are identical: no token is used without being listed, and none is listed without being used.
- All 37 are defined in `build/css/*.css` at the commit.

### Check 5: All variants covered (pass)

The code accepts three variant props: `category` (`primary`, `secondary`),
`size` (`lg`, `md`, `sm`) and `state` (`idle`, `hover`, `press`, `focus`,
`disable`, `error`). These come from `ButtonCTA.jsx:12-14,29,33-34`, the CSS
classes in `ButtonCTA.css` and the story `argTypes` at `ButtonCTA.stories.jsx:38-40`.
Every value is a key in `variant_intent`.

These meanings are `null` (covered, with no Figma text):
`size.lg`, `size.md`, `size.sm`, `state.idle`, `state.hover`, `state.press`,
`state.focus`, `state.disable`, `state.error`.

Not counted as variant props: `buttonLabel` (Figma text property),
`leadingIcon` and `trailingIcon` (Figma booleans), `swapIcon` (Figma instance
swap) and `type` (HTML attribute, `docs/button-cta-prop-names.md:16`).

### Check 6: No two components claim the same job (pass)

Every `use_when` in every intent file at the commit was compared with
ButtonCTA's. FieldControl and FieldLabel have none, because they are code-only.
No other component's `use_when` describes a situation ButtonCTA's `use_when`
claims.

One pair has identical wording. It is set out here so the judgement can be
checked:

- ButtonCTA: "Use the appropriate size based on the context and layout." (`Figma 17:826 (Buttons Doc Frame › Do, text I17:826;2406:461;17:822)`)
- Avatar: "Use the appropriate size based on the context and layout." (`Figma 69:2101 (Avatar Doc Frame › Do, text I69:2101;2406:461;69:2097)`)

Both entries are guidance on choosing a size within each component's own
scale. Neither describes a situation in which a reader would pick one
component instead of the other, so this is not two components claiming one
job and it is not a finding. The same applies to ButtonCTA "Provide clear
interaction states, including hover, pressed, focus, and disabled." next to
TextField/PasswordField "Use the appropriate focus, error, disabled, and
filled states." (`Figma 71:2194`).

## What each owner is waiting on

- **Owner** (gate 7): `docs/versioning.md` must exist at the commit to be released, with ButtonCTA classified under it. With no policy and no `v*` tag, ButtonCTA cannot be classified as new, breaking, changed or unchanged.
- **Owner** (check 2, warning only, does not block; no routing owner is named for it): none of ButtonCTA's eight `dont_use_when` entries in Figma 17:826 names an alternative. They are listed above.
