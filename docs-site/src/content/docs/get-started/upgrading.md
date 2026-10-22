---
title: Upgrading
description: Moving between Flex DS versions.
---

<p class="flex-notice"><strong>Missing source.</strong> There is nothing to upgrade from yet: <code>v0.1.0</code> is the only release tag at the pinned commit (1e0c77a), so no upgrade notes exist. They will come from the changelog between two tags.</p>

## Install the current release

```bash
npm install @design-rules-the-world/flex-ds@0.1.0
```

React 19 is a peer dependency: install `react` and `react-dom` `^19.3.0` alongside it.

## The package name

The package is published as `@design-rules-the-world/flex-ds`. Install and import that name; it is the only name the package has been published under.

## What a version number tells you

While the package is `0.x`, a MINOR bump (`0.1.0` → `0.2.0`) may need code changes and a PATCH bump does not. See [Versioning](/get-started/versioning/).
