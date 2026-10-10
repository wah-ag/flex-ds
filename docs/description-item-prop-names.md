# DescriptionItem — prop names (for review)

DescriptionItem is the Figma component `CardContent/DescriptionItem`, node
124:826. It is built on `component/description-item` as
`src/components/DescriptionItem/`.

## Figma properties

| Figma property | Prop | Values |
| --- | --- | --- |
| `category` (variant: `check`, `uncheck`; Figma also has `category3`, `category4`, see below) | `category` | `'check'` (default) or `'uncheck'` |
| `align position` (variant: `horizontal`, `vertical`) | `alignPosition` | `'horizontal'` (default) or `'vertical'` |
| description text (text) | `descriptionText` | string (default `"Own end-to end product design from research to shipped UI"`) |

The names are as the Figma MCP reports them. Their exact spelling in the
Figma panel could not be read through the API, so the Designer should
confirm them.

**Renamed: `align position` → `alignPosition`** (owner, 2026-10-10). Figma's
property name has a space, which cannot be a React prop. `alignPosition` is
the camelCase form, as for every other multi-word property here. No other
prop was renamed.

## Props with no Figma property (proposed, for review)

The owner asked for both on 2026-10-10 and for their names to be written up
here.

| Prop | What it does | Why this name |
| --- | --- | --- |
| `labelText` | The text of the imported Label (default `"In 74% of posts"`). | Label's own prop is `labelText`; the same name passes straight through. Figma exposes no property for it on DescriptionItem. |
| `onCategoryChange` | Called as `onCategoryChange(nextCategory, event)` when the checkbox is toggled, with `nextCategory` `'check'` or `'uncheck'`. | It is the change callback for the `category` prop, in React's `on<Prop>Change` form, and it hands back a Figma variant value rather than a boolean. |

Other HTML attributes pass through to the wrapping `<div>`.

## Composition

DescriptionItem imports, unchanged:

- `Label` (Figma instance 124:808 / 124:819) as `category="brand"`,
  `size="md"`, `showIcon={false}`, at its own hug width.

The checkbox is drawn inline with Lucide `Square` and `SquareCheck` (owner
ruling, 2026-10-10: no shared Checkbox component yet). It has no
subcomponent.

## Owner rulings, 2026-10-10

1. **Variant names win.** `category="check"` is ticked and
   `category="uncheck"` is empty. In Figma the glyphs are swapped
   (`category=check`, 124:825, draws `checkbox-unchecked`; `category=uncheck`,
   124:824, draws `checkbox-checked`). This is a Figma-side gap: the Designer
   swaps the glyphs.
2. **Interactive, controlled toggle.** A native `<input type="checkbox">`
   over the glyph, keyboard-operable (Space toggles). Only the checkbox
   toggles: the description, the Label and the row do nothing, and the text
   is not wrapped in a `<label>`. The checkbox is named by the description
   through `aria-labelledby`. The parent owns `category` and hears
   `onCategoryChange`.
   - States: no hover, press, focus or disabled styling is built. The
     browser's own focus ring shows on the checkbox. QA does not fail it for
     missing states.
3. Glyph size `--size-icon-lg` (24 on web, 20 in back office, accepted).
4. Glyph stroke `--border-width-icon-bold` (2).
5. Lucide `Square` (uncheck) and `SquareCheck` (check). Colours as Figma
   binds them: `--icon-neutral-primary` empty, `--icon-interactive-brand-idle`
   ticked.
6. The checkbox is drawn inline; no shared Checkbox component yet. (The same
   glyph family is used at 20 by `Menu/Item/Checkbox`, 116:1070.)
7. The row fills its parent. Figma's unbound 632 is not built.
8. A long description stays on one line and ends in an ellipsis, at least
   `--spacing-gap-lg` before the Label. Figma binds no gap there.
9. The Label hugs its text; Figma's fixed 103 is not built. Figma puts the
   4px vertical padding on the inner frame in one variant and on the row in
   the other; one consistent 32 row is built (`--spacing-padding-xs` above
   and below the 24 line), and the Designer makes Figma consistent.
10. DM Sans optical size: the browser renders the 16px description at
    `opsz` 16 and the 12px Label at `opsz` 12, against Figma's `opsz` 14.
    Accepted; no token carries an optical size.

## Design update, owner rulings, 2026-10-10 (second round)

The Designer added the `align position` variant property and two vertical
variants to 124:826.

1. **Prop:** `alignPosition`, `'horizontal'` (default) or `'vertical'`.
2. **Vertical variants are `check` / `uncheck`.** Figma names them
   `category=category3` (264:366, empty glyph) and `category=category4`
   (264:377, ticked glyph). These are Designer placeholders. The code builds a
   2 × 2 matrix, `category` × `alignPosition`, and follows the names per
   ruling 1 (`check` is ticked). **Figma-side gap:** the Designer renames
   them in Figma.
3. **Horizontal is unchanged.** Figma now draws an unbound 46 gap between the
   description and the Label. Rulings 7 and 8 stand: the row fills its
   parent, the Label sits at the far end, and at least `--spacing-gap-lg`
   separates them. **Figma-side gap:** the 46 is unbound.
4. **Vertical layout:**
   - It fills its parent, and the description stays one line with an
     ellipsis.
   - The Label sits on its own line, `--spacing-gap-xxs` below the checkbox
     row. The checkbox row keeps `--spacing-padding-xs` above and below.
   - The Label is indented by `calc(var(--size-icon-lg) + var(--spacing-gap-sm))`,
     so it lines up with the description in every scale: 32 on web, 26 in
     back office. **Figma-side gap:** Figma binds `spacing/padding/2xl`, which
     is 32 on web but 20 in back office, so it would misalign there.
   - The toggle behaves as in horizontal: glyph-only, controlled, no state
     styling.
5. **Retest:** after this ships, QA retests every row.

Still open in Figma from the first round: the horizontal glyphs are still
swapped (124:825 `check` draws the empty box), and the 4px padding still
sits in different places in the two horizontal variants.

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
| (unbound, owner ruling) gap before the Label, horizontal | `--spacing-gap-lg` |
| `spacing/gap/xxs` (vertical, row to Label) | `--spacing-gap-xxs` |
| `spacing/padding/2xl` (vertical, Label indent) | not used: `calc(--size-icon-lg + --spacing-gap-sm)`, owner ruling |

The Label's own tokens (`label/md`, `spacing/padding/sm`,
`spacing/padding/xxs`, `background/accent/secondary-idle`,
`text/interactive/secondary-idle`, `border-radius-rounded`) come with the
imported Label.
