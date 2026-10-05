# NavLabel — prop names, owner rulings and gaps (for review)

NavLabel is the Figma component set `Header/NavLabel`, node 55:34, with three
variants: `type=idle` (55:31), `type=hover` (55:32) and `type=active`
(55:33). It is built on `component/nav-label` as `src/components/NavLabel/`.

## Props

| Figma property | Prop | Default |
| --- | --- | --- |
| `type` (variant: idle, hover, active) | `type` | `idle` |
| `navLabelText` (text) | `navLabelText` | `Nav Label` |
| `showNavLine` (boolean) | `showNavLine` | `true` |

The Figma MCP reports the text and boolean properties as `navLabelText` and
`showNavLine`. Their exact spelling in the Figma panel was not readable
through the API and should be confirmed by the Designer.

Figma has no `size` property, and NavLabel has no `size` prop.

### `type` and the HTML `type` attribute

`type` is a valid React prop as spelled, so it is kept. NavLabel renders an
`<a>`, and `<a>` has its own HTML `type` attribute (a MIME-type hint for the
link target). NavLabel consumes `type` and never forwards it, so the
component's `type` never reaches the element, and a caller cannot set the
`<a>`'s HTML `type` through NavLabel.

#### Suggested rename (not applied)

| Figma name | Suggested | Why |
| --- | --- | --- |
| `type` | `state` | It holds idle, hover and active, which are states. `state` is the name Label, TextArea and the other components already use for the same idea, and it does not shadow the HTML `type` attribute. |

The prop keeps the Figma name until the Designer renames the property in
Figma, or a human decides otherwise.

### Not from Figma

The link's own HTML attributes (`href`, `onClick`, `target`, `rel`,
`aria-current`, ...) pass through to the `<a>`. NavLabel needs an `href` to
be a real, focusable link. `type="active"` sets `aria-current="page"` unless
the caller passes its own `aria-current`.

## `type` values

| Figma `type` | Real input | Text colour | Underline |
| --- | --- | --- | --- |
| `idle` | At rest. | `text-neutral-primary` | none |
| `hover` | Pointer over the link. | `text-interactive-brand-idle` | shown when `showNavLine` |
| `active` | The current page. | `text-interactive-brand-idle` | shown when `showNavLine` |

Passing `hover` as `type` pins the hover look, for review. Hover and active
look the same, as drawn.

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
   can see it. Hover and active stay visually identical, as drawn.
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
