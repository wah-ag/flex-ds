# TextArea — prop names, owner rulings and gaps (for review)

TextArea is the Figma component set `TextArea`, node 110:1364, with five
variants: `state=idle` (110:1363), `hover` (110:1361), `press` (110:1359),
`active` (110:1360) and `disable` (110:1362). It is built on
`component/text-area`.

## Props

| Figma property | Prop | Default |
| --- | --- | --- |
| `state` (variant: idle, hover, press, active, disable) | `state` | `idle` |
| `placeholderText` (text) | `placeholderText` | `Enter your text` |
| `textAreaLevelText` (text) | `textAreaLevelText` | `Text Area` |

Figma has no `size` property, and TextArea has no `size` prop.

### Suggested rename (not applied)

| Figma name | Suggested | Why |
| --- | --- | --- |
| `textAreaLevelText` | `labelText` | It sets the label above the box. "Level" reads as a misspelling of "Label". `labelText` is the name TextField, PasswordField and FieldLabel already use. |

The prop keeps the Figma name until the Designer renames the property in
Figma, or a human decides otherwise.

### Not from Figma

The textarea's own HTML attributes (`id`, `name`, `value`, `defaultValue`,
`onChange`, `onFocus`, `onBlur`, `rows`, …) pass through to the
`<textarea>`. `id` defaults to a generated one, so the label is always tied
to it.

## `state` values

| Figma `state` | Real input | Box border |
| --- | --- | --- |
| `idle` | At rest. | `border-neutral-secondary` |
| `hover` | Pointer over the box. | `border-interactive-brand-idle` |
| `press` | Pointer held down on the box. | `border-interactive-brand-press` |
| `active` | The box is focused (typing), by pointer or keyboard. | `border-interactive-brand-idle` |
| `disable` | Held: the `<textarea>` is disabled. | `border-neutral-disable` |

Passing `hover`, `press` or `active` as `state` pins the look, for review.
Every look uses `background-neutral-base`, typed text `text-neutral-base`,
placeholder `text-neutral-primary` and a `background-interactive-brand-idle`
caret, except `disable`: `background-neutral-disable`, with text and
placeholder `text-neutral-disable`. The label is `title-sm` in
`text-neutral-base`. The box uses `spacing-padding-md` / `spacing-padding-sm`,
`border-radius-control-xs`, `border-width-default`, and the label sits
`spacing-gap-sm` above it.

## Owner rulings applied (2026-10-04, TextArea only)

1. **Height is not bound to tokens.** Figma's values are used: 120 default,
   120 minimum, 150 maximum. They are the only raw values in the component,
   in one commented block at the top of `TextArea.css`.
2. **Focus and error are deferred.** Only Figma's five states are built.
   There is no `error` prop and there are no focus or error stories. Keyboard
   focus still works: a focused box shows the `active` look (brand border).
   The browser outline is off, as in FieldControl.
3. **The resize handle is the browser's own**, vertical only, clamped to
   120–150. **This differs from Figma on purpose.** Figma draws a "long-text"
   grip at the bottom right (`icon/neutral/primary`, and
   `icon/neutral/disable` when disabled, node 109:1357). It is not drawn,
   pasted or replaced with an icon. The native handle's look comes from the
   browser and takes no token.
4. Built on `component/text-area`, from `origin/staging`.

## Subcomponents

TextArea imports **FieldLabel** (`src/components/FieldLabel/`) for its label.
FieldLabel is a code-only subcomponent: it has **no Figma node of its own**
and no Components row. It is imported by **TextField, PasswordField and
TextArea**. It is tested through those components' rows.

TextArea does not use FieldControl. FieldControl is built around an
`<input>`, and the native resize handle needs the `<textarea>` to be the box
itself. TextArea's box has its own styles, from the same tokens; nothing is
copied from FieldControl's stylesheet.

## Gaps and findings (Designer)

- **Width.** Figma's width is a fixed 376, bound to no token. Like TextField
  and PasswordField, TextArea fills its container.
- **Disabled border — resolved in Figma.** An earlier build run read the
  disabled border as bound to `icon/neutral/disable`. On 2026-10-04,
  `get_variable_defs` and `get_design_context` on the disabled variant
  (110:1362, box 109:1355) report the border as `border/neutral/disable`.
  `icon/neutral/disable` is bound only to the "long-text" grip (109:1357),
  which is not drawn (ruling 3). The box uses `--border-neutral-disable`,
  the same token as FieldControl. No mismatch remains.
- **Grip.** The "long-text" grip is not built (ruling 3). If the Designer
  wants a drawn grip, Lucide's set should be checked for a match first.
