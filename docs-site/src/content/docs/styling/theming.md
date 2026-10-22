---
title: Theming
description: Dark mode and the back-office scale.
---

Flex DS has two switches, and both are attributes on an ancestor element. The tokens follow through the CSS cascade; components never read the theme in JavaScript.

| Attribute | Effect |
| --- | --- |
| `data-theme="dark"` | Semantic colours resolve to their `on-dark` values. |
| `data-scale="back-office"` | The type scale and the sizes that differ resolve to their `back-office` values. |

```html
<html data-theme="dark" data-scale="back-office">
```

## What ships

`@design-rules-the-world/flex-ds/tokens.css` carries every mode the web uses in one file, in this order:

1. `:root`: core primitives, `on-light` colour, the `web` scale, typography and effects.
2. `[data-theme="dark"]`: only the colours that change in `on-dark`.
3. `[data-scale="back-office"]`: only the sizes that change in `back-office`.

There is no mobile CSS: the mobile scale ships only to iOS and Android.

## What to theme with

Use semantic tokens, never core primitives: a component referencing `--color-blue-500` is wrong; it references a semantic role such as `--text-interactive-brand-idle`. Core primitives are not part of the versioned API. Every semantic token and its value per mode is on [Tokens](/tokens/).

This site themes Starlight the same way: its colours map onto Flex DS semantic tokens, and Starlight's own `data-theme="dark"` on `<html>` switches them.
