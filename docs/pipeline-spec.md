# Pipeline spec — the Flex DS evidence loop

How a component moves from a client brief to production Storybook: who does
each step, what they read and write, what they refuse to do, and the exact
condition that hands work to the next actor.

Sources: the FigJam board *Flex Design System Evidence Loop*, the Flex-DS
Airtable base, and decisions made with the design-system owner. The rules
every agent follows are in `CLAUDE.md` and `tools.md`. Every registry column
and its owner is in `.claude/skills/registry/SKILL.md`. Each agent's
boundaries are in its file under `.claude/agents/`: `developer.md`, `qa.md`,
`devops.md`, `pm.md`, `token-runner.md` and `changelog.md`.

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
| changelog | Agent | You, after the Designer says a design changed; the token-sync schedule | Nobody — it writes Figma's Change Log |
| You (approver) | Human | A pull request waiting for you | The Developer (after you merge into `staging`), DevOps (after you approve `staging` → `main`) |

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

Starts that come from a schedule rather than a status: the token-sync cron
starts QA for affected Completed components and the changelog agent, and the
sweep cron starts PM.

Every registry write recomputes the status, and a status change can start the
next agent at once. So each agent writes in a fixed order, and the write that
hands off comes last:

- The Developer writes Composes and its GitHub Commits rows before Staging
  Storybook. On a fix, it writes the GitHub Commits rows and the new Staging
  Storybook link before marking any row `Fixed (To re-test)`.
- QA creates every row in the matrix with Testing Results blank, then writes
  the results in as few calls as the API allows, Passed before Failed.
- DevOps writes Commit before Production Storybook.

## Branches and merges

Changed by the owner on 2026-09-30: component branches no longer go to
`main`, and the Developer no longer merges.

- Every component has its own branch, named `component/<name>` (for example
  `component/button-cta`), branched from `staging`.
- The Developer opens a pull request from its component branch into the
  shared `staging` branch and stops there. You merge it. Vercel deploys
  `staging` automatically, and only then does the Developer write the staging
  Storybook link.
- `main` receives only `staging`. DevOps opens one pull request, `staging` →
  `main`, and only once every component on `staging` that is not yet on
  `main` has passed every QA row. One untested or failing component holds
  back the rest. You approve it; DevOps merges it. DevOps is the only agent
  that merges into `main`.
- token-runner works only on `tokens-update`. You merge its pull requests.
- No agent pushes to `main`. `main` is protected: pull requests only, no force
  push, no deletion, enforced for admins too.
