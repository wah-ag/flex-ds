# DescriptionItem — prop names (for review)

DescriptionItem is the Figma component `CardContent/DescriptionItem`, node
124:826. It is built on `component/description-item` as
`src/components/DescriptionItem/`.

## Figma properties

| Figma property | Prop | Values |
| --- | --- | --- |
| `category` (variant: `check`, `uncheck`) | `category` | `'check'` (default) or `'uncheck'` |
| description text (text) | `descriptionText` | string (default `"Own end-to end product design from research to shipped UI"`) |

The names are as the Figma MCP reports them. Their exact spelling in the
Figma panel could not be read through the API, so the Designer should
confirm them. No prop was renamed.

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
| (unbound, owner ruling) gap before the Label | `--spacing-gap-lg` |

The Label's own tokens (`label/md`, `spacing/padding/sm`,
`spacing/padding/xxs`, `background/accent/secondary-idle`,
`text/interactive/secondary-idle`, `border-radius-rounded`) come with the
imported Label.
