---
title: Versioning
description: How Flex DS numbers its releases.
---

<p class="flex-notice"><code>docs/versioning.md</code> is marked <em>"Draft for the owner's review"</em> at the pinned commit. This page says what it says, and no more.</p>

`@design-rules-the-world/flex-ds` follows [Semantic Versioning 2.0.0](https://semver.org/), under its rules for `0.x` versions. The package stays `0.x` until the owner decides it is `1.0.0`.

## What each part means while `0.x`

A version reads `0.MINOR.PATCH`.

| Bump | When |
| --- | --- |
| **MINOR** (`0.1.0` → `0.2.0`) | Anything a consumer may have to change code for, and any new component: a new component exported from `src/index.ts`; a prop renamed, removed, or given a new required value; a prop's union losing a value; a component removed or renamed; a semantic token renamed or removed. |
| **PATCH** (`0.2.0` → `0.2.1`) | Anything a consumer gets without changing code: a bug fix that makes a component match Figma; a token's value changed with its name kept; a new optional prop, or a new value added to a prop's union; docs, README or types-only fixes. |

The highest change in a release decides the bump. One MINOR change makes the whole release MINOR.

## What is versioned

- Component props, their types and defaults: the documented API.
- The exported names in `src/index.ts`.
- Semantic token names in the shipped CSS. Core primitives are not part of the API; components never use them.

## Deprecating

A prop or component is marked deprecated in one release, with its replacement named in the changelog's *Deprecated* section, before it is removed in a later MINOR release.

## Tags

Each published version is tagged `v<version>` by `npm run release:publish`. The [Changelog](/changelog/) is generated from those tags.
