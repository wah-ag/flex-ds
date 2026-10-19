---
title: Developing with Flex DS
description: Install the package, load its styles, use a component.
---

## Install

```bash
npm install @design-rules-the-world/flex-ds
```

React 19 is a peer dependency: install `react` and `react-dom` `^19.3.0` alongside it.

```bash
npm install react@^19.3.0 react-dom@^19.3.0
```

The package's one dependency is `lucide-react`.

## Set up

Load the two stylesheets once, at the app root:

```js
import '@design-rules-the-world/flex-ds/tokens.css';
import '@design-rules-the-world/flex-ds/styles.css';
```

- `tokens.css` carries every design token, with the dark and back-office modes scoped to their attributes.
- `styles.css` carries every component's styles.

The typography tokens name two families, Sora and DM Sans. Load them from the Google Fonts CDN; the package does not ship font files.

## Use

```jsx
import { ButtonCTA } from '@design-rules-the-world/flex-ds';
```

A component is exported only once it has passed its release review, so the package's exports are the components that are ready to use. In `0.1.0` that is the eleven on [All components](/components/). Each page's **Code** tab lists its props, their defaults and the published type.

## Types

The package ships declarations (`dist/index.d.ts`) generated from the components' source. They are loose: variant props are typed `string`, and some props are declared required although the component works without them. The **Code** tab of each component shows the declaration as published.

## Dark mode and back office

Set an attribute on an ancestor and the tokens follow through the cascade:

```html
<html data-theme="dark">          <!-- dark colours -->
<html data-scale="back-office">   <!-- back-office type scale -->
```

The attribute is the only switch: components never read the theme in JavaScript. See [Theming](/styling/theming/).

<small class="flex-source">Source: <a href="https://github.com/wah-ag/flex-ds/blob/b1331577568ee489ba0ad1bd58392e73ee9d700d/README.md">README.md</a>; <a href="https://github.com/wah-ag/flex-ds/blob/b1331577568ee489ba0ad1bd58392e73ee9d700d/package.json">package.json</a> (exports, dependencies, peerDependencies); <a href="https://github.com/wah-ag/flex-ds/blob/b1331577568ee489ba0ad1bd58392e73ee9d700d/src/index.ts">src/index.ts</a>; <code>dist/index.d.ts</code> as <code>npm run build:lib</code> writes it at b133157.</small>
