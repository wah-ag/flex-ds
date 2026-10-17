<!-- DRAFT for the owner's review (2026-10-13). Every statement below is taken
from package.json, src/index.ts, scripts/build-css.mjs, CLAUDE.md or tools.md.
The first paragraph is the docs site's hero line (astro-page skill). -->

# Flex DS

Flex DS is a design system: tokens exported from Figma, and React components built on them.

## Install

```bash
npm install @design-rules-the-world/flex-ds
```

React 19 is a peer dependency: install `react` and `react-dom` `^19.3.0`
alongside it.

## Set up

Load the two stylesheets once, at the app root:

```js
import '@design-rules-the-world/flex-ds/tokens.css';
import '@design-rules-the-world/flex-ds/styles.css';
```

- `tokens.css` carries every design token, with the dark and back-office
  modes scoped to their attributes.
- `styles.css` carries every component's styles.

The typography tokens name two families, Sora and DM Sans. Load them from
the Google Fonts CDN; the package does not ship font files.

## Use

```jsx
import { <Component> } from '@design-rules-the-world/flex-ds';
```

A component is exported only once it has passed its release review, so the
package's exports are the components that are ready to use. Each one's props
are documented on the docs site and in Storybook.

### Dark mode and back office

Set an attribute on an ancestor and the tokens follow through the cascade:

```html
<html data-theme="dark">          <!-- dark colours -->
<html data-scale="back-office">   <!-- back-office type scale -->
```

The attribute is the only switch: components never read the theme in
JavaScript.

## Documentation

- Docs site: https://flex-ds-docs.vercel.app
- Storybook: https://flex-ds-sigma.vercel.app

## Versioning

Flex DS follows Semantic Versioning under its `0.x` rules. See
[docs/versioning.md](docs/versioning.md).

## License

ISC
