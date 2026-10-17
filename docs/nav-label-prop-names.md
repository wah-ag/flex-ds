# NavLabel — prop names, owner rulings and gaps (for review)

NavLabel is the Figma component set `Header/NavLabel`, node 55:34, with three
variants: `state=idle` (191:1243, formerly 55:31), `state=hover` (55:32) and
`state=active` (55:33). It is built on `component/nav-label` as `src/components/NavLabel/`.

## Props

| Figma property | Prop | Default |
| --- | --- | --- |
| `state` (variant: idle, hover, active) | `state` | `idle` |
| `navLabelText` (text) | `navLabelText` | `Nav Label` |
| `showNavLine` (boolean) | `showNavLine` | `true` |

The Figma MCP reports the text and boolean properties as `navLabelText` and
`showNavLine`. Their exact spelling in the Figma panel was not readable
through the API and should be confirmed by the Designer.

Figma has no `size` property, and NavLabel has no `size` prop.

### Rename `type` → `state` (applied, 2026-10-17)

| Old name | New name | Values |
| --- | --- | --- |
| `type` | `state` | `idle`, `hover`, `active` (unchanged) |

The variant property used to be called `type`. This write-up suggested
`state` instead: it holds idle, hover and active, which are states; `state`
is the name Label, TextArea and the other components already use for the
same idea; and it does not shadow the `<a>` element's own HTML `type`
attribute (a MIME-type hint for the link target). The suggestion was never
decided, and the first release review (PR #198, at `c08b62f`) was Blocked
on it.

On 2026-10-17 the owner decided the rename and changed it in Figma. Node
55:34 now names the property `state`, with the variants `state=idle`
(191:1243), `state=hover` (55:32) and `state=active` (55:33). The prop and
the `data-state` attribute on the `<a>` (formerly `data-type`) follow Figma.
The values, the visuals and the bound variables are unchanged.

NavLabel no longer consumes `type`. A caller's `type` now passes through to
the `<a>` like any other HTML attribute, so callers that still pass the old
`type` prop must change to `state`. On 2026-10-17 that is
`src/components/NavItems/NavItems.jsx` (`type="idle"`), whose change belongs
to NavItems' own round.

### Not from Figma

The link's own HTML attributes (`href`, `onClick`, `target`, `rel`,
`aria-current`, ...) pass through to the `<a>`. NavLabel needs an `href` to
be a real, focusable link. `state="active"` sets `aria-current="page"` unless
the caller passes its own `aria-current`.

## `state` values

| Figma `state` | Real input | Text colour | Underline |
| --- | --- | --- | --- |
| `idle` | At rest. | `text-neutral-primary` | slot kept, not painted, when `showNavLine` |
| `hover` | Pointer over the link. | `text-interactive-brand-idle` | slot kept, not painted, when `showNavLine` |
| `active` | The current page. | `text-interactive-brand-idle` | painted when `showNavLine` |

Passing `hover` as `state` pins the hover look, for review.

### Hover design change (2026-10-14)

The owner changed hover in Figma so that the underline bar is invisible. In
55:32 the Nav Underline layer (55:27) is still visible and still takes its
4-high slot in the auto layout, but it has no fill. Nothing else changed:
text colour, type style, padding, gap and height are unchanged, and active
still paints the bar. In code, the hover bar keeps `display: block`, so the
slot keeps its space and the text sits where it does on active, and gets
`visibility: hidden`, so nothing is painted. No colour value is involved, so
no token is needed. On an active link under a real pointer, the bar stays
painted. This supersedes "hover and active stay visually identical" in
ruling 4 below.

### Idle keeps the empty slot (owner ruling, 2026-10-14)

With hover keeping the slot and idle dropping it, the text moved up on a
real hover with nothing appearing. The owner ruled "option a, idle keeps
the empty slot". This supersedes the 2026-10-08 ruling, under which idle
dropped its slot (`display: none`) and its text sat about 4px lower than
Figma draws it.

Idle now matches Figma's idle variant 191:1243 (Nav Underline 191:1245, 4
high, no fill). The slot is laid out whenever `showNavLine` is on, in every
state, with `visibility: hidden`, and only active paints it. The text sits
at the same height in idle, hover and active, so nothing jumps on hover.
With `showNavLine` off, no slot exists in any state.

### Text position (owner ruling, 2026-10-14, option a)

Figma's Label layers (idle 191:1244, hover 55:26, active 55:20) are 24-high
line boxes, packed to the bottom of the justify-end frame: 48 - 4 (slot) -
8 (gap) - 24 = y 12. The code used to stretch the text slot over the 28 px
below the padding and centre the line in it, so the text sat at y 10, 2 px
high, in every state. QA failed the hover row on this, and the owner chose
option a, a code fix: the text slot now hugs its `--title-md` line box, and
the frame's flex-end puts it at y 12 in idle, hover and active, with the
underline slot at y 44. Nothing jumps on hover.

With `showNavLine` off, there is no slot, and Figma's auto layout (Nav
Underline hidden, justify end) puts the 24-high text at the bottom, y 24.
The code now does the same. Before this change it centred the text at y 16.

## Owner rulings (2026-10-04)

An earlier build stopped on these gaps. The owner accepted all of them on
2026-10-04 as exceptions:

1. **Underline height.** Figma draws it 4 high with no variable bound, and no
   token exists. It is used as drawn, as a plain value with a code comment.
   No core primitive (such as `--scale-2`) stands in for it.
2. **Underline top-left radius.** Figma leaves it unbound at 4. It is used as
   drawn. The top-right corner keeps `border-radius-control-2xs`.
3. **Width.** No token exists. The label hugs its content. Figma's 89 is
   only the width of the default text and is not used.
4. **States.** Figma designs no focused, pressed or disabled state, and none
   is invented. Focus keeps the browser's default outline so keyboard users
   can see it. (Hover and active were visually identical at the time;
   superseded by the 2026-10-14 hover change above.)
5. **Variable name.** Figma's radius variable reports its name as
   `var(--border-radius-control-2xs)`, not in the slash form the other
   variables use. It is accepted, and the built token
   `--border-radius-control-2xs` is used. The Designer may want to rename the
   variable to `border-radius/control/2xs` to match the rest.

## Tokens used

| Figma variable | Built token |
| --- | --- |
| `size/control/lg` | `--size-control-lg` |
| `spacing/padding/sm` | `--spacing-padding-sm` |
| `spacing/gap/sm` | `--spacing-gap-sm` |
| `title/md` (text style) | `--title-md` |
| `text/neutral/primary` | `--text-neutral-primary` |
| `text/interactive/brand-idle` | `--text-interactive-brand-idle` |
| `background/interactive/brand-idle` | `--background-interactive-brand-idle` |
| `var(--border-radius-control-2xs)` | `--border-radius-control-2xs` |
