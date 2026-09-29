---
name: registry
description: The Flex-DS Airtable registry — every table, every column, and who owns each column. Use before reading or writing any Airtable record for flex-ds, and whenever you need to know a component's status or which agent acts next. Defines the Development formula's precedence and forbids writing it.
---

# registry

The Airtable base **Flex-DS** is the registry. It holds the evidence for each
component — links, test results, commits — and derives the component's status
from that evidence. Agents write evidence. Nobody writes status.

## Where the IDs live

Base and table IDs are in `.claude/registry.local.json` (gitignored). Read it
before any Airtable call and use the IDs it gives you. If it is missing, copy
`.claude/registry.local.json.example`, ask a human for the real IDs, and stop
until you have them. Never guess an ID and never hard-code one in a file.

Address columns by the exact names below. A column not listed here is not part
of the registry — report it rather than writing to it.

## Ownership rules

- Each column has exactly one owner. Write only the columns you own.
- **Computed** columns (formula, rollup, count, last-modified, and the reverse
  side of a link) are written by nobody. Change the evidence underneath them.
- **Human** columns are written by a person. No agent writes them, and no
  agent nudges them along.
- **Unassigned** columns belong to work that is out of scope for now
  (documentation, release review, PM, feedback intake). No agent writes them.
- Writing one side of a linked-record pair also changes the other side. The
  owner of the pair writes from the side marked as theirs; the reverse side is
  listed as computed.
- A retest overwrites the existing Staging Testing row. No history is kept.

## Components

One row per component.

| Column | Type | Owner | What it records |
| --- | --- | --- | --- |
| Components | text (primary) | Designer (human) | The component's name. The row is created when the Designer records the Figma link. |
| Category | single select: ATOMS, MOLECULES, ORGANISMS, TEMPLATES, UI | Designer (human) | Atomic-design level. |
| Figma | URL | Designer (human) | The Figma component node link. |
| Design | single select: To-do, In progress, In testing, Done, To be fixed | Designer (human) | Design sign-off. A blank row means the design is not signed off. |
| Staging Storybook | URL | Developer | The component's own story on the staging Storybook. Replaced with a new link after each fix. |
| Composes | link → Components | Developer | The components this one imports. |
| Composed Into | link → Components | Computed | Reverse of Composes. |
| [Staging] Test Records | link → Staging Testing | Computed | Reverse of Staging Testing → Composed In. |
| Production Storybook | URL | DevOps | The component's own story on the production Storybook. |
| Commit | URL | DevOps | The commit that shipped the component to `main`. |
| GitHub Commits | link → GitHub Commits | DevOps | The commit records for this component. |
| Astro Link | URL | Unassigned | Documentation site link. Out of scope. |
| Release Review | URL | Unassigned | Release-review report. Out of scope. |
| Release Verdict | single select: Cleared, Blocked | Unassigned | Release-review verdict. Out of scope. |
| Development | formula | Computed | The component's status. See below. **No agent may write it.** |
| Staging Testing Results Summary | rollup of Testing Results | Computed | Every Testing Results value for the component, joined. The formula reads this. |
| Total Staging Tests | count | Computed | Number of linked Staging Testing rows. |
| Staging Passed Count | count | Computed | See the flags below. |
| Staging Passed Tests | rollup of Testing Results | Computed | See the flags below. |
| Synchronization % | formula | Computed | `Staging Passed Count ÷ Total Staging Tests`, as a percentage; `0%` when there are no tests. |
| Last Modified | last modified time | Computed | When the row last changed. |

## Staging Testing

One row per component or subcomponent × variant × size × state. QA owns this
table.

| Column | Type | Owner | What it records |
| --- | --- | --- | --- |
| Component/Sub Component | text (primary) | QA | What is under test. |
| Composed In | link → Components | QA | The component this row tests. Its reverse is Components → [Staging] Test Records. |
| Variants | long text | QA | The variant tested. States the State column cannot record (`pressed`, `destructive`, `default`) are written here. |
| Size | multiple select: xs, sm, md, lg, xl, comfort, compact, null | QA | Size tested. |
| State | multiple select: draft, pending, upcoming, completed, rejected, cancelled, hovered, idle, focus, selected, isCurrent, error, disabled, loading, filled | QA | State tested. |
| Context | text | QA | Test context. |
| Attachment | attachments | QA | Screenshot evidence. |
| Expected Results | long text | QA | What Figma specifies. |
| Suggestion for Improvement | long text | QA | What is wrong and what would fix it. |
| Testing Results | single select: Passed, Failed, Fixed (To re-test) | QA | QA writes `Passed` or `Failed`. **One exception:** the Developer may change `Failed` to `Fixed (To re-test)` after fixing it, and may make no other change to this column. QA never writes `Fixed (To re-test)`. |

