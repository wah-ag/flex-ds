# DescriptionItem — prop names (for review)

DescriptionItem is the Figma component `CardContent/DescriptionItem`, node
**269:447** (variants `category=check`, 269:446, and `category=uncheck`,
269:445). It is built on `component/description-item` as
`src/components/DescriptionItem/`.

## Rebuild from 269:447 (owner ruling, 2026-10-10)

The Designer replaced the earlier node 124:826, which no longer exists in
Figma, with 269:447. The owner ruled that 269:447 is the source of truth, and
that where it differs from the earlier code or rulings, 269:447 wins:

- **`alignPosition` is removed.** 269:447 has no `align position`
  property. The horizontal and vertical layouts built from 124:826 are gone.
- **Flex-wrap layout.** The row wraps, as Figma's frame does. The Label sits
  beside the description while both fit on the line, and moves to its own
  line under it when they do not.
- **The description wraps** onto as many lines as it needs. This replaces the
  earlier one-line ellipsis ruling.

## Figma properties

| Figma property | Prop | Values |
| --- | --- | --- |
| `category` (variant: `check`, `uncheck`) | `category` | `'check'` (default) or `'uncheck'` |
| description text (text) | `descriptionText` | string (default `"Own end-to end product design from research to shipped something"`, as in Figma) |

No prop is renamed. The names are as the Figma MCP reports them. Their exact
spelling in the Figma panel could not be read through the API, so the
Designer should confirm them.

## Props with no Figma property (proposed, for review)

| Prop | What it does | Why this name |
| --- | --- | --- |
| `labelText` | The text of the imported Label (default `"In 74% of posts"`). | Label's own prop is `labelText`; the same name passes straight through. Figma exposes no property for it on DescriptionItem. |
| `onCategoryChange` | Called as `onCategoryChange(nextCategory, event)` when the checkbox is toggled, with `nextCategory` `'check'` or `'uncheck'`. | It is the change callback for the `category` prop, in React's `on<Prop>Change` form, and it hands back a Figma variant value rather than a boolean. |

Other HTML attributes pass through to the wrapping `<div>`.

## Composition

DescriptionItem imports, unchanged:

- `Label` (Figma instances 269:427 / 269:439) as `category="brand"`,
  `size="md"`, `showIcon={false}`, at its own hug width.

The checkbox is drawn inline with Lucide `Square` and `SquareCheck` (no
shared Checkbox component yet). DescriptionItem has no subcomponent and no
code-only subcomponent.

## Rulings still standing (2026-10-10, not contradicted by 269:447)

1. **Variant names win.** `category="check"` is ticked and
   `category="uncheck"` is empty. In 269:447 the glyphs are still swapped
   (269:446 `check` draws `checkbox-unchecked`; 269:445 `uncheck` draws
   `checkbox-checked`). **Figma-side gap:** the Designer swaps the glyphs.
2. **Interactive, controlled toggle.** A native `<input type="checkbox">`
   over the glyph, keyboard-operable (Space toggles). Only the checkbox
   toggles: the description, the Label and the row do nothing. The checkbox
   is named by the description through `aria-labelledby`. The parent owns
   `category` and hears `onCategoryChange`.
3. **No interaction states.** No hover, press, focus or disabled styling is
   built. The browser's own focus ring shows on the checkbox.
4. Glyph size `--size-icon-lg` (24 on web, 20 in back office, accepted);
   stroke `--border-width-icon-bold`; colours as Figma binds them:
   `--icon-neutral-primary` empty, `--icon-interactive-brand-idle` ticked.
5. **Fill width.** The row fills its parent. Figma's fixed 684 (frame) and
   504 (description column) are unbound and not built.
6. DM Sans optical size: the browser renders the 16px description at `opsz`
   16 and the 12px Label at `opsz` 12, against Figma's `opsz` 14. Accepted.

## Open gaps for owner and Designer review

These are listed for review. None is hard-coded, and no token was invented.

1. **Unbound 46 gap** between the description and the Label (Figma
   `gap-x 46` in both variants). Built: at least `--spacing-gap-lg`, as the
   earlier ruling says.
2. **Unbound 4 gap between wrapped lines**, in `uncheck` (269:445) only;
   `check` (269:446) has none. Built: no row gap, as no variable is bound.
   The Designer should bind one value in both variants, or remove it.
3. **Label indent bound to `spacing/gap/2xl`.** That is 32 on web, which
   equals the 24 glyph plus the 8 gap, but 18 in back office, against 20 + 6
   = 26, so the Label would sit out of line there. Built:
   `calc(var(--size-icon-lg) + var(--spacing-gap-sm))` (owner correction,
   2026-10-10), which lines up in every scale. **Figma-side gap:** the
   Designer rebinds it or accepts the code.
4. **Fixed 504 description column.** In Figma, the 504 width makes the
   description wrap while the Label still sits beside it. With fill width and
   no bound width, the code keeps the Label beside the description only while
   the description fits on one line next to it. Otherwise the Label wraps to
   its own line and the description takes the full width. A bound width or
   minimum width would let the code match Figma here.
5. **Glyphs swapped** (ruling 1 above). This is still open in Figma.
6. **Label vertical alignment.** Figma top-aligns the Label slot
   (`items-start`), so the 24 Label sits at the top of the 32 checkbox row
   instead of centred on it. Built as Figma draws it.

## Tokens used

| Figma variable | Built token |
| --- | --- |
| `body/lg` (text style) | `--body-lg` |
| `text/neutral/base` | `--text-neutral-base` |
| `spacing/gap/sm` | `--spacing-gap-sm` |
| `spacing/padding/xs` | `--spacing-padding-xs` |
| `icon/neutral/primary` | `--icon-neutral-primary` |
| `icon/interactive/brand-idle` | `--icon-interactive-brand-idle` |
| (unbound, owner ruling) glyph size | `--size-icon-lg` |
| (unbound, owner ruling) glyph stroke | `--border-width-icon-bold` |
| (unbound 46, owner ruling) minimum gap before the Label | `--spacing-gap-lg` |
| `spacing/gap/2xl` (Label indent) | not used: `calc(--size-icon-lg + --spacing-gap-sm)`, owner correction |

The Label's own tokens (`label/md`, `spacing/padding/sm`,
`spacing/padding/xxs`, `spacing/gap/xs`, `background/accent/secondary-idle`,
`text/interactive/secondary-idle`, `border-radius-rounded`) come with the
imported Label.
