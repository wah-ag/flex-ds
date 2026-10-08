# EmployerProfile — prop names (for review)

EmployerProfile is the Figma component `CardContent/EmployerProfile`, node
32:337. It is built on `component/employer-profile` as
`src/components/EmployerProfile/`.

## Figma properties

| Figma property | Prop | Values |
| --- | --- | --- |
| `employerTitle` (text) | `employerTitle` | string (default `"Hire-Me Co,Ltd."`) |
| `postedTime` (text) | `postedTime` | string (default `"Posted 2 days ago"`) |
| `showHelperText` (boolean) | `showHelperText` | `true` / `false` (default `true`); hides the `postedTime` line |

The names are as the Figma MCP reports them. Their exact spelling in the
Figma panel could not be read through the API, so the Designer should
confirm them.

## Composition

| Figma instance | Component | As drawn |
| --- | --- | --- |
| 32:322 `Avatar` | `Avatar` | `size=xl`, `category=rectangle image` |

Avatar is imported as it is. Nothing of it is restyled.

## `avatarProps`: added, by owner decision (2026-10-08)

Figma has no property for the avatar's image. Following the NavItems
precedent (`docs/nav-items-prop-names.md`), `avatarProps` is one object
passed straight through to Avatar using Avatar's own props (`src`, `alt`,
and `size` or `category` if a product ever needs them). The default is the
instance as Figma draws it: `{ size: 'xl', category: 'rectangle image' }`.
The owner approved this name on 2026-10-08. If the Designer adds an image
property to 32:337, the prop should follow it.

Other HTML attributes pass through to the wrapping `<div>`.

## Layout: owner rulings (2026-10-08)

- **Width.** Figma fixes the frame at 198 with no token. That width is not
  built: the component hugs its content and never grows past its parent.
- **Long title.** The title stays on one line and ends in an ellipsis when the
  parent limits the width. The text column has `min-width: 0` so that it can
  shrink. The full title is also set as the `title` attribute.
- **Helper line.** Figma makes it fill the column and grow in height, so it
  wraps when the column is narrower than it.

## States: none, by owner decision (2026-10-08)

Figma designs no states for 32:337, and the content is not interactive. No
hover, press, focus, disabled or destructive look is built, and none should
be tested as missing.

## Tokens used

| Figma variable | Built token |
| --- | --- |
| `spacing/gap/md` | `--spacing-gap-md` |
| `spacing/gap/xxs` | `--spacing-gap-xxs` |
| `title/sm` (text style) | `--title-sm` |
| `label/md` (text style) | `--label-md` |
| `text/neutral/bold` | `--text-neutral-bold` |
| `text/neutral/secondary` | `--text-neutral-secondary` |

Avatar's variables (`size/avatar/xl`, `border-radius-control-xs`,
`border-width-default`, `border/neutral/base`) are resolved in Avatar's own
CSS.

## Note: DM Sans optical size

Figma renders the helper text with DM Sans at `"opsz" 14`. The browser's
automatic optical sizing uses 12 for 12px text, and Label renders `label-md`
the same way. The difference is small, but it may show next to Figma.
