# Avatar — prop names

Avatar's props are the Figma component properties of node 32:315, named as
Figma names them, following the convention agreed for ButtonCTA on
2026-09-30 (`docs/button-cta-prop-names.md`). Two props have no Figma
property and are proposed here for review.

| Figma property | Prop | Values |
| --- | --- | --- |
| `size` (variant) | `size` | `2xl`, `xl`, `lg`, `md`, `sm` (default `2xl`) |
| `category` (variant) | `category` | `rectangle image`, `icon`, `circle image` (default `rectangle image`) |
| instance swap on the icon | `swapIcon` | a Lucide icon component (default `PenTool`); used by `icon` only |
| *(none)* | `src` | image URL; used by `rectangle image` and `circle image` only |
| *(none)* | `alt` | image alternative text (default `""`); used with `src` |

The Figma MCP reports the instance-swap property as `swapIcon`. Its exact
spelling in the Figma panel was not readable through the API and should be
confirmed by the Designer.

## `src` and `alt`: added, by owner decision (2026-10-03)

Figma has no image property: each image cell carries a fixed image fill.
The owner confirmed this is intentional and that the component still needs
an image source and alt text. The names proposed are `src` and `alt`, the
HTML `<img>` attribute names, so they read the same to anyone who has
written an image tag and pass straight through to it.

- `alt` defaults to `""`, which marks the image as decorative. A product
  that shows an avatar on its own, with no name beside it, should pass a
  real description.
- With no `src`, an image category renders its frame (border and radius)
  and nothing inside it. No fallback (initials, placeholder) is drawn,
  because Figma defines none. If one is wanted, it is a design change.

## Sizes: no `xs`, by owner decision (2026-10-03)

The build has a `size-avatar-xs` token, but Figma's Avatar has no `xs`
variant, and the owner confirmed that is intentional. Avatar offers the five
sizes Figma draws.

## Default icon: Lucide `PenTool`

Figma's default icon is an instance named "graphic". Its main component's
name could not be read through the API (it is not in this file's pages), so
the icon was identified by its geometry. The instance's single vector sits
at x/y 2.0 with width and height 19.586 in the 24-unit frame, spanning
2.0–21.586. Lucide `pen-tool` (lucide-react 1.48.0) spans exactly that: its
nib's corner arc reaches 2.0 and its rounded square's far corner reaches
21.586. The shapes also match by eye (nib, centre circle, diagonal line,
rounded square at the bottom right). The Designer should confirm the
mapping, and renaming the layer to the Lucide name would remove the doubt.

## No states

Figma gives Avatar no state property, so it is built as a non-interactive
`<span>` that takes no focus. It has no hover, press, focus or disabled look.
