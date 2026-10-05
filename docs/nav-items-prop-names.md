# NavItems — prop names (for review)

NavItems is the Figma component `Header/NavItems`, node 58:406. It is built
on `component/nav-items` as `src/components/NavItems/`.

## Figma properties

None. The Figma MCP reports no component properties, variants or sizes on
58:406, so NavItems has no Figma-named prop and no `size` prop.

## Composition

| Figma instance | Component | As drawn |
| --- | --- | --- |
| 58:394 `Header/NavLabel` | `NavLabel` | `type=idle`, `navLabelText` "Nav Label" |
| 58:395 `IconButton` | `IconButton` | `state=idle`, the default bell (Lucide `BellRing`) |
| 58:396 `IconButton` | `IconButton` | `state=idle`, icon swapped to mail (Lucide `Mail`) |
| 58:397 `Avatar` | `Avatar` | `size=xl`, `category=circle image` |

Each is imported as it is. Nothing of theirs is restyled.

## Proposed props, not from Figma

Figma's instances carry content (the label, the avatar image) and behaviour
(the link's `href`, the buttons' `onClick`) that a product must set. Rather
than invent new names for each, NavItems passes one object straight through
to each child, using that child's own (Figma-named) props:

| Prop | Passed to | Default |
| --- | --- | --- |
| `navLabelProps` | NavLabel | `{ type: 'idle', navLabelText: 'Nav Label' }` |
| `notificationButtonProps` | the bell IconButton | `{ swapIcon: BellRing, 'aria-label': 'Notifications' }` |
| `mailButtonProps` | the mail IconButton | `{ swapIcon: Mail, 'aria-label': 'Mail' }` |
| `avatarProps` | Avatar | `{ size: 'xl', category: 'circle image' }` |

The names follow the Figma layer roles (`Header/NavLabel`, the `notification`
icon, mail, `Avatar`). The Designer may prefer to add instance or text
properties to 58:406 in Figma; if so, the props should follow them.

Other HTML attributes pass through to the wrapping `<div>`.

## States

NavItems has none of its own. Figma designs none for it, and none is
invented. The children's states work through real input inside it: NavLabel
hover (and `type=active` through `navLabelProps`), IconButton hover, press and
`state=disable`. NavLabel's and IconButton's missing focus states are covered
by their own owner rulings (2026-10-04 and IconButton's decision).

## Tokens used

| Figma variable | Built token |
| --- | --- |
| `spacing/gap/lg` | `--spacing-gap-lg` |

Every other bound variable on 58:406 belongs to a child and is resolved in
that child's own CSS.
