---
name: security-check
description: The flex-ds security gate — scripts/security-check.mjs, no dependencies. Static mode scans build output for credentials, private identifiers and environment leakage, runs npm audit and refuses a dirty tree; live mode checks a deployed URL is public or protected as intended. Used by the Developer before opening its pull request into staging and by DevOps before merging staging to main and after the production deploy.
---

# security-check

One gate, two agents. The Developer and DevOps run the same script so they can
never drift into two gates that slowly differ.

## What it covers

Static mode, `node scripts/security-check.mjs [dir ...]` (default dirs:
`storybook-static`, `build`):

| # | Check | How |
| --- | --- | --- |
| 1 | Credentials in build output | Provider-specific patterns, not entropy: Airtable PAT, GitHub classic and fine-grained tokens, Figma PAT, Anthropic, OpenAI, AWS access key ID, Google API key, Slack, Stripe live, npm, PEM private key blocks. |
| 2 | Private identifiers | Airtable base, table and field IDs of any shape that looks random (a digit, or at least three capitals, in the 14 characters after `app`/`tbl`/`fld`); this repo's own IDs from `.claude/registry.local.json`; the git author email; Windows, macOS and Linux home paths. |
| 3 | Environment leakage into client JS | `process.env.*` and non-public `import.meta.env.*` left in a bundle, except the names in `BENIGN_PROCESS_ENV` (see below); the literal value of every variable in a local `.env*` file (except `.env.example`). |

### Reviewed exceptions

Each was approved by the owner on 2026-09-29 in a pull request of its own,
after it produced a false positive on the Storybook build. Nothing else is
exempt, and no file or directory is skipped.

| Exception | Why |
| --- | --- |
| Airtable ID must look random | `applyRegistration`, in Storybook's manager runtime, is `app` + 14 letters. Real IDs are random mixed case, so they almost always have a digit or three capitals. |
| `process.env.NODE_ENV` | Replaced at build time by every bundler. |
| `process.env.NODE_DEBUG` | semver's debug switch (`internal/debug.js`), a guarded runtime read bundled by Storybook. It holds no value. |
| `process.env.DEBUG_PRINT_LIMIT` | Testing Library's `prettyDOM` length, a guarded runtime read bundled by Storybook. It holds no value. |

A new exception needs the same: its source, why it cannot carry a secret, and
a human's review in its own pull request.
| 4 | Dependency advisories | `npm audit`; any high or critical advisory fails. If audit cannot run, that is a failure, not a pass. |
| 5 | Dirty working tree | `git status --porcelain` must be empty: what ships must be what is committed. |

Live mode, `node scripts/security-check.mjs --live <url> --expect public|protected`:

- `public`: an anonymous request must get 200, with no 401/403 and no redirect
  to a login. The page and its same-origin scripts then go through checks 1–3.
- `protected`: an anonymous request must be refused (401/403, or a redirect
  to a login).
- It fails either way round. `--expect` is required; the gate never guesses
  which one a URL is meant to be.

Exit 0 is a pass. Exit 1 lists every finding. A scan that reads no files fails,
because it vouches for nothing.

## What it does not cover

Say this plainly whenever you report a pass. No gate protects against every
attack, and a gate that claims to is not trustworthy.

- Secrets with no provider-specific shape: Vercel tokens, passwords, generic
  random keys. It does not use entropy, by design.
- Secrets that are encoded, split, or built at runtime.
- An Airtable ID with no digit and fewer than three capitals, about 0.05% of
  real IDs.
- Git history. It reads the working tree and the output, not past commits.
- Vulnerabilities in the code itself: XSS, injection, unsafe `dangerouslySetInnerHTML`.
- Supply-chain risk beyond what `npm audit` knows about.
- Access control beyond one anonymous request to one URL.

## Who runs it, and when

| Who | When | Command | On a failure |
| --- | --- | --- | --- |
| Developer | Before opening the pull request from `component/<name>` into `staging`, after building Storybook | `node scripts/security-check.mjs storybook-static build` | Do not open the pull request. Fix the source, never the output, then run it again. |
| DevOps | On `origin/staging`, before opening and again before merging the `staging` → `main` pull request | same | Do not open or merge. Report it; do not fix it. The Developer owns the fix. |
| Developer | After the staging deploy, before writing Staging Storybook | `--live <staging story URL> --expect protected` | Do not write Staging Storybook. Report it. |
| DevOps | After the production deploy, before writing Production Storybook | `--live <production story URL> --expect public` | Do not write Production Storybook. Report it. |

Each environment's visibility was decided by the owner on 2026-09-29:

| Environment | Branch | Meant to be |
| --- | --- | --- |
| Staging Storybook | `staging` | **Protected**: an anonymous request is refused. |
| Production Storybook | `main` | **Public**: anyone can open it, and it carries nothing private. |

A staging URL that answers anonymously is a finding, and so is a production
URL behind a login.

Staging is `https://flex-ds-git-staging-design-rules-the-world.vercel.app`;
production is `https://flex-ds-sigma.vercel.app`. Vercel's Standard
Protection also covers one-off deployment URLs (`flex-<hash>-….vercel.app`),
including production ones, so a production story link on such a URL fails
`--expect public`. Build the Production Storybook link on the production
domain.

## Flags

- `--skip-audit`: offline only. The run prints `SKIPPED npm audit`, and a
  skipped check is never reported as passed.
- `--allow-dirty`: only for proving the gate on a fixture. Never in the
  pipeline.

## Proof that it fires

Re-run this after any change to the patterns. Generate fake credentials at
runtime in a scratch folder outside the repo — never commit one, not even a
fake, because a fake in history trains everyone to ignore the gate.

Verified 2026-09-29 on a scratch fixture:

- One fake of each of the 12 credential types: 12 caught, each by its own
  pattern.
- Fake Airtable app/tbl/fld IDs, this repo's base ID, Windows and macOS home
  paths: all caught.
- `process.env.X`, `import.meta.env.VITE_X`, and a `.env` value copied into a
  bundle: all caught.
- A clean fixture: passed.
- The real repo with an untracked file: failed on dirty tree. `npm audit`
  ran and found nothing high or critical.
- Live: a 200 page passes as `public` and fails as `protected`; a 401 page
  passes as `protected` and fails as `public`; no `--expect` exits 2.

Re-verified 2026-09-29 after the reviewed exceptions were added:

- All 12 credential types, fake Airtable app/tbl/fld IDs (including one with
  no digit and three capitals), `process.env.SECRET_KEY`,
  `process.env.NODE_DEBUGGER` and `import.meta.env.VITE_SECRET`: 19 of 19
  caught.
- `applyRegistration`, `tblFormatterNote` and guarded reads of `NODE_DEBUG`,
  `DEBUG_PRINT_LIMIT` and `NODE_ENV`: passed.
- The real Storybook build (`storybook-static build`): passed.

## Never

- Never mark a gate passed when a check was skipped or could not run.
- Never fix a finding in the build output. Fix the source and rebuild.
- Never add an allowlist entry, weaken a pattern, or pass `--allow-dirty` to
  get a green run. An exception goes through "Reviewed exceptions" above, in
  its own pull request, or not at all.
- Never paste a found credential into a report, a registry cell or a
  message. The script prints only its first 12 characters; quote no more.
- Never guess `--expect`.
- Never claim a pass means "secure". It means these five checks found
  nothing.
