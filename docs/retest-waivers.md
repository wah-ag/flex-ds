# Retest waivers

The re-ship gate (`.claude/agents/devops.md`, and *Re-shipping a Completed
component* in the registry skill) requires every changed component's Staging
Testing rows to have passed on a `staging` commit that contains the merge
that brought its newest code. A waiver tells DevOps that one merge does not
need that retest.

A waiver is the owner's decision and is written here only by the owner, or for
the owner in a pull request the owner reviews. It counts only once a human has
merged it into `staging`. A waiver an agent writes or relays on its own is not
a waiver.

## How DevOps applies a waiver

For each component, DevOps finds the newest merge that touches the component's
folder, or a code-only subcomponent it imports. If that merge is listed below,
DevOps skips it and takes the next newest merge that touches the folder, is
still waiting to ship (in `origin/main..origin/staging`) and is not listed. The
tested commit must contain *that* merge. If no such merge is left, the
component's code on `main` is the baseline, and every row only needs to read
`Passed`. Everything else in the
gate is unchanged:

- every linked Staging Testing row reads `Passed`;
- a row that reads `Failed`, `Fixed (To re-test)` or blank still blocks;
- every row names its tested commit, and that commit is on `origin/staging`.

A waiver covers exactly the merge commit it names. It never covers a later
merge, even one with the same kind of change.

## Waivers

| Merge commit | PR | Components | What changed | Why no retest | Owner decision |
| --- | --- | --- | --- | --- | --- |
| `d22ee86` | #122 | Every component folder under `src/components/` (21, including the code-only FieldControl and FieldLabel) | Each `.jsx` drops its own `import './X.css'`. All component stylesheets now load from one `src/styles.css`, in import-graph order. | All components had already passed QA. The stylesheets themselves are unchanged; only where they load from moved. | 2026-10-14: "I don't want to retest because all the components passed QA and no need to retest again. I prefer to change the rule for this stage" |
| `ec348a9` | #134 | CardContainer | `CardContainer.intent.json` only: the a11y source citation moves from `CardContainer.jsx:28` to `CardContainer.jsx:31-34` after the #131 `cardSlot` rename. No component code, style or story changed. | Nothing QA tests changed. The three rows (idle, hover, active) passed on `6a0f5dd`, the merge that brought the newest component code. | 2026-10-15: "Yes, waive ec348a9 (#134): the intent JSON changed only; QA's 6a0f5dd passes stand. Open the waiver PR, then ship." |
| `63e5be4` | #140 | Label | `Label.intent.json` only: adds `variant_intent.category.normal` (`null`, as Figma states no per-category intent), the four `normal`-category tokens (`--background-neutral-disable`, `--background-neutral-surface`, `--icon-neutral-primary`, `--text-neutral-primary`) to `required_tokens`, and moves the a11y citations from `Label.jsx:25`/`:33` to `:26`/`:34`. No component code, style or story changed. | Nothing QA tests changed. All 36 rows passed on `2833e7f`, the #109 merge that brought the newest component code (the later #122 move is waived above). | 2026-10-15: "Waive 63e5be4" (answering: waive #140's intent-only merge the way ec348a9 was waived for CardContainer) |
| `01fdf2e` | #150 | TextField | `TextField.intent.json` only: `use_when` and `dont_use_when` re-transposed from TextField's own doc frame (Figma 71:2194) instead of the shared Input Field Doc Frame, and the a11y citations move (`TextField.jsx:53` → `:55`, `:65` → `:68`, and `FieldControl.jsx:117`/`:118`/`:143` → `:116`/`:117`/`:142`). No component code, style or story changed. | Nothing QA tests changed. The 12 rows passed on `43e9946` and the two hover rows passed on `f1cb5c6`, the #111 merge that brought the newest component code (the later #122 move is waived above). | 2026-10-16: "Waive 01fdf2e (#150): the TextField intent JSON changed only; QA's passes on 43e9946 and f1cb5c6 stand. Open the waiver PR, then ship." |
