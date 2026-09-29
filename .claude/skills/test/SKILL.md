---
name: test
description: Testing a built flex-ds component on the staging Storybook against its Figma node — the matrix from Figma, the measurement techniques that are easy to get wrong (fonts, computed values, real input, theme mode), the pass bar, and the registry write order. Used by QA.
---

# test

Expectations come from the Figma node. Never from the story file and never
from the code. A component compared against its own code agrees with itself
by construction, and proves nothing.

## 1. Gate

- The component's Staging Storybook is set. Open it. If there is no link or
  it does not open, stop and say you are waiting. Do not test locally.
- Note which statuses you were started by: Ready for Testing, Fixed, Fixing,
  or the token re-test cron. That decides the scope (step 7).

## 2. Build the expected matrix from Figma

- Read the node: component properties, variants, sizes, states, and every
  bound variable.
- One case per component or subcomponent × variant × size × state. Include
  every state the product uses: default, hovered, pressed, focused,
  disabled, destructive, loading.
- For each case, write the expected value of every property as a token or
  prop name, with the Figma node and property it came from.

## 3. Confirm the fonts loaded — by measurement

Never trust `document.fonts.check()` or `document.fonts.status`. They can
report success for a font that is not rendering.

- In the story's page, measure one string (for example
  `"Hamburgefonstiv 0123"`) in the declared family, e.g. `'DM Sans'` or
  `Sora`, and again in a deliberately bogus family such as
  `'NoSuchFont-QA', monospace`.
- Same width means the declared font is not rendering: every width you
  would report is wrong. Stop and record it as the finding. Do not report
  sizes.
- Do this before you record any size, width or line-height.

## 4. Confirm the theme mode on both sides

Before calling a colour wrong, confirm which mode each side answers in:
Figma's `on-light` or `on-dark`, and the story's `data-theme` on its
ancestor. A light expectation compared with a dark render is not a finding.

## 5. Drive and read each case

- Drive states with real input: hover the pointer, press and hold, tab to
  focus, press keys. Never infer a state from a class name or a prop in the
  code.
- Read values from the browser's computed styles (`getComputedStyle`), not
  by eye. For each value, find which token the component references, and
  compare token to token.
- Check the `CLAUDE.md` rules on the source: semantic tokens only, every
  state present, Lucide icons only, no pasted SVG.
- Take a screenshot of each case for Attachment.

## 6. Pass bar

A case passes only if all three hold:

1. the Storybook property values match the Figma property values;
2. the visual is pixel-identical to Figma;
3. the `CLAUDE.md` rules hold.

Anything else is `Failed`, with a finding in the `finding-format` shape. If
the only difference is font rasterisation, it still fails, with that named.
Pipeline spec open item 10 is where that bar gets revisited; you do not
revisit it here.

## 7. Scope of a retest

| Started by | Scope |
| --- | --- |
| Ready for Testing | The full matrix. |
| Fixing | The rows marked `Fixed (To re-test)`. |
| Fixed | The full matrix, because a fix can break a case that passed. |
| Token re-test cron | The full matrix of each Completed component it names. |

A retest overwrites the existing row for the case. Never add a second row for
the same case.

## 8. Write to the registry

The order matters, because every write recomputes the status and starts the
next agent.

1. Create or update every case's row, with the case columns, Composed In,
   Expected Results, Attachment and Suggestion for Improvement filled in.
   Leave Testing Results blank on new rows.
2. Then write Testing Results for all rows in as few calls as the API allows
   (10 records per call), `Passed` before `Failed`.
3. Size and State take existing options only. `pressed`, `destructive` and
   `default` go in Variants.

## 9. Report

The full matrix with passes and failures, the font measurement, the theme
mode, and anything you could not test and why.
