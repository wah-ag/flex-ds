# PasswordField — prop and state names (for review)

PasswordField is the Figma component set `PasswordField`, node 95:596
(registry row "InputField/PasswordField"). It is built on
`component/password-field`, stacked on the FieldControl refactor
(`component/text-field-control`), and imports FieldControl
(`docs/field-control-prop-names.md`).

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

## Question (blocks the pull request)

- **Which way does the field start?** Figma draws the open eye in `idle`,
  `hover`, `active`, `focus` and `disable`, and pairs the open eye with the
  visible password. Read literally, a new field shows the password in plain
  text until the user hides it, and that is how this draft behaves. Most
  password fields start hidden. If it should start hidden, Figma's empty
  cells should show the closed eye.

## Design gaps (Designer)

- **Hover border is bound to an icon token.** In `hover` (149:146), the
  border is bound to `icon/interactive/brand-hover`. The border role has its
  own `border-interactive-brand-hover`. The Developer may not swap a binding,
  so the hover border is left unresolved. It renders FieldControl's shared
  hover look (`border-interactive-brand-idle`, TextField's hover) until the
  Designer rebinds it.
- **Hover eye ignores `showTrailing`.** In `hover`, eye-open (149:155) is not
  tied to `showTrailing`; in every other cell it is. The code honours
  `showTrailing` in every state.
- **Focus leading icon disagrees with InputField.** PasswordField `focus`
  colours the leading icon `icon/interactive/brand-idle` (93:528). InputField
  `focus` (64:610) leaves it `icon/neutral/primary`. Both draw the same
  shared box, so FieldControl follows InputField. One of the two Figma
  components should change.
- **Width.** Figma's width is a fixed 376 with no token. Like TextField, the
  field fills its container.
- **Focus ring.** In Figma the ring sits in the layout (76 → 84). As in
  TextField (owner decision 2026-10-03), it is drawn outside the box, so focus
  never changes the height.

## Open before the pull request

- **Label styles.** The label repeats TextField's label rule (`title-sm`,
  `text-neutral-base`), because the label is still part of TextField. It
  should become a shared `FieldLabel` subcomponent that both import. That is
  another change to TextField, which needs the owner's approval.
- **Keyboard access to the toggle.** FieldControl keeps the trailing action
  out of the tab order, as TextField's clear button was, so keyboard users
  cannot reveal the password. Figma gives the eye no focus look.
