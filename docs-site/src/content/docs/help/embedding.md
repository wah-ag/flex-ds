---
title: Embedding
description: Embedding a Flex DS story in another page.
---

The production Storybook is public at [flex-ds-sigma.vercel.app](https://flex-ds-sigma.vercel.app). Any story can be embedded by its id, which is in the story's URL after `path=/story/`.

```html
<iframe
  src="https://flex-ds-sigma.vercel.app/iframe.html?id=components-buttoncta--primary-lg-idle&viewMode=story&globals=theme:light"
  title="ButtonCTA, primary lg idle"
></iframe>
```

## Themes and scales

Storybook's toolbar has two globals, and the embed URL can set them:

| Global | Values | Sets on the story's `<html>` |
| --- | --- | --- |
| `theme` | `light` (on-light), `dark` (on-dark) | `data-theme="dark"` for `dark` |
| `scale` | `web`, `back-office` | `data-scale="back-office"` for `back-office` |

The component pages on this site embed their stories this way, once in each theme. The staging Storybook is protected and is never embedded.

<small class="flex-source">Source: <a href="https://github.com/wah-ag/flex-ds/blob/b1331577568ee489ba0ad1bd58392e73ee9d700d/.storybook/preview.js">.storybook/preview.js</a> (globals); <a href="https://github.com/wah-ag/flex-ds/blob/b1331577568ee489ba0ad1bd58392e73ee9d700d/tools.md">tools.md</a> (Vercel).</small>
