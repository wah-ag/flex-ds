# ShotAction — prop names

ShotAction's props are the Figma component properties of node 31:191
(page grouping `Button/`), in camelCase, following the convention agreed for
ButtonCTA on 2026-09-30 (`docs/button-cta-prop-names.md`).

| Figma property | Prop |
| --- | --- |
| `state` (variant: `idle`, `active`) | `state` |

`state` means saved or not saved, as Figma defines it: `idle` shows "Save"
(ButtonCTA `secondary`, outline Lucide `Bookmark`) and `active` shows "Saved"
(ButtonCTA `primary`, Lucide `Bookmark` filled with `currentColor`). Both are
ButtonCTA size `sm` with a leading icon only. Figma has no size, label or icon
property, so ShotAction has none: the labels are fixed.

## The parent owns `state`

By owner decision, ShotAction never flips itself. The parent sets `state`, and
a click calls the native `onClick`. ShotAction sets the native `aria-pressed`
from `state` (`true` when `active`), so assistive technology announces it as a
toggle. These are native attributes, not new props.

## No other interaction states, by owner decision

Figma has only `idle` and `active`. The owner has decided that hover, press,
focus, disabled, destructive and loading are intentionally out of scope, so
ShotAction has no prop for them. Because ShotAction renders ButtonCTA, a
native `<button>`, the browser still applies ButtonCTA's own `:hover`,
`:active` and `:focus-visible` styles on real input.

## Width

By owner decision, the width fits the label, as ButtonCTA does. There is no
width token and no fixed width.

## Passed through to ButtonCTA

Any other attribute (`type`, `className`, `onClick`, `aria-*`) is passed to
ButtonCTA and on to the `<button>`. `type` defaults to `button`, as in
ButtonCTA. ShotAction's own look (`category`, `size`, `buttonLabel`, icons)
cannot be overridden from outside.
