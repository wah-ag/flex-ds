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
  (documentation, release review, feedback intake). No agent writes them.
- **PM owns no column.** It reads Components, Staging Testing and GitHub
  Commits in full and writes nothing in the registry. Its only output is its
  report file.
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
| Commit | URL | DevOps | The `staging` → `main` merge commit that shipped the component. |
| GitHub Commits | link → GitHub Commits | Developer | The commit records for this component, linked when its pull request into `staging` is merged. |
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
| Tested At | last modified time, watching Testing Results only | Computed | When the row's verdict was last written. DevOps's re-ship gate reads it (see *Re-shipping a Completed component*). Added by the owner in Airtable; if it is missing from the base, report it. |
| Testing Results | single select: Passed, Failed, Fixed (To re-test) | QA | QA writes `Passed` or `Failed`. **Two exceptions:** the Developer may change `Failed` to `Fixed (To re-test)` after fixing it, and may make no other change to this column; and a human may set any row to `Fixed (To re-test)` to force a retest (see *Forcing a retest*). QA never writes `Fixed (To re-test)`. |

## GitHub Commits

One row per commit on `component/<name>` that a merged pull request into
`staging` carried and that touches the component's folder. The pull
request's merge commit gets no row. The Developer owns this table and writes
it after a human merges its pull request (changed by the owner on
2026-09-30; DevOps owned it before).

| Column | Type | Owner |
| --- | --- | --- |
| Commit Hash | text (primary) | Developer |
| Message | text | Developer |
| Author | text | Developer |
| Date Committed | date and time (UTC) | Developer |
| Link to Components | link → Components (single) | Computed (reverse of Components → GitHub Commits) |
| Files Changed | long text | Developer |
| Commit URL | URL | Developer |
| Commit Type | single select: Feature, Bugfix, Documentation, Chore, Refactor, Other | Developer |

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
| Completed | Nobody (documentation is out of scope). A Completed component with newer code on `staging` ships only when the owner asks (see *Re-shipping a Completed component*). |

DevOps ships `staging` as a whole, never one component. Waking for one
component, it opens the `staging` → `main` pull request only if every
component on `staging` that is not yet on `main` has all its rows `Passed`.
Otherwise it reports which components are still waiting and stops; the wake
of the last component to pass ships them all.

Two agents are started by a schedule, not by a status:

- **QA (token re-test).** After a token sync is merged, a cron starts QA for
  the affected Completed components. No status change wakes QA for a
  Completed component.
- **PM.** A cron starts the sweep. No status wakes PM.

Agents read these statuses exactly as the formula defines them. Where the
FigJam board words a condition differently (for example "All = Passed" for
To be deployed, or "all" and "few" re-test rows for Fixed and Fixing), the
formula wins.

## Forcing a retest

The formula sends a component back to QA only when a row fails. If a
component's code changes after every row has passed (a follow-up pull
request into `staging`, a refactor), no evidence moves, nothing wakes QA,
and the untested code can ship.

When that happens, a **human** sets the component's Staging Testing rows to
`Fixed (To re-test)`, even though they never failed. The status becomes Fixed,
which wakes QA, and Synchronization % drops below 100%, which holds DevOps.

- Only a human does this. No agent marks a row it did not repair. An agent
  that notices untested code on `staging` reports it to the human instead.
- QA treats it like any Fixed wake and re-runs the full matrix.
- PM does not report these rows as written by the wrong owner. It still
  reports them if they stay at `Fixed (To re-test)` with no QA retest
  following.

## Re-shipping a Completed component

Production Storybook outranks the test results (step 5 before step 6), so a
component that has shipped once reads Completed for good, unless a row fails or
is set to `Fixed (To re-test)`. When a follow-up change to it reaches
`staging` and its retest passes, it goes straight back to Completed, wakes
nobody, and the change sits on `staging` with no route to `main`.

The route is the owner. Once every component on `staging` that is not yet on
`main` has passed, the owner asks for the release in the main conversation,
and the main session starts DevOps with the owner's words quoted exactly. That
request starts DevOps and proves nothing. DevOps checks the re-ship gate from
evidence:

- the component's folder is in `git diff origin/main...origin/staging`;
- every linked Staging Testing row reads `Passed`;
- every row's Tested At is later than the time its newest commit was merged
  into `staging`. A pass recorded before that merge tested older code.

If Tested At is missing, the gate cannot be proven and DevOps stops. No agent
starts DevOps for a re-ship on its own reading of the registry, and no agent
asks the owner to.

There is no Production Testing table. The FigJam board shows "Production
testing records". That is a board error, and no agent reads or writes such a
table.

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
7. **Astro Link, Release Review, Release Verdict** — the field descriptions
   name owners ("DevOps owns this", "Reviewer owns this"). This contract makes
   all three Unassigned. The contract is what agents follow. No agent writes
   them until the contract changes.

## Never

- Never write `Development`, or any computed column. Change the evidence
  underneath it.
- Never write a column you do not own, including the reverse side of a link.
- Never write a Human or Unassigned column, and never nudge Design along.
- Never write `Fixed (To re-test)` unless you are the Developer and repaired
  that row. Forcing a retest is for a human only (see *Forcing a retest*).
  Never write `Passed` or `Failed` unless you are QA.
- Never write a link you have not opened and seen work.
- Never guess or hard-code a base, table or field ID.
- Never write to a column or table this skill does not list. Report it.
- Never read To be deployed alone as permission to deploy.
- Never work around a flag above. Report it.