## GitHub Commits

One row per commit that ships a component. DevOps owns this table.

| Column | Type | Owner |
| --- | --- | --- |
| Commit Hash | text (primary) | DevOps |
| Message | text | DevOps |
| Author | text | DevOps |
| Date Committed | date and time (UTC) | DevOps |
| Link to Components | link → Components (single) | Computed (reverse of Components → GitHub Commits) |
| Files Changed | long text | DevOps |
| Commit URL | URL | DevOps |
| Commit Type | single select: Feature, Bugfix, Documentation, Chore, Refactor, Other | DevOps |

## DS Feedback

Out of scope for now. Every column is **Unassigned**: Feedback, Components,
Submitted By, Step to Reproduce, Suggestion, Urgency, Attachment, Status
(Completed, In Progress, Not Started).

## One-Off Components

Out of scope for now. Every column is **Unassigned**: Components, Project,
Usage quantity, Git Repo, Figma.

## The Development formula

`Development` is the component's status. It reads evidence only. **No agent
may write it** — change the evidence underneath it instead.

First match wins, in this order. "Summary" is Staging Testing Results Summary.

| # | Status | Condition |
| --- | --- | --- |
| 1 | Fixing | Summary contains `Failed` **and** contains `re-test` |
| 2 | To be fixed | Summary contains `Failed` |
| 3 | Fixed | Summary contains `re-test` |
| 4 | Released | Astro Link, Release Review and Release Verdict = `Cleared` are all set |
| 5 | Completed | Production Storybook is set |
| 6 | To be deployed | Summary is not empty |
| 7 | Ready for Testing | Staging Storybook is set |
| 8 | To-do | Figma is set **and** Design = `Done` |
| 9 | *(blank)* | Otherwise |

What follows from the order:

- A failure outranks everything below it. A Completed component whose retest
  fails reads To be fixed.
- `re-test` matches the value `Fixed (To re-test)`. The match is
  case-sensitive.
- To be deployed means "at least one result exists", not "every result
  passed". Never read it alone as permission to deploy — see the next section.
- Released is unreachable while its three columns are unassigned.

## Who each status wakes

An Airtable automation starts the next agent when a component's status
changes.

| Status | Wakes |
| --- | --- |
| To-do | Developer (build) |
| Ready for Testing | QA |
| Fixed | QA (retest) |
| Fixing | QA (retest) |
| To be fixed | Developer (fix) |
| To be deployed **and** Synchronization % = 100% | DevOps |
| Completed | Nobody for now (documentation is out of scope) |

## Flags — where a description and the base disagree

These are reported, not fixed. Do not work around them.

1. **Release Review** — the description says it "does not feed Development".
   The formula reads it in step 4 (Released).
2. **Release Verdict** — the description says it is "deliberately not wired
   into Development". The formula reads it in step 4 (`= Cleared`).
3. **Staging Passed Tests** — the description says it "feeds Synchronization
   %". The Synchronization % formula does not reference it; it reads
   Staging Passed Count and Total Staging Tests.
4. **Development**, step 6 — the description says "Any staging test rows
   exist → To be deployed". The formula checks that the results summary is not
   empty, so rows with no Testing Results value do not count.
5. **Staging Passed Count** (no description) — the name says "passed", but the
   API shows it as a count of every linked Staging Testing row with no visible
   filter. If it has no Passed-only condition, Synchronization % reads 100% as
   soon as rows exist, and the DevOps wake fires early. Check the field's
   settings in Airtable before relying on it.
6. The API does not expose rollup aggregation functions, so the aggregation
   of Staging Testing Results Summary and Staging Passed Tests could not be
   checked against their descriptions.