- The agents use your GitHub account. GitHub does not let you approve your own
  pull request, so `main` requires no approvals. Your approval before DevOps
  merges is enforced by DevOps's instructions, not by GitHub. You give it in
  chat ("approved #25"). The main session relays your words to DevOps with
  the head commit they cover, and DevOps merges. You do not press merge on
  GitHub (decided 2026-09-30).

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
  - code on `component/<name>`, and a pull request from it into `staging`
    that you merge;
  - Staging Storybook: the component's own story, replaced with a new link
    after each fix;
  - Composes: the components this one imports;
  - GitHub Commits (changed by the owner on 2026-09-30; DevOps's before):
    after you merge its pull request into `staging`, one row per commit the
    pull request carried that touches the component's folder, linked to the
    component. No row for the merge commit;
  - on a fix, Testing Results from `Failed` to `Fixed (To re-test)` for each
    row it fixed. That change is the only one it may make to that column.
- **Refuses to:**
  - edit `tokens/` or `build/`;
  - write `Passed` or `Failed`;
  - write the status;
  - merge anything, including its own pull request into `staging`;
  - write Staging Storybook before you have merged its pull request;
  - touch `main`;
  - verify its own work.
- **Hands off when:**
  - **Pull request open:** to you, to merge into `staging`. The registry is
    unchanged until you do.
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
  - the visual matches Figma: the same shapes, glyphs, colours, sizes and
    positions, compared at the same scale with the fonts measured as loaded;
  - the `CLAUDE.md` rules hold: tokens only, every state present, Lucide
    icons.

  **Rasterisation is not a finding** (owner's ruling, 2026-10-01). Chrome
  and Figma anti-alias the same outline differently, and no change to a
  component can close that. Once the property values match token for token,
  a difference confined to edge pixels passes. Edge pixels are the ones a
  glyph or icon stroke only partly covers. QA names it in Context, with the
  largest per-pixel difference it measured. The visual still fails if any
  of these hold:
  - a pixel that is solid in one render differs in the other, either inside
    a shape or in the background;
  - a glyph, icon or weight differs;
  - an edge moves by a whole pixel or more.
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
  - every component on `staging` not yet on `main`: rows with Staging
    Storybook set and Production Storybook blank, plus every component folder
    `staging` changes relative to `main`;
  - their Staging Testing results;
  - their staging Storybook links, which it checks before deploying.
- **Writes:**
  - one pull request from `staging` to `main`;
  - after the merge, for each shipped component: Production Storybook and
    Commit (the merge commit). It no longer writes GitHub Commits.
- **Does, in order:**
  1. Verifies its gate from the registry: every Staging Testing row of every
     component on `staging` not yet on `main` reads `Passed`. It does not
     rely on Synchronization % alone. If any component is not there yet, it
     reports which and stops; the last component to pass starts it again.
  2. Opens the `staging` → `main` pull request.
  3. Reports the PR and its head commit, and stops. You approve in chat; the
     main session relays your words, the PR number and that head to DevOps.
     If the head moved, the approval is void and DevOps starts again.
  4. Merges it with a merge commit. Vercel deploys production.
  5. Opens the production story and sees it render.
  6. Writes Commit, then Production Storybook last.
- **Refuses to:**
  - merge without your approval;
  - merge while any row for any component on `staging` not yet on `main` is
    not Passed;
  - open a pull request into `main` from any branch but `staging`;
  - merge into `staging`;
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

### changelog — agent

Added by the owner on 2026-09-30.

- **Started by:**
  - **Design change:** you, when the Designer says a component's design
    changed in Figma. It writes once the code that follows the change is
    merged into `staging`, or at once if the change needs no code.
  - **Token change:** the token-sync schedule (or you), after a
    `tokens-update` pull request merges into `main`.
- **Reads:** the merged pull request; the component's Figma node; `tokens/`
  at the merge and at its parent, through `scripts/component-tokens.mjs`,
  which follows every alias, so a core change reaches every component that
  uses it.
- **Writes:** one new entry at the top of the `Change Log` frame on each
  affected component's Figma page. It clones the newest entry, so the new
  one keeps the Designer's format: date, version, summary, title, and one
  row per change (`Changed` tag, old → new chips, and a note naming the
  variants, the modes and the pull request). Nothing in the registry or the
  repo.
- **Refuses to:**
  - edit an existing entry, a component, a variable, a style, or anything
    outside the Change Log's `Entries` frame;
  - create a Change Log frame (a page without one is reported to the
    Designer);
  - log a change that has not merged, or a code-only fix;
  - commit, push, or touch the registry.
- **Hands off when:** never. The entry is the record.

The ButtonCTA log was backfilled on 2026-09-30 with one entry: the Figma
variant property `type` renamed to `category` (#20). The only token sync so
far (2026-09-28) came before ButtonCTA was built, and the focus-ring and
inset-shadow commits were code-only.

### You — human approver

- **Merge:** the Developer's pull requests into `staging`.
- **Approve:** DevOps's `staging` → `main` pull requests.
- **Merge:** token-runner's pull requests, and every other pull request not
  delegated to an agent.
- **Start:** token-runner, when the Designer says tokens changed; the
  changelog agent, when the Designer says a design changed.

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
10. **Pixel-identical visual checks.** *Resolved 2026-10-01.* The bar failed
    every component with text, because Figma and Chrome never rasterise text
    and icon edges identically. ShotAction failed two rounds on that alone,
    and the Developer had nothing to repair. The owner relaxed the bar:
    differences confined to anti-aliased edges pass once every property
    value matches (see QA's pass bar). ButtonCTA and IconButton passed
    before this ruling without a per-pixel check.
11. **Registry descriptions that disagree with the base or the contract.**
    Seven are listed in the registry skill's Flags section.
12. **Resolved (2026-09-29): `staging` deploys on Vercel.** Project
    `flex-ds` deploys `staging` to
    `flex-ds-git-staging-design-rules-the-world.vercel.app` and `main` to
    `flex-ds-sigma.vercel.app`.
13. **How DevOps detects your approval.** *Resolved 2026-09-30.* GitHub does
    not let the shared account approve its own pull request, and anything the
    account can write (a comment, a label, a merge) DevOps could also have
    written. You approve in chat; the main session relays your exact words,
    the PR number and the head commit, and only that relay counts. Still
    open: it relies on the main session relaying faithfully. A second
    GitHub account that reviews would make it provable.
14. **Automations firing mid-write.** The Airtable API writes at most 10 rows
    per call. On a large matrix, QA's writes pass through intermediate
    statuses. A retest can briefly read Fixing and start QA again. A delay
    or de-duplication in the automation would close this.
15. **Agent tool names are tied to this account's connectors.** The agent
    files name the Airtable, Figma and Vercel tools by connector ID, and the
    browser tools of the Claude desktop app. A reconnected connector, or
    agents running elsewhere, breaks them.
16. **Resolved (2026-09-30): how agents reach the protected staging
    Storybook.** Staging is protected by Vercel Authentication (Standard
    Protection) and production is public; the live security gate enforces
    both. The owner keeps the Claude desktop app's built-in browser signed in
    to Vercel, and the Developer, QA, DevOps and PM open staging through it.
    A separately started agent reached staging in a new tab on 2026-09-30,
    while an anonymous request was still refused. No bypass secret exists:
    the browser tools cannot send headers, so a secret would travel in URLs.
    Each agent opens only staging story URLs, never signs in, and treats a
    login page as an expired session: the Developer, QA and DevOps stop and
    report; PM marks the links not checked and finishes its sweep.
    Revisit this if agents move off this desktop app (item 1). Unattended
    runners would use Vercel's protection bypass for automation, sent as a
    header and kept in that runner's secret store.
17. **The stack `CLAUDE.md` describes does not exist yet.** There is no
    component framework, no Storybook, no `src/`, and no
    `stories/lib/tokens.js`. `CLAUDE.md` names the entry points
    `build/css/index.css`, `index-mobile.css` and `index-back-office.css`, but
    the build writes `tokens.css`, `tokens-dark.css` and
    `tokens-back-office.css`. Its naming examples (`color-text-brand`) also
    differ from the built semantic names (`--text-interactive-brand-idle`).
    The build skill stops at Stage 0 until this is settled.
18. **Keeping `staging` in step with `main`.** Token syncs and process or doc
    pull requests still merge into `main` directly, so `staging` falls behind
    it. QA then tests components against old tokens, and `staging` → `main`
    pull requests can conflict. Nobody is assigned to merge `main` back into
    `staging` after such a merge.
19. **`staging` is protected by instructions only.** Nothing in GitHub stops
    a direct push or a self-merge into `staging`. Branch protection on
    `staging` (pull requests required, no force push) would enforce the
    human merge the way `main` is protected.
20. **One stuck component holds back every release.** DevOps ships only when
    all of `staging` has passed, so a component waiting on a design answer
    blocks the others. There is no way yet to take a component off
    `staging`.
21. **The Developer waiting on your merge.** It waits for its pull request
    into `staging` to merge. If it stops first, it resumes only when started
    again with the same status, and no automation fires then, because a merge
    does not change the status. Someone must start it again, or the wait must
    last until you merge.
22. **The changelog agent's Figma limit is an instruction.** `use_figma` can
    write anything in the file: components, variables, other entries. Only
    its instructions keep it inside the Change Log's `Entries` frame.
23. **Tag vocabulary.** The Designer's Change Log has one tag, `Changed`.
    Added and removed tokens or properties have no designed tag, so the agent
    tags them `Changed` and says which in the note.
24. **A design change is logged only if the Designer reports it.** Nothing
    detects a Figma edit, so a change the Designer does not mention goes
    unlogged.
25. **Item 5, in part.** `scripts/component-tokens.mjs` now maps a token
    change to the components that use it. QA's token re-test does not use it
    yet.
