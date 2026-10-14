---
name: release-review
description: Reviewing one flex-ds component for release at one commit — seven gates that must all be open, six checks on its intent file, a report pinned to the reviewed commit, and a verdict of Cleared or Blocked. Read-only on everything it reviews. Used by the release agent before a component is published.
---

# release-review

A review answers one question: may this component, at this commit, go into a
published release? It reads, judges and reports. It never edits an intent
file, never fixes what it finds, and never publishes. A finding goes to the
owner of the thing that is wrong.

## 0. Pin the commit

- The reviewed commit is the commit the release would publish: `main` HEAD
  unless the owner names another. Record its full hash.
- Review a clean checkout of exactly that commit
  (`git worktree add --detach <dir> <hash>`), never a working tree with
  local changes. Run `npm ci` and `npm run build:tokens` there.
- Everything below is read at that commit. A finding from another commit or
  branch is not a finding.

## 1. The seven gates

A gate is open or shut. One shut gate blocks the release. Check every gate
even after one shuts, so the report lists everything at once.

| # | Gate | Open when | Owner of a shut gate |
| --- | --- | --- | --- |
| 1 | **Intent written** | `src/components/<Name>/<Name>.intent.json` exists at the commit and parses. | Intent agent |
| 2 | **Development is Completed** | The component's `Development` in the registry reads exactly `Completed` (read it; see the `registry` skill). Any other value, including a failure status on a component that once read Completed, shuts the gate. | Whoever the registry's status table names |
| 3 | **Tokens clean** | `npm run build:tokens` and `npm run check:tokens` both pass, and `tokens/` at the commit equals `tokens/` on `main` (no unmerged token sync). A green build alone does not open this gate. | Designer (gaps), token-runner (sync) |
| 4 | **Public surface decided** | `docs/` declares the component internal (as `docs/field-control-prop-names.md` does for FieldControl and FieldLabel), or it is public: it has a Components row and a Figma node. A public component is exported from `src/index.ts` only after it is Cleared; whether it is exported yet does not open or shut this gate. | Owner |
| 5 | **Names final** | The component and every prop are named as Figma names them, and every suggested rename under `docs/` for this component records the owner's decision. An open suggestion shuts the gate. | Owner |
| 6 | **States complete** | Every state in the component's Figma matrix has a story and a `Passed` Staging Testing row, or the owner's ruling to leave it out is recorded under `docs/`. | Developer (story), QA (row), owner (ruling) |
| 7 | **Version meaning known** | `docs/versioning.md` exists at the commit, and the component is classified under it (new, breaking, changed or unchanged since the last `v*` tag), naming the specific change behind the class. With no policy at the commit the gate is shut. Never assume a scheme the file does not state. | Owner |

## 2. The six checks

Run on the component's intent file, and on every intent file for check 6.

| # | Check | Passes when | On failure |
| --- | --- | --- | --- |
| 1 | **Fields present** | All seven keys exist: `use_when`, `dont_use_when`, `variant_intent`, `placement`, `pairs_with`, `required_tokens`, `a11y`. Every non-empty entry has a `source`. `use_when` is not empty. | Blocker |
| 2 | **Every `dont_use_when` names an alternative** | Each entry names what to use instead: another component (by folder name) or another variant. | **Warning, never a blocker.** List the entries without one. Never suggest an alternative yourself. |
| 3 | **`a11y` specific, not generic** | Each entry names something checkable — an element, a role, an `aria-*` attribute, a key, a focus behaviour — with its source. "Accessible", "follows WCAG", "screen-reader friendly" with nothing behind them fail. An empty `a11y` fails. | Blocker |
| 4 | **`required_tokens` resolve** | Every token listed is defined in `build/css/*.css` at the commit, and every `var(--…)` the component's own CSS and JSX reference is listed. A token the code uses but the file omits means the intent is stale. | Blocker |
| 5 | **All variants covered** | Every variant prop and every value the code accepts is a key in `variant_intent`. A `null` meaning is covered; list it in the report. | Blocker |
| 6 | **No two components claim the same job** | No `use_when` entry of this component describes the same situation as a `use_when` entry of another component, unless one's `dont_use_when` sends that situation to the other. | Blocker. Quote both entries and both sources. |

Check 6 is a judgement. Make it only from quoted text: put the two entries
side by side in the report. If you cannot quote them, there is no finding.

## 3. The verdict

- **Cleared**: all seven gates open and checks 1, 3, 4, 5 and 6 pass.
  Warnings from check 2 do not change it.
- **Blocked**: anything else. Name every shut gate and failed check.
- The verdict is the reviewer's, not an approval. A human approves the
  release and a human runs `npm run release:publish`.

## 4. Write the report

Write `reports/release-review/<Name>-<short hash>.md`. One review, one file;
a later review of a new commit writes a new file and never overwrites an old
one. In this order:

1. **Header**: component, full reviewed hash, the version in `package.json`
   at that hash, review time (UTC), verdict.
2. **Gates**: each of the seven, open or shut, with the evidence: the file
   and line, the command and its output, or the registry value read.
3. **Checks**: each of the six, pass, fail or warning, with the entries
   quoted and their sources.
4. **What each owner is waiting on**: one line per shut gate or failed check,
   addressed to its owner.

The report reaches `staging` by pull request, merged by a human. Only once it
reads merged, the release agent writes Release Review (the report's permalink at the
merge commit hash, never a branch URL) and Release Verdict, together or not at all (`registry` skill).

## Never

- Never edit an intent file, a component, a story, `docs/` or `tokens/`.
  Report what is wrong to its owner.
- Never write the registry beyond Release Review and Release Verdict, and
  never those before the report's pull request is merged.
- Never fix a finding, even a one-character one.
- Never publish, tag, bump a version, or run `release:publish`, even with
  `--dry-run`.
- Never clear a component with a shut gate, and never turn a check 2 warning
  into a blocker.
- Never fill a missing versioning policy, ruling or alternative with your own.
- Never review anything other than the pinned commit.
