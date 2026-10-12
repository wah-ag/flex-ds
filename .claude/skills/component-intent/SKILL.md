---
name: component-intent
description: Writing {component}.intent.json beside each flex-ds component — when to use it, when not to, what each variant is for, where it sits, what it pairs with, which tokens it needs and its accessibility contract — transposed from the component's Figma documentation page, its code and its stories, in that order. Used by doc-generator (Job A) when writing or refreshing an intent file.
---

# component-intent

An intent file tells a reader, human or agent, when to reach for a component
and how. It is read by things that cannot check it. So every sentence in it
is carried over from a source, never written fresh. **A plausible sentence is
worse than an empty field**, because nothing downstream can tell it is wrong.

## The file

One file per component, beside it:
`src/components/<Name>/<Name>.intent.json`. A subcomponent with its own
folder gets its own file.

```json
{
  "component": "ButtonCTA",
  "figma": "https://www.figma.com/design/<file>?node-id=16-438",
  "use_when": [
    { "text": "…", "source": "Figma 16:500 (Usage › When to use)" }
  ],
  "dont_use_when": [
    { "text": "…", "source": "Figma 16:500 (Usage › When not to use)" }
  ],
  "variant_intent": {
    "variant": {
      "primary": { "text": "…", "source": "Figma 16:500 (Usage › Best practice)" },
      "secondary": null
    }
  },
  "placement": [
    { "text": "…", "source": "src/components/<Parent>/<Parent>.stories.jsx:<line>" }
  ],
  "pairs_with": [
    { "component": "<Name>", "source": "src/components/<Name>/<Name>.jsx:<line>" }
  ],
  "required_tokens": [
    "--<token-name-from-build>"
  ],
  "a11y": [
    { "text": "…", "source": "src/components/ButtonCTA/ButtonCTA.jsx:<line>" }
  ]
}
```

- Every entry carries its `source`: a Figma node ID with the region it came
  from, or a file path and line. An entry without a source is deleted.
- An empty field is `[]` (or `null` for one variant value). Never a
  placeholder string, never `"TBD"`, never a sentence saying it is empty.

## Sources, in order

Each field has one source. A lower source never fills a field a higher one
owns, and never fills a gap the higher one left.

### 1. The Figma documentation page — `use_when`, `dont_use_when`

- Find the component's page from the Figma link at the top of its stories
  file. Read it with `get_metadata`, `get_design_context` and
  `get_screenshot`. Figma is read-only here: no `use_figma`.
- Find the **usage region**: the frames that carry when to use, when not to
  use, and best practice.
- **Transpose faithfully.** One bullet in Figma is one entry. Keep the
  Designer's wording; fix only obvious typos and line-break artefacts. Do not
  merge, shorten, generalise or reorder bullets, and do not paraphrase into
  something vaguer. "Use for the single main action on a card" stays exactly
  that; it never becomes "use for important actions".
- Best-practice bullets about one variant go to that variant in
  `variant_intent`. Best-practice bullets about the whole component go to
  `use_when` or `dont_use_when`, as the Designer phrased them (a "Do" is
  `use_when`, a "Don't" is `dont_use_when`). A bullet that is neither stays
  out of the file and is reported.
- **No usage region:** `use_when` and `dont_use_when` are `[]`, and the
  component goes on the gap list. Do not borrow usage from a sibling
  component, a story description, the code or general knowledge.

### 2. The code — `required_tokens`, `variant_intent`

- `required_tokens`: every `var(--…)` the component's own CSS and JSX
  reference, sorted, each one confirmed present in `build/css/*.css` (run
  `npm run build:tokens` first). Tokens that belong to a composed component
  stay in that component's file. A referenced token missing from the build is
  a token gap: report it, do not drop it silently.
- `variant_intent`: the keys are the component's props that select a variant,
  and their values, exactly as the code spells them (which is Figma's
  spelling). The meaning of each value comes from the Figma usage region
  (source 1). If Figma says nothing about a value, it is `null`. A prop name
  or a class name is not a statement of intent.

### 3. The stories — `placement`, `pairs_with`

- `placement`: where the stories actually mount the component — which parent
  component's story renders it, and in which slot or position. Only what a
  story shows.
- `pairs_with`: components rendered beside it in a story, and components that
  import it (`grep` `src/components/` for the import). Name each one by its
  folder name.
- A component no story places and nothing imports has `[]` for both.

### `a11y`

From the Figma usage region if it carries accessibility notes, transposed
like source 1. Otherwise only what the code demonstrably does: the native
element rendered, the roles and `aria-*` attributes it sets, how disabled is
expressed, and keyboard behaviour that comes from the element itself. Never a
recommendation, never a WCAG claim nobody measured.

## The gap list

Report at the end of the run, one line per gap, never written into the
intent file:

- **No usage region** — component, its Figma page node.
- **Usage bullet with no field** — the bullet, verbatim, and its node.
- **Token gap** — a token the code references that the build lacks.
- **Variant with no stated intent** — component, prop, value.

## Check

- Every non-empty field entry has a `source`, and each source opens to the
  text it is quoted from.
- Every `use_when` and `dont_use_when` entry can be found word for word in the
  Figma usage region, apart from typo fixes.
- Every token in `required_tokens` exists in `build/css/`.
- The file parses (`node -e "JSON.parse(require('fs').readFileSync(p))"`).

## Never

- Never invent a product rule, and never fill a field to make the file look
  complete.
- Never paraphrase the Designer into something vaguer.
- Never fill `use_when` or `dont_use_when` from code, stories or general
  knowledge.
- Never write a token name from memory; take it from the code and confirm it
  in `build/css/`.
- Never edit Figma, the component, its stories or `tokens/` to make an intent
  file easier to write.
