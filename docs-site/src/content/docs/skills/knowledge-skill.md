---
title: Knowledge skill
description: What Flex DS gives an agent to read.
---

<p class="flex-notice"><strong>Missing source.</strong> The repo at 72ebd95 ships no knowledge skill for consumers. The skills under <code>.claude/skills/</code> are for the agents that build and release Flex DS, not for the apps that use it.</p>

What exists today:

- **Intent files.** Each component has `src/components/<Name>/<Name>.intent.json` beside it: when to use it, when not to, what each variant is for, where it sits, what it pairs with, the tokens it needs and its accessibility facts. Every entry carries the source it was taken from, a Figma node or a file and line. The **Usage** tab of each component page is generated from it.
- The intent files are in the repo, not in the npm package: the package publishes `dist` only.
