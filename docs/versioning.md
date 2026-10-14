# Versioning

> **Draft for the owner's review.** Release-review gate 7 reads this file.
> It counts only once a human has merged it.

`@wah-ag/flex-ds` follows [Semantic Versioning 2.0.0](https://semver.org/),
under its rules for `0.x` versions. The package is `0.x` until the owner
decides it is `1.0.0`; nothing in the pipeline moves it there.

## What each part means while `0.x`

A version reads `0.MINOR.PATCH`.

| Bump | When | Examples |
| --- | --- | --- |
| **MINOR** (`0.1.0` → `0.2.0`) | Anything a consumer may have to change code for, and any new component. | A new component exported from `src/index.ts`. A prop renamed, removed, or given a new required value. A prop's union losing a value. A component removed or renamed. A semantic token renamed or removed. |
| **PATCH** (`0.2.0` → `0.2.1`) | Anything a consumer gets without changing code. | A bug fix that makes a component match Figma. A token's value changed with its name kept. A new optional prop, or a new value added to a prop's union. Docs, README or types-only fixes. |

The highest change in a release decides the bump. One MINOR change makes the
whole release MINOR.

## Classifying a component in a release

Each component in a release is one of:

- **New**: first time it is exported. MINOR.
- **Breaking**: a change in the MINOR row above. MINOR.
- **Changed**: a change in the PATCH row only. PATCH.
- **Unchanged**: nothing under its folder changed since the last tag.

The release-review report names the class and the specific change behind it
(gate 7). DevOps's version proposal names the change that forces the bump.

## What is versioned

- Component props, their types and defaults: the documented API.
- The exported names in `src/index.ts`.
- Semantic token names in the shipped CSS. Core primitives are not part of
  the API; components never use them.

## Deprecating

A prop or component is marked deprecated in one release, with its
replacement named in the changelog's *Deprecated* section, before it is
removed in a later MINOR release.

## Tags

Each published version is tagged `v<version>` by `npm run release:publish`.
