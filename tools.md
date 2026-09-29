# tools.md

The tools this design system is built with, the commands that run them, and
the tools each agent role is allowed to hold. The rules for using them live in
`CLAUDE.md`; this file says what the tools are and who holds them.

## Toolchain

| Tool | What it does here | Status |
| --- | --- | --- |
| Figma (variables + styles) | Source of truth for every token and mode. Exports JSON into `tokens/`. | In use |
| Node.js + npm | Runs the build scripts. The project is an ES module (`"type": "module"`). | In use |
| Style Dictionary 5 | Turns `tokens/` into platform output in `build/`, via `build-tokens.js`. | In use |
| React 19 | The component framework. Components are `.jsx` in `src/components/`. | In use |
| Vite 8 + `@vitejs/plugin-react` | Bundles Storybook. `vite.config.js` adds the React plugin (JSX and hot reload). | In use |
| Storybook 10 (`@storybook/react-vite`) | Documents every component, variant and state. Config in `.storybook/`; the preview loads all three `build/css/*.css` files and has Theme (on-light / on-dark) and Scale (web / back-office) toolbar switches that set `data-theme` / `data-scale` on `<html>`. Stories read `build/css/*.css`. Telemetry is off. | In use |
| Lucide (`lucide-react`) | The only icon set. Import icons by name from `lucide-react`. | In use |
| Google Fonts | Loads Sora and DM Sans, the typefaces the typography tokens name, from the Google Fonts CDN via `.storybook/preview-head.html`. | In use |
| Git + GitHub CLI (`gh`) | Branches, commits and pull requests. Repo: `wah-ag/flex-ds`. Branches: `main` (production), `staging` (component branches merge here first), `component/<name>`. | In use |
| Airtable | The registry: base `Flex-DS`. Records the evidence for each component; the `Development` formula derives its status from that evidence. | In use |
| Vercel | Hosts the staging and production Storybook. Project `flex-ds` in team `design-rules-the-world` (Hobby), built with `npm run build-storybook` into `storybook-static`. Every push to `staging` or `main` deploys. Staging: `https://flex-ds-git-staging-design-rules-the-world.vercel.app`, protected by Vercel Authentication (Standard Protection). Production: `https://flex-ds-sigma.vercel.app`, public. Standard Protection also protects the one-off deployment URLs (`flex-<hash>-….vercel.app`), so a Production Storybook link must use the production domain. | In use |

Don't add a tool or dependency that isn't on this list without a human
agreeing to it first. If the existing stack already solves the problem, use it.

## Token pipeline

```
Figma  →  tokens/*.tokens.json  →  npm run build:tokens  →  build/
(edit here)  (Figma export, never edited)   (build-tokens.js)      (generated, gitignored)
```

`tokens/` holds one file per collection and mode, listed in `tokens/manifest.json`:

| Collection | Modes | File |
| --- | --- | --- |
| core | value | `core.value.tokens.json` |
| semantic-color | on-light, on-dark | `semantic-color.on-light.tokens.json`, `semantic-color.on-dark.tokens.json` |
| semantic-scale | web, mobile, back-office | `semantic-scale.web.tokens.json`, `semantic-scale.mobile.tokens.json`, `semantic-scale.back-office.tokens.json` |
| Styles | — | `typography.styles.tokens.json`, `effects.styles.tokens.json` |

`build-tokens.js` converts Figma's formats before Style Dictionary runs:
colour objects become hex (or `rgba()` when alpha < 1), dimensions become
strings with units, font-weight names like `SemiBold` become numbers like
`600`, and bare line-height numbers become `px`.

It writes three platforms:

| Platform | Output | Contains |
| --- | --- | --- |
| CSS | `build/css/tokens.css` | `:root` — core, on-light colour, web scale, typography and effects |
| CSS | `build/css/tokens-dark.css` | `[data-theme="dark"]` — only the colours that change in on-dark |
| CSS | `build/css/tokens-back-office.css` | `[data-scale="back-office"]` — only the sizes that change in back-office |
| iOS | `build/ios/Tokens.swift` | Mobile scale and colours (no typography or shadow) |
| Android | `build/android/colors.xml` | Colours only |

The mobile scale ships only to iOS and Android; there is no mobile CSS file.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Installs dependencies. |
| `npm run build:tokens` | Rebuilds `build/` from `tokens/`. Run it after every token export. |
| `npm run check:tokens` | Reports mode gaps and opaque `a`-suffixed tokens. Read-only; exits 1 on a problem. |
| `npm run storybook` | Rebuilds tokens, then runs Storybook on http://localhost:6006. |
| `npm run build-storybook` | Rebuilds tokens, then builds the static Storybook into `storybook-static/` (gitignored). This is what Vercel builds. |
| `node scripts/security-check.mjs [dir ...]` | The security gate: credentials, private IDs and env leakage in build output, npm audit, dirty tree. `--live <url> --expect public\|protected` checks a deployment. No dependencies; exits 1 on a finding. See the `security-check` skill. |
| `git switch -c <branch>` | Starts work on a new branch. Never work on `main`. |
| `gh pr create` | Opens a pull request. A human reviews and merges it, except the two merges `CLAUDE.md` delegates. |

## Agent roles and their tools

Each role holds only the tools it needs. A role that can't edit can't
accidentally edit.

| Role | Tools | Can | Can't |
| --- | --- | --- | --- |
| Engineer | Read, Glob, Grep, Edit, Write, Bash | Build and fix components, stories and build scripts. | Edit `tokens/` or `build/`. Verify or approve its own work. |
| QA | Read, Glob, Grep, Bash | Run the build and Storybook, test every variant and state, report what it finds. | Edit any file. Fix what it finds. |
| `token-runner` | Bash, Read | Put the export on `tokens-update`, run `build:tokens` and `check:tokens`, summarise the token diff in designer language, push `tokens-update` and open or update its PR. | Edit any file, token or otherwise. Push to any branch but `tokens-update`. |
| Human | Everything | Approve and merge pull requests. | — |

### Blocked for every agent

- `git push` to `main`.
- Merging any pull request (`gh pr merge`, merging in the GitHub UI), except
  the two merges `CLAUDE.md` delegates: the Developer merging its own
  component branch into `staging`, and DevOps merging a human-approved
  component branch into `main`.
- Writing to `tokens/` or `build/` by any route: Edit, Write, `sed`, shell
  redirects, or a script.
- Installing a new dependency without a human agreeing to it.

## Reporting a token diff

`token-runner` describes changes the way a designer would read them, one line
per token:

- Brand blue 600 got darker, `#3676E0` → `#3260AC`
- New token: `color-border-brand-secondary` (on-light and on-dark)
- Missing mode: `spacing-padding-xl` exists in `web` but not in `mobile` — design gap

Never write "line 47 changed".
