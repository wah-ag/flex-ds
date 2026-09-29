---
name: finding-format
description: What a flex-ds test finding must contain — the contract between QA, who writes it into a Staging Testing row, and the Developer, who repairs from it. Use when writing Expected Results or Suggestion for Improvement, and when reading a Failed row before a fix.
---

# finding-format

A finding is what QA hands the Developer. It must be actionable without a
follow-up question, because there is no one to ask: the two agents meet only
in the registry.

## Where each part goes

A finding lives in one Staging Testing row. The case is already in the row's
own columns; the finding fills the other two.

| Part | Column | Required |
| --- | --- | --- |
| **Case**: what was tested | Component/Sub Component, Variants, Size, State, Context | Always. Context names the theme mode (`on-light` / `on-dark`), the scale mode (`web` / `back-office`) and the viewport width. |
| **Expected**, and where that comes from | Expected Results | Always, on passes as well as failures. |
| **Seen** | Suggestion for Improvement | On a Failed row. |
| **Where** it lives in the code | Suggestion for Improvement | On a Failed row. |
| **Fix**: which token or prop would make it match | Suggestion for Improvement | On a Failed row. |

## The rules

- **Name the token or the prop, never a raw value.** "The colour looks off" is
  not a finding, and neither is "#1D4ED8 should be #2563EB". Write
  `--text-interactive-brand-idle`, not the hex it resolves to. A raw value may
  appear only as evidence *beside* the names, for example when the code uses
  a raw value and no token at all.
- **Expected comes from Figma, with its source.** Give the Figma node ID or
  link and the property (the fill, the variable, the component property). An
  expectation from the story file or the code is not an expectation.
- **Seen comes from the rendered component,** as read from computed styles in
  the browser, together with the token the code references.
- **Where** is a file path and line, or a prop name. If QA cannot find it in
  the code, say so. Do not guess a line.
- **Fix names the change, not the patch.** Say which token or prop value would
  make it match. Do not write code: QA does not repair.
- **One finding per row.** Two problems in one case are two sentences in the
  Suggestion, each with its own seen, where and fix.
- **Name design gaps as design gaps.** If Figma binds no variable, or the
  token Figma uses does not exist in `build/css/`, say "design gap — report to
  the Designer". The Developer cannot fix it in code.

## A good finding

> **Expected Results:** Label colour `text-interactive-brand-idle` (Figma:
> ButtonCTA › Label, fill variable, node 12:345). Padding
> `spacing-padding-md` left and right.
>
> **Suggestion for Improvement:** Seen: the label computes to the value of
> `--text-neutral-primary`. Where:
> `src/components/ButtonCTA/ButtonCTA.css:14`, `color:
> var(--text-neutral-primary)`. Fix: use `--text-interactive-brand-idle`.
> Padding matches.

The Developer can act on it without asking anything. The expectation cites
Figma, the observation names a token, the location is exact, and the fix is
one named token.

## A bad finding

> **Suggestion for Improvement:** Text colour is wrong on the primary button,
> should be darker blue like in the design (#2563EB). Also spacing looks a bit
> off.

It fails every rule. "Wrong" and "a bit off" are judgements, not
observations. The hex names no token, so the Developer has to reverse-look-up
which of several tokens resolves to it, in which mode. No Figma source is
given, so the expectation cannot be checked. No file or line is named. And
two problems share one sentence, one of them with no expected value at all.

## Reading a finding (Developer)

- Repair from the finding, then mark the row `Fixed (To re-test)`.
- If a finding is not actionable (missing where, a raw value with no token,
  no Figma source), do not guess. Leave the row `Failed` and name it in your
  report. You cannot rewrite the finding: the Suggestion column is QA's.
- A design gap is not yours to close. Leave the row `Failed` and report it.

## Never

- Never write a finding that needs a follow-up question to act on.
- Never judge by eye: "looks", "seems", "a bit" are not findings.
- Never derive Expected from the story file or the code.
- Never write a code patch into a Suggestion.
- Never leave Expected Results empty on a passing row. A pass needs an
  expectation too, or it proves nothing.
