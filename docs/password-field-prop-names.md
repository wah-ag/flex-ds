# PasswordField — prop and state names (for review)

PasswordField is the Figma component set `PasswordField`, node 95:596
(registry row "InputField/PasswordField"). It is built on
`component/password-field`, which also carries the owner-approved
extraction of FieldControl and FieldLabel from TextField. PasswordField
imports both (`docs/field-control-prop-names.md`).

## Props

Props are the Figma component properties in camelCase, following the
convention agreed for ButtonCTA (`docs/button-cta-prop-names.md`) and used by
TextField.

| Figma property | Prop | Default |
| --- | --- | --- |
| `state` (variant, 9 values; see below) | `state` | `idle` |
| label text (text, default "Password") | `labelText` | `Password` |
| show leading (boolean) | `showLeading` | `true` |
| show trailing (boolean) | `showTrailing` | `true` |
| swap leading icon (instance swap, default "circle") | `swapLeadingIcon` | Lucide `Circle` |

Figma has **no** `size` (it is 48 tall, `size/control/lg`, only), **no**
placeholder property (the text "Enter your password" is fixed), and **no**
swap on the trailing icon (it is the eye). PasswordField therefore has none
of these props, unlike TextField.

### Not from Figma

The input's own HTML attributes (`id`, `name`, `value`, `defaultValue`,
`onChange`, `autoComplete`, …) are passed through to the `<input>`, as in
TextField. `id` defaults to a generated one so the label is always tied to
the input. `type` is owned by the toggle.

## `state` values

`state` takes Figma's variant values exactly as Figma writes them, spaces
included, so they match the Figma panel one for one:

| Figma `state` | Meaning | FieldControl look |
| --- | --- | --- |
| `idle` | At rest. | `idle` |
| `hover` | Pointer over the field (real hover; passing it pins the look). | `hover` |
| `active` | Focused by pointer, empty (real; passing it pins). | `active` |
| `focus` | Focused by keyboard, shows the ring (real; passing it pins). | `focus` |
| `password visible` | Focused with a value, password shown. | `typing` |
| `password invisible` | Focused with a value, password hidden. | `typing` |
| `error visible` | Held error, password shown. | `error` |
| `error invisible` | Held error, password hidden. | `error` |
| `disable` | Held disabled. | `disable` |

**For review:** values with spaces are legal JavaScript strings but unusual
as prop values. If you'd rather have them, the suggested alternatives are
`passwordVisible`, `passwordInvisible`, `errorVisible` and `errorInvisible`.
They have not been applied, because prop values follow Figma unless a human
decides otherwise.

**Visible / invisible is a toggle, not a held state.** The eye button flips
it. `state` only sets where it starts. The eye shows the current visibility,
as Figma draws it: open while the password is shown, closed while hidden. The
button's accessible name is "Show <labelText>", with `aria-pressed` reporting
whether the password is shown.

## Owner decisions applied (2026-10-04)

- The hidden password uses the browser's own bullets (`type="password"`),
  not Figma's drawn dots (`size-dots-sm`, `spacing-gap-xs`,
  `background-neutral-inverse` / `background-interactive-danger-idle`).
- The caret is brand (`background-interactive-brand-idle`) in every state.
  Figma's `error` caret (`background-interactive-danger-idle`) is ignored.
- **The field starts hidden** (masked, closed eye). Only `password visible`
  and `error visible` start shown.
- **The eye is keyboard-focusable** and in the tab order
  (`trailingFocusable` on FieldControl), with a ring from the existing focus
  tokens. Used from the keyboard, it keeps focus. TextField's clear button is
  unchanged: it stays out of the tab order.

## Design gaps (Designer)

- **Empty cells show the open eye.** Figma draws eye-open in `idle`,
  `hover`, `active`, `focus` and `disable`. Since the field starts hidden
  (owner decision), those cells render the closed eye (Lucide `EyeOff`).
  Figma should show eye-close there.
- **No focus look for the eye.** Figma draws no focus state for the eye. It
  uses the ring described in `docs/field-control-prop-names.md` until the
  Designer draws one. While the eye has keyboard focus, the input does not,
  so the box shows its unfocused look (`idle`, or the held `error`).
  Figma has no cell for this.
- **Hover eye ignores `showTrailing`.** In `hover`, eye-open (149:155) is not
  tied to `showTrailing`; in every other cell it is. The code honours
  `showTrailing` in every state.
- **PasswordField and InputField disagree on two looks of the same box.**
  Both components draw the same field frame (FieldControl), but:

  | Look | PasswordField (95:596) | InputField / TextField (64:556) |
  | --- | --- | --- |
  | Hover border | `border/interactive/brand-hover` (149:146, field 149:148) | `border/interactive/brand-idle` (64:573) |
  | Keyboard-focus leading icon | `icon/interactive/brand-idle` (93:528) | `icon/neutral/primary` (64:610) |

  By owner decision (2026-10-04, fix round 1), each component follows its own
  Figma. PasswordField passes `hoverBorder="brand-hover"` and
  `focusLeadingIcon="brand"` to FieldControl, and TextField keeps the
  defaults. The Designer should decide whether the two fields are meant to
  differ. If not, align one Figma component and drop the option.
- **Width.** Figma's width is a fixed 376 with no token. Like TextField, the
  field fills its container.
- **Focus ring.** In Figma the ring sits in the layout (76 → 84). As in
  TextField (owner decision 2026-10-03), it is drawn outside the box, so focus
  never changes the height.
- **Dots.** Figma draws the hidden password as dots bound to `size-dots-sm`,
  `spacing-gap-xs` and `background-neutral-inverse` (danger in error). Native
  bullets come from the font and cannot take these tokens (owner decision).

## Correction (fix round 1, 2026-10-04)

An earlier version of this file said the `hover` border (149:146) was bound
to `icon/interactive/brand-hover`. That is wrong. `get_variable_defs` on the
field (149:148) and the variant (149:146) reports
`border/interactive/brand-hover`, a border token that exists in the build.
The hover border now renders `--border-interactive-brand-hover`.
