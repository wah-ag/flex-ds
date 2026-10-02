# Label — prop names

Label's props are the Figma component properties of node 31:228, in
camelCase, following the convention agreed for ButtonCTA on 2026-09-30
(`docs/button-cta-prop-names.md`). They are proposed here for review.

| Figma property | Prop |
| --- | --- |
| `category` (variant: `brand`, `info`, `success`, `error`, `warning`) | `category` |
| `size` (variant: `lg`, `md`, `sm`) | `size` |
| `state` (variant: `idle`, `hover`) | `state` |
| label text (text, default "Label") | `labelText` |
| show icon (boolean) | `showIcon` |
| instance swap on the icon (default: the "circle" layer) | `swapIcon` |

The Figma MCP reports the text, boolean and instance-swap properties as
`labelText`, `showIcon` and `swapIcon`. Their exact spelling in the Figma
panel was not readable through the API and should be confirmed by the
Designer.

## States: idle and hover only, by owner decision (2026-10-03)

Figma gives Label two states, `idle` and `hover`. It has no press, focus,
disabled or error state. On 2026-10-03 the owner decided this is the
intended, final scope, in their words:

> "I do not need other state and leave it intentionally"

Label is therefore built as a non-interactive tag: a `<span>` that takes no
focus. `hover` comes from a real pointer; passing `state="hover"` pins the
look for review. `state` has no other value.

## Default icon: Lucide `Circle`, to be confirmed

Figma's default icon is a layer named "circle". It is mapped to Lucide
`Circle`. The Designer should confirm the mapping.

## Category to colour role

`brand` uses the `secondary` colour role (`--background-accent-secondary-*`,
`--text-interactive-secondary-idle`, `--icon-interactive-secondary`), and
`error` uses the `danger` role, as Figma binds them. The Designer may want to
confirm that `brand` → `secondary` is intended.
