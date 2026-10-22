---
title: React
description: Flex DS components in a React app.
---

Flex DS components are React components, written as `.jsx` in `src/components/`, one folder each.

## Requirements

- `react` and `react-dom` `^19.3.0`, as peer dependencies.
- `lucide-react`, installed with the package as its dependency.

The package is built for both module systems: `import` resolves to `dist/index.js` and `require` to `dist/index.cjs`, each with its declarations.

## Props

- Prop names are the Figma component property names in camelCase: `buttonLabel`, `leadingIcon`, `swapIcon`.
- Props a component does not name are collected as `...rest` (CardContainer: `...props`) and spread onto an element it renders. For PasswordField, TextArea and TextField that is the field itself (the `<textarea>`, or the input control), not the wrapper with the label; for the others it is the root element.
- `className` is joined onto the root element's own classes.

## Icons

An icon prop such as `swapIcon` takes a component, not an element: pass `ArrowRight`, not `<ArrowRight />`. ButtonCTA, for example, sizes its icon with `--size-icon-md` or `--size-icon-sm` and colours it through `currentColor`, so it follows the text colour of its state.

```jsx
import { ArrowRight } from 'lucide-react';
import { ButtonCTA } from '@design-rules-the-world/flex-ds';

<ButtonCTA buttonLabel="Apply now" swapIcon={ArrowRight} leadingIcon={false} />;
```

## States

Some components take a `state` prop. On ButtonCTA, `disable` and `error` are held states; `hover`, `press` and `focus` happen through real input, and passing them only pins the look. ButtonCTA renders a native `<button>` with `type="button"` by default, so it never submits a form unless asked to.

Each component page lists its own props and values on the **Code** tab.
