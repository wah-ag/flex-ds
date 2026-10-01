---
name: sweep
description: The flex-ds registry audit — read every row, recompute every status from its evidence, open every link, hunt contradictions, and write the sweep report in a fixed order. Used by PM on its scheduled sweep. The checklist grows each time a new kind of contradiction is found.
---

# sweep

## 1. Read everything

- Read the registry skill first. It gives the owners, the formula and the
  known flags.
- Read Components, Staging Testing and GitHub Commits to the last page,
  with no view and no filter. Record the row count of each table.
- Read the previous `reports/registry-sweep.md` before you overwrite it.
- List `src/components/` in the working tree.

## 2. Reconcile each status with its evidence

For every Components row, recompute the status from the registry skill's
precedence table, using the row's own evidence (Staging Testing Results
Summary, Astro Link, Release Review, Release Verdict, Production Storybook,
Staging Storybook, Figma, Design). Compare it with `Development`. A
difference is a contradiction. Report it against the evidence column that
explains it, never as "change the status".

## 3. Open every link

Open each Figma, Staging Storybook, Production Storybook, Commit and GitHub
Commits → Commit URL value. Opening means loading it and seeing what came
back, not counting it. For Storybook, "opens" means the component's own
story renders, not just a 200. Record what came back for every dead link.

## 4. Hunt contradictions

Each item names the column to report and its owner.

| Contradiction | Report against | Owner |
| --- | --- | --- |
| `Development` differs from the recomputed status | The evidence column that explains it | Its owner |
| Synchronization % differs from the share of rows reading `Passed` (registry flag 5) | Staging Passed Count | Nobody (computed). Addressed to you, as a base-configuration finding. |
| A Staging Testing row with Composed In empty | Composed In | QA |
| A row with blank Testing Results on a component past Ready for Testing, still blank when you re-read that component's rows at the end of the sweep | Testing Results | QA |
| To be deployed or Completed, but Composes lists a component not Completed | Composes / the composed component's evidence | Developer / owner of that evidence |
| Production Storybook set with no Commit | Commit | DevOps |
| Staging Storybook set with no GitHub Commits row, or a commit touching the component's folder on `staging` with no row | GitHub Commits | Developer |
| A GitHub Commits row linked to no component | GitHub Commits (on Components) | Developer |
| A folder in `src/components/` with no row | — | Designer (rows are created with the Figma link) |
| A row past To-do with no folder in `src/components/` | Staging Storybook | Developer |
| Development past To-do while Design is not `Done` | Design | Designer |
| A value in Astro Link, Release Review or Release Verdict | That column | Unassigned — addressed to you |
| A column in the base that the registry skill does not list | That column | Addressed to you |

QA leaves Testing Results blank on new rows while it writes a round (`test`
skill, step 8). A blank seen once may be a write in progress. It is a finding
only if it is still blank on the re-read.

When you find a contradiction this table does not cover, report it, then
propose adding a row here in the report's closing lines.

## 5. Write the report

Overwrite `reports/registry-sweep.md`, in this order:

1. **What changed since the last sweep**: new, resolved and still-open
   findings, compared with the previous report.
2. **Status counts**: each status, with the component rows behind it.
3. **What each owner is waiting on**: Designer, Developer, QA, DevOps, you.
4. **Contradictions**: row, column, owner, and the evidence behind it.
5. **Dead links**: URL, row, column, owner, and what opening it returned.

Head it with the sweep time (UTC) and each table's row count.
