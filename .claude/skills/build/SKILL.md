---
name: build
description: Turning one Figma component node into one flex-ds component, in ordered stages, each with a check that must be green before the next — matrix, tokens, implement, verify, register. Used by the Developer on a build (To-do) and a repair round (To be fixed).
---

# build

Ordered stages. Each ends with a check. A red check means you stop at that
stage; you never carry a red check forward to fix "later".

## Stage 0 — The ground

Before anything, confirm the stack exists:

- a component framework and Storybook in `package.json`;
- `lucide-<framework>` installed;
- the platform entry points `CLAUDE.md` names (`build/css/index.css`,
  `index-mobile.css`, `index-back-office.css`);
- `stories/lib/tokens.js`;
- the `staging` branch on `origin`.

**Check:** each one exists. As of 2026-09-29 none of them does. `npm run
build:tokens` writes `tokens.css`, `tokens-dark.css` and
`tokens-back-office.css`, not the entry points `CLAUDE.md` names. Adding a
framework or dependency needs a human (`tools.md`), and picking a CSS file to
import instead of the named entry point is a decision, not a build step. If
anything is missing, report it and stop.

## Stage 1 — Read the design, write down the matrix

- Read the Figma node from the row's Figma link: its component properties,
  variants, sizes, states and every bound variable.
- Write down the full matrix: every variant × size × state the product uses,
  including default, hovered, pressed, focused, disabled and destructive.
- Write down every subcomponent. If a part is (or could be) used elsewhere,
  it becomes its own folder in `src/components/`, and it goes in Composes.

**Check:** every property name is recorded exactly as Figma spells it, and
every cell of the matrix has an entry. An empty cell is a question for the
Designer, not a guess.

## Stage 2 — Resolve every value to a semantic token

- For each bound variable, find the semantic token in `build/css/*.css`.
  Take names from the build output, never from memory or from examples in
  `CLAUDE.md`. The built semantic names read `--text-interactive-brand-idle`,
  `--background-neutral-surface`, `--spacing-padding-md`,
  `--size-icon-md`.
- Use semantic tokens only. A core primitive (`--color-navy-500`) is wrong.
- A property Figma leaves unbound is a **design gap**. Report it; do not
  choose a value. A variable Figma binds that has no token in the build is a
  **token gap**. Report it; do not invent the token.
- A token present in one mode and missing in another is a design gap.
  `npm run check:tokens` reports these.

**Check:** every value in the matrix maps to an existing semantic token, or
is on the gap list. If the gap list is non-empty, stop and report it. Do not
build around a gap.

## Stage 3 — Implement

- One folder per component, PascalCase, in `src/components/`. Props named
  exactly as Figma names them. If a name must change because it conflicts
  with a tool, write up the suggested name under `docs/`; do not rename it
  silently.
- Real behaviour for every state: hover, press and focus come from real
  interaction, disabled really disables, and loading really blocks. A class
  that only changes colour is not a state.
- Dark mode comes from `[data-theme="dark"]` on an ancestor through the
  cascade. Never branch on theme in JavaScript.
- Icons are imported by name from Lucide, sized with `--size-icon-*` and
  coloured with `currentColor`. Fonts load from the Google Fonts CDN.
- Import composed components; never copy their styles.
- Stories: one per cell of the matrix, with the Figma node URL at the top.
  Content comes from the build output, never a hand-typed list of token names.

**Check:** a search of the component finds no raw hex, `px`, `rgb(`, font
family or core primitive. Every prop name matches Figma.

## Stage 4 — Verify locally

- `npm run build:tokens` passes.
- Storybook builds, and every story renders with a clean console.
- Every state clicks through with real input, including disabled and
  loading.
- Compare each story against the Figma node yourself. This is a self-check
  only: it never counts as QA, and it is never written anywhere as a result.
- `node scripts/security-check.mjs storybook-static build` passes (see the
  `security-check` skill).

**Check:** all of the above are green, 100%. Nothing merges while any one is
red.

## Stage 5 — Register

1. Commit on `component/<name>` and push it.
2. Merge it into `staging`. Vercel deploys `staging`.
3. Wait for the deployment. Open the component's own story on the staging
   Storybook and watch it render, with a clean console. Run
   `node scripts/security-check.mjs --live <that URL> --expect protected`.
   Staging is protected: an anonymous request must be refused.
4. Write the registry, in the order the developer agent file gives. On a
   build, Composes goes first and Staging Storybook last. On a fix, the new
   Staging Storybook link goes first, then `Fixed (To re-test)` on each row
   repaired.

**Check:** the URL written is the one you opened, it points at the
component's own story (not the Storybook root, not localhost), and it
rendered.

## On a repair round

Start at Stage 1 with the Failed rows' findings (`finding-format` skill)
beside the matrix. Repair only what a finding names, plus anything the repair
itself breaks. Run Stages 2 to 5 in full: a one-line fix goes through the
same gates as a build.
