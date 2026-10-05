# CardContainer — prop names, owner rulings and gaps (for review)

CardContainer is the Figma component set `CardContainer`, node 36:158, with
three variants: `state=idle` (36:157), `state=hover` (36:159) and
`state=active` (36:169). Each variant holds one slot, `card slot`. It is
built on `component/card-container` and composes no other component.

## Props

| Figma property | Prop | Default |
| --- | --- | --- |
| `state` (variant: idle, hover, active) | `state` | `idle` |
| `card slot` (slot) | `children` | none |

Figma has no `size` property, and CardContainer has no `size` prop.

### Suggested name (applied, for review)

| Figma name | Prop | Why |
| --- | --- | --- |
| `card slot` | `children` | A JavaScript prop name cannot contain a space, and React passes slot content as `children`. Every slot in this system maps this way. If the Designer wants a named prop, `cardSlot` is the literal camelCase form. |

### Not from Figma

Any HTML attribute (`id`, `role`, `aria-*`, `onClick`, ...) passes through
to the root `<div>`. `className` is appended to the component's own class.

## Bindings (Figma → build/css)

| Look | Value | Token |
| --- | --- | --- |
| all | background | `--background-neutral-base` |
| all | corner radius | `--border-radius-card` |
| all | padding, vertical | `--spacing-padding-md` |
| all | padding, horizontal | `--spacing-padding-lg` |
| all | gap | `--spacing-gap-xs` |
| idle, hover | stroke width | `--border-width-default` |
| idle, hover | stroke colour | `--border-neutral-base` |
| hover | shadow | `--elevation-level-1` |
| active | stroke width | `--border-width-selected` |
| active | stroke colour | `--border-interactive-brand-idle` |

Figma's stroke is inside the frame and the slot moves in with it (17,13 at
the default width, 18,14 at the selected width), so the padding grows by the
stroke width.

The hover stroke width was bound to the core primitive `border/width/lg`
in an earlier version of the node. The Designer rebound it to
`border-width-default` before this build.

## Owner rulings (2026-10-04)

1. **Width.** Figma's card is a fixed 514 bound to no token. That is not a
   gap. The card fills its container; the stories frame it at 514.
2. **States.** Only idle, hover and active are designed. Focus, pressed and
   disabled are skipped for now, not forgotten.

## Behaviour

- `hover` comes from a real pointer over an idle card. Passing
  `state="hover"` pins the look, for review.
- `active` is held by the product (the card the user has chosen) and is set
  with `state="active"`.
