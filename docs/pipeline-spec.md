# Pipeline spec — the Flex DS evidence loop

How a component moves from a client brief to production Storybook: who does
each step, what they read and write, what they refuse to do, and the exact
condition that hands work to the next actor.

Sources: the FigJam board *Flex Design System Evidence Loop*, the Flex-DS
Airtable base, and decisions made with the design-system owner. The rules
every agent follows are in `CLAUDE.md` and `tools.md`. Every registry column
and its owner is in `.claude/skills/registry/SKILL.md`. Each agent's
boundaries are in its file under `.claude/agents/`: `developer.md`, `qa.md`,
`devops.md`, `pm.md` and `token-runner.md`.

Where the board and the registry contract disagreed, the owner ruled on
2026-09-29:

- PM is in scope as a read-only auditor. Its output is a report file, not
  Asana tickets.
- The board's "Production testing" table is a board error. No such table
  exists.
- Completed starts nobody by status. QA's re-test of Completed components is
  started by the token-sync cron, not by the board's Completed → QA arrow.
- Every agent's trigger uses the `Development` formula's definitions, not the
  board's wording of the conditions.

Anything not yet decided is listed under [Open items](#open-items). It has
not been filled in anywhere else in this document.

## In scope now, and not yet

| In scope | Skipped for now |
| --- | --- |
| Client brief → design → build → staging test → fix loop → production Storybook | Documentation and release (Astro site, Release Review, Release Verdict, the Released status) |
| Token sync from Figma, and re-testing what it affects | Asana tickets |
| PM: a scheduled, read-only audit of the registry | DS Feedback and One-Off Components tables |

## Tools

| Tool | Used for |
| --- | --- |
| Figma (Education plan) | Components, UI kit and tokens. The source of truth. |
| Claude (Pro plan) | The chat interface and every agent. |
| GitHub (Free) | Component branches, `staging`, pull requests, `main`. |
| Vercel (Free) | Hosts the staging and production Storybook. |
| Airtable (Free) | The registry. Its automations start the next agent. |
| GitHub Actions | The scheduled check for merged token syncs. |
| A cron (location open) | The PM sweep. |

## The crew

| Actor | Type | Started by | Hands off to |
| --- | --- | --- | --- |
| Client | Human | — | Designer |
| Designer | Human | The client's brief | Developer (via To-do); token-runner (via you) |
| token-runner | Agent | You, when the Designer says tokens changed | You (PR to merge) |
| Developer | Agent | To-do, To be fixed | QA |
| QA | Agent | Ready for Testing, Fixed, Fixing; the token re-test schedule | Developer or DevOps |
| DevOps | Agent | To be deployed **and** Synchronization % = 100% | Nobody — Completed is the end |
| PM | Agent | The sweep schedule | Nobody — it reports to owners through its report file |
| You (approver) | Human | A pull request waiting for you | DevOps, or `main` directly |

## How work moves

A component's status is the `Development` formula in the registry. It reads
evidence only; **no agent ever writes it**. The full precedence is in the
registry skill. In short, first match wins:

1. Fixing — some results Failed and some Fixed (To re-test)
2. To be fixed — some results Failed
3. Fixed — some results Fixed (To re-test), none Failed
4. Released — out of scope
5. Completed — Production Storybook is set
6. To be deployed — at least one test result exists
7. Ready for Testing — Staging Storybook is set
8. To-do — Figma is set and Design = Done

When an actor finishes, the next one starts on its own: an Airtable automation
fires on the new status and starts the agent it points to.

| Status | Starts |
| --- | --- |
| To-do | Developer, to build |
| Ready for Testing | QA |
| Fixed | QA, to retest |
| Fixing | QA, to retest the fixed rows while the rest are still being fixed |
| To be fixed | Developer, to fix |
| To be deployed, **and** Synchronization % = 100% | DevOps |
| Completed | Nobody |

To be deployed alone is not enough to start DevOps. The formula shows it as
soon as one result exists, so the automation also waits for every row to pass.

Two starts come from a schedule rather than a status: the token-sync cron
starts QA for affected Completed components, and the sweep cron starts PM.

Every registry write recomputes the status, and a status change can start the
next agent at once. So each agent writes in a fixed order, and the write that
hands off comes last:

- The Developer writes Composes before Staging Storybook. On a fix, it writes
  the new Staging Storybook link before marking any row `Fixed (To re-test)`.
- QA creates every row in the matrix with Testing Results blank, then writes
  the results in as few calls as the API allows, Passed before Failed.
- DevOps writes GitHub Commits and Commit before Production Storybook.

## Branches and merges

- Every component has its own branch, named `component/<name>` (for example
  `component/button-cta`).
- The Developer merges its component branch into the shared `staging` branch.
  Vercel deploys `staging` automatically.
- DevOps opens one pull request per component from its component branch to
  `main`, including any component it composes that is not on `main` yet. You
  approve it; DevOps merges it.
- token-runner works only on `tokens-update`. You merge its pull requests.
- No agent pushes to `main`. `main` is protected: pull requests only, no force
  push, no deletion, enforced for admins too.
- The agents use your GitHub account. GitHub does not let you approve your own
  pull request, so `main` requires no approvals. Your approval before DevOps
  merges is enforced by DevOps's instructions, not by GitHub.

## The actors

### Client — human

- **Reads:** nothing in the pipeline.
- **Writes:** a request prompt or client brief, through the Claude chat
  interface.
- **Hands off when:** the brief exists. It goes to the Designer. No registry
  record and no status.

### Designer — human

- **Reads:** the client's brief.
- **Writes:**
  - In Figma: the component library, UI kit and tokens.
  - In the registry: creates the component's row and writes its name,
    Category, Figma link, and Design.
- **Hands off when:**
  - Figma is set **and** Design = Done. The status becomes To-do, which starts
    the Developer. A blank Design means the design is not signed off, and no
    agent nudges it along.
  - Tokens changed in Figma. The Designer tells you, and you start
    token-runner.

### token-runner — agent

- **Started by:** you, after the Designer says the Figma tokens changed.
- **Reads:** the fresh Figma export in `tokens/`.
- **Writes:** commits and a pull request on `tokens-update`. Nothing in the
  registry.
- **Refuses to:**
  - hand-edit anything in `tokens/`, by any route;
  - push to or merge into `main`;
  - use any branch other than `tokens-update`, or force-push;
  - commit `build/`, or anything outside `tokens/`.
- **Hands off when:** the pull request is open. If more than 20 tokens
  changed, it stops for your review first. You merge. A scheduled GitHub
  Actions check then notices the merged sync and starts QA to retest the
  affected Completed components.

### Developer — agent

The engineer role in `CLAUDE.md` and `tools.md`.

- **Started by:** To-do (build) or To be fixed (fix).
- **Reads:**
  - the Figma component and its properties;
  - the component's row in Components;
  - on a fix, the component's Staging Testing rows: Expected Results and
    Suggestion for Improvement;
  - `CLAUDE.md` and the registry skill.
- **Writes:**
  - code on `component/<name>`, merged into `staging`;
  - Staging Storybook: the component's own story, replaced with a new link
    after each fix;
  - Composes: the components this one imports;
  - on a fix, Testing Results from `Failed` to `Fixed (To re-test)` for each
    row it fixed. That change is the only one it may make to that column.
- **Refuses to:**
  - edit `tokens/` or `build/`;
  - write `Passed` or `Failed`;
  - write the status;
  - merge anything except its own branch into `staging`;
  - touch `main`;
  - verify its own work.
- **Hands off when:**
  - **Build:** Staging Storybook is set. The status becomes Ready for Testing,
    which starts QA.
  - **Fix:** it marks a fixed row `Fixed (To re-test)`. The status becomes
    Fixed if no Failed rows remain, or Fixing if some do. Either one starts
    QA.

### QA — agent

- **Started by:** Ready for Testing, Fixed or Fixing. Also by the token
  re-test schedule, for Completed components affected by a token change.
- **Reads:**
  - the Figma UI kit;
  - the component's staging Storybook link;
  - `CLAUDE.md`, whose rules it also tests.
- **Writes:** Staging Testing rows, one per component or subcomponent ×
  variant × size × state:
  - Composed In, Variants, Size, State, Context;
  - Attachment: the screenshot;
  - Expected Results: what Figma specifies;
  - Suggestion for Improvement: what is wrong;
  - Testing Results: `Passed` or `Failed`.

  A retest overwrites the same row. States the State column cannot record
  (`pressed`, `destructive`, `default`) go in Variants.
- **Retest scope:** on Fixing, the rows marked `Fixed (To re-test)`. On
  Fixed, the full matrix, because a fix can break a case that passed.
- **Hard gate:** no Staging Storybook link, no test. QA waits.

Staging Storybook is **protected** and production Storybook is **public**.
The live security gate checks both: the Developer runs it on the staging
story with `--expect protected`, and DevOps on the production story with
`--expect public`.
- **A row passes only if all three hold:**
  - the Storybook property values match the Figma property values;
  - the visual is pixel-identical to Figma;
  - the `CLAUDE.md` rules hold: tokens only, every state present, Lucide
    icons.
- **Refuses to:**
  - fix anything;
  - edit any file;
  - write `Fixed (To re-test)`;
  - write any Components column;
  - write the status.
- **Hands off when:**
  - Any row is Failed. The status becomes To be fixed, which starts the
    Developer.
  - Every row is Passed. The status becomes To be deployed and
    Synchronization % reaches 100%, which starts DevOps.
  - **A token re-test of a Completed component** passes, and the component
    stays Completed. If any row fails, it becomes To be fixed and the fix
    loop runs again.

### DevOps — agent

- **Started by:** To be deployed **and** Synchronization % = 100%.
- **Reads:**
  - the component's row, including Composes, to find composed components not
    yet on `main`;
  - its Staging Testing results;
  - its staging Storybook link, which it checks before deploying.
- **Writes:**
  - a pull request from `component/<name>` to `main`;
  - after the merge: Production Storybook, Commit, and a GitHub Commits row
    per commit.
- **Does, in order:**
  1. Verifies its gate from the registry: every Staging Testing row of every
     component in the pull request reads `Passed`. It does not rely on
     Synchronization % alone.
  2. Opens the pull request.
  3. Waits until you approve it. How that approval is recorded is not yet
     defined (see open items). Until it is, DevOps stops here.
  4. Merges it with a merge commit. Vercel deploys production.
  5. Opens the production story and sees it render.
  6. Writes GitHub Commits and Commit, then Production Storybook last.
- **Refuses to:**
  - merge without your approval;
  - merge while any row for any component in the pull request is not Passed;
  - push to `main`;
  - edit component code;
  - write test results or the status.
- **Hands off when:** Production Storybook is set. The status becomes
  Completed. DevOps is started only after every row has passed, so there is no
  failure case. Nobody is started after Completed while documentation is out
  of scope.

### PM — agent

- **Started by:** the sweep schedule. Never by a status, and never by a
  message.
- **Reads:** every row of Components, Staging Testing and GitHub Commits;
  every link in them, opened rather than counted; `src/components/`; its own
  previous report.
- **Writes:** `reports/registry-sweep.md`, overwritten each sweep. Nothing in
  the registry: the contract gives PM no column.
- **Report sections, in order:** what changed since the last sweep; status
  counts with the rows behind them; what each owner is waiting on;
  contradictions (a status that does not follow from its evidence, a
  Synchronization % that does not match the Passed rows, unlinked rows,
  repo/registry mismatches, values in Unassigned columns); dead links.
- **Refuses to:**
  - write any registry cell, even to correct an obvious error;
  - fix, commit, push, open a pull request or merge;
  - start another agent or tell one to act;
  - report a link as good without opening it, or a count without its rows.
- **Hands off when:** never. A status starts agents; the report tells each
  owner what the evidence says.

### You — human approver

- **Approve:** DevOps's pull requests to `main`.
- **Merge:** token-runner's pull requests, and every other pull request not
  delegated to an agent.
- **Start:** token-runner, when the Designer says tokens changed.

## Open items

Not decided yet. Nothing in this document assumes an answer.

1. **Where agents run** when an Airtable automation fires, and where the PM
   sweep cron runs. No preference given. The options were GitHub Actions, a
   Vercel function, or your computer. This also decides whether PM's report
   file is kept anywhere, since PM does not commit it.
2. **Staging Passed Count** may count every row, not just Passed ones. If it
   does, Synchronization % reaches 100% early and DevOps starts before QA has
   finished. Check the field's settings in Airtable.
3. **Inferred owners.** The Designer owning the Components name and Category
   was inferred, not stated.
4. **DevOps's staging check.** It is not defined what DevOps checks on the
   staging link before deploying, or what it does if the check fails.
5. **Which components a token change affects.** Nothing in the registry links
   tokens to components, so it is not defined how QA finds them.
6. **The Client after the brief.** Does the Client receive the production
   link, or approve anything? Is the Claude chat interface just a channel, or
   an intake step that rewrites the brief?
7. **Designer review.** Does the Designer ever review the staging or
   production result?
8. **Access per agent.** All agents share your Airtable and GitHub accounts,
   so column ownership and the approval gate are enforced by instructions
   alone. Where the Claude credentials for each agent come from is not set.
9. **Plan limits to verify before relying on them:**
   - Airtable Free automation runs, and whether it allows webhook actions;
   - Vercel Hobby's non-commercial terms;
   - Claude credentials for agents that run unattended;
   - GitHub Actions' 6-hour job limit, if DevOps waits for approval there.
10. **Pixel-identical visual checks** may fail on font and anti-aliasing
    differences between Figma and the browser.
11. **Registry descriptions that disagree with the base or the contract.**
    Seven are listed in the registry skill's Flags section.
12. **`staging` does not exist yet.** Neither the branch nor its Vercel
    deployment has been created.
13. **How DevOps detects your approval.** GitHub does not let the shared
    account approve its own pull request, so there is no review DevOps can
    read. Anything the account can write (a comment, a label) DevOps could
    also have written. Until a signal is chosen, DevOps opens the pull
    request and stops.
14. **Automations firing mid-write.** The Airtable API writes at most 10 rows
    per call. On a large matrix, QA's writes pass through intermediate
    statuses. A retest can briefly read Fixing and start QA again. A delay
    or de-duplication in the automation would close this.
15. **Agent tool names are tied to this account's connectors.** The agent
    files name the Airtable, Figma and Vercel tools by connector ID, and the
    browser tools of the Claude desktop app. A reconnected connector, or
    agents running elsewhere, breaks them.
16. **How agents reach the protected staging Storybook.** The owner decided
    (2026-09-29) that staging is protected and production is public, and the
    live security gate enforces both. Staging's protection also blocks the
    agents that must open it: the Developer (before writing Staging
    Storybook), QA (every test), DevOps (its staging check) and PM (its link
    sweep). Neither the protection nor a way for agents to authenticate
    through it (for example Vercel's protection bypass for automation) is
    set up. Until both are, staging is either unprotected, so the gate fails,
    or unreachable, so nobody can test.
17. **The stack `CLAUDE.md` describes does not exist yet.** There is no
    component framework, no Storybook, no `src/`, and no
    `stories/lib/tokens.js`. `CLAUDE.md` names the entry points
    `build/css/index.css`, `index-mobile.css` and `index-back-office.css`, but
    the build writes `tokens.css`, `tokens-dark.css` and
    `tokens-back-office.css`. Its naming examples (`color-text-brand`) also
    differ from the built semantic names (`--text-interactive-brand-idle`).
    The build skill stops at Stage 0 until this is settled.
