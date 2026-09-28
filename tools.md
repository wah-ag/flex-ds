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
| Storybook | Documents every component, variant and state. Stories read `build/css/*.css`. | Planned |
| Lucide | The only icon set. Import icons by name from the Lucide package (e.g. `lucide-react`). | Planned |
| Google Fonts | Loads the typefaces used by the typography tokens, from the Google Fonts CDN. | Planned |
| Git + GitHub CLI (`gh`) | Branches, commits and pull requests. Repo: `wah-ag/flex-ds`. | In use |

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
| `git switch -c <branch>` | Starts work on a new branch. Never work on `main`. |
| `gh pr create` | Opens a pull request. A human reviews and merges it. |

## Agent roles and their tools

Each role holds only the tools it needs. A role that can't edit can't
accidentally edit.

| Role | Tools | Can | Can't |
| --- | --- | --- | --- |
| Engineer | Read, Glob, Grep, Edit, Write, Bash | Build and fix components, stories and build scripts. | Edit `tokens/` or `build/`. Verify or approve its own work. |
| QA | Read, Glob, Grep, Bash | Run the build and Storybook, test every variant and state, report what it finds. | Edit any file. Fix what it finds. |
| `token-runner` | Bash, Read | Branch, run `npm run build:tokens`, summarise the token diff in designer language, open a PR. | Edit any file, token or otherwise. |
| Human | Everything | Approve and merge pull requests. | — |

### Blocked for every agent

- `git push` to `main`, and merging any pull request (`gh pr merge`, merging
  in the GitHub UI).
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
