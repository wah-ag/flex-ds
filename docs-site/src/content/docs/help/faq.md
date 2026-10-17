---
title: FAQ
description: Short answers, each from the repo.
---

## Why is a component I see in Storybook not in the package?

A component is exported only once it has passed its release review. Storybook documents every component that is built; the package exports the ones that are ready. Components still waiting are on the [Roadmap](/roadmap/).

## Do I need to load fonts myself?

Yes. The typography tokens name Sora and DM Sans. Load them from the Google Fonts CDN; the package does not ship font files.

## How do I switch to dark mode?

Put `data-theme="dark"` on an ancestor, usually `<html>`. See [Theming](/styling/theming/).

## Is there a mobile stylesheet?

No. The mobile scale ships only to iOS and Android; the web CSS carries `web` and `back-office`.

## Can I use a core colour token such as `--color-navy-500`?

Components use semantic tokens only, and core primitives are not part of the versioned API, so they can change in any release.

## Which icon set does Flex DS use?

Lucide, through `lucide-react`, and no other.

## Why do the TypeScript types accept any string for `size` or `state`?

The declarations are generated from the components' JavaScript source, so variant props are typed `string`. The accepted values are listed on each component's **Code** tab.

<small class="flex-source">Source: <a href="https://github.com/wah-ag/flex-ds/blob/b1331577568ee489ba0ad1bd58392e73ee9d700d/README.md">README.md</a>; <a href="https://github.com/wah-ag/flex-ds/blob/b1331577568ee489ba0ad1bd58392e73ee9d700d/src/index.ts">src/index.ts</a>; <a href="https://github.com/wah-ag/flex-ds/blob/b1331577568ee489ba0ad1bd58392e73ee9d700d/CLAUDE.md">CLAUDE.md</a>; <a href="https://github.com/wah-ag/flex-ds/blob/b1331577568ee489ba0ad1bd58392e73ee9d700d/docs/versioning.md">docs/versioning.md</a>; <a href="https://github.com/wah-ag/flex-ds/blob/b1331577568ee489ba0ad1bd58392e73ee9d700d/tsconfig.json">tsconfig.json</a> and <a href="https://github.com/wah-ag/flex-ds/blob/b1331577568ee489ba0ad1bd58392e73ee9d700d/tsup.config.js">tsup.config.js</a>.</small>
