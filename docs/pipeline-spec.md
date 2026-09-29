# Pipeline spec — the Flex DS evidence loop

How a component moves from a client brief to production Storybook: who does
each step, what they read and write, what they refuse to do, and the exact
condition that hands work to the next actor.

Sources: the FigJam board *Flex Design System Evidence Loop*, the Flex-DS
Airtable base, and decisions made with the design-system owner. The rules
every agent follows are in `CLAUDE.md` and `tools.md`. Every registry column
and its owner is in `.claude/skills/registry/SKILL.md`.

Anything not yet decided is listed under [Open items](#open-items). It has
not been filled in anywhere else in this document.

## In scope now, and not yet

| In scope | Skipped for now |
| --- | --- |
| Client brief → design → build → staging test → fix loop → production Storybook | Documentation and release (Astro site, Release Review, Release Verdict, the Released status) |
| Token sync from Figma, and re-testing what it affects | PM agent, its schedule, and Asana tickets |
| | DS Feedback and One-Off Components tables |

## Tools

| Tool | Used for |
| --- | --- |
| Figma (Education plan) | Components, UI kit and tokens. The source of truth. |
| Claude (Pro plan) | The chat interface and every agent. |
| GitHub (Free) | Component branches, `staging`, pull requests, `main`. |
| Vercel (Free) | Hosts the staging and production Storybook. |
| Airtable (Free) | The registry. Its automations start the next agent. |
| GitHub Actions | The scheduled check for merged token syncs. |

## The crew

| Actor | Type | Started by | Hands off to |
| --- | --- | --- | --- |
| Client | Human | — | Designer |
| Designer | Human | The client's brief | Developer (via To-do); token-runner (via you) |
| token-runner | Agent | You, when the Designer says tokens changed | You (PR to merge) |
| Developer | Agent | To-do, To be fixed | QA |
| QA | Agent | Ready for Testing, Fixed, Fixing; the token re-test schedule | Developer or DevOps |
| DevOps | Agent | To be deployed **and** Synchronization % = 100% | Nobody — Completed is the end |
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
  1. Opens the pull request.
  2. Waits and polls until you approve it.
  3. Merges it. Vercel deploys production.
  4. Writes Production Storybook.
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

### You — human approver

- **Approve:** DevOps's pull requests to `main`.
- **Merge:** token-runner's pull requests, and every other pull request not
  delegated to an agent.
- **Start:** token-runner, when the Designer says tokens changed.

## Open items

Not decided yet. Nothing in this document assumes an answer.

1. **Where agents run** when an Airtable automation fires. No preference
   given. The options were GitHub Actions, a Vercel function, or your
   computer.
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
11. **Registry descriptions that disagree with the base.** Six are listed in
    the registry skill's Flags section.
12. **`staging` does not exist yet.** Neither the branch nor its Vercel
    deployment has been created.
