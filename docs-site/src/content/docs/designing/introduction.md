---
title: Designing with Flex DS
description: Where the design lives and how it reaches code.
---

Flex DS is a design system: tokens exported from Figma, and React components built on them.

## Figma is the source

- Every token and every mode starts in Figma (variables and styles). The export lands in `tokens/`, and nobody edits those files by hand: a wrong value is fixed in Figma, re-exported and rebuilt.
- Each component has a Figma node, and its page here links to it and embeds it on the **Design** tab.
- A component's props are named as Figma names its component properties. If Figma says `size`, the prop is `size`.

## Three layers of tokens

Tokens are consumed in one direction: core primitives, then semantic roles, then composite styles (typography, elevation). Components use semantic tokens only. The full list is on [Tokens](/tokens/).

Semantic colour names read `<surface>-<group>-<role>-<state>`, for example `text-interactive-brand-idle`:

- Surface: `background`, `text`, `icon`, `border`.
- Group: `neutral`, `interactive`, `accent`.
- State: `idle`, `hover`, `press`, `focus`, `disable`. Some roles have no states (`text-interactive-danger`), and neutral roles name a weight instead (`text-neutral-primary`).

## Modes

Modes come from Figma, and a mode is a file, never a suffix: the same token name resolves differently per mode.

| Collection | Modes |
| --- | --- |
| Semantic colour | `on-light`, `on-dark` |
| Semantic scale | `web`, `mobile`, `back-office` |

A token that exists in one mode and not another is a design gap, and is reported rather than filled in.

## Type and icons

- The typography tokens name two families, Sora and DM Sans.
- Icons come from Lucide only. A design that needs an icon Lucide does not have is reported rather than drawn.

## What each component is for

Each component page's **Usage** tab carries the Designer's own words from the component's Figma documentation frame: when to use it, when not to, and what each variant is for.
