# FieldControl — name and prop names (for review)

FieldControl is the bordered box of a text input: the border, the leading
icon, the input with its caret, and one trailing action. It was extracted
from TextField on 2026-10-04, by owner decision, so that PasswordField can
import it instead of copying TextField's styles. TextField imports it and
its rendered look, props, stories and behaviour are unchanged.

It has **no Figma node of its own**. In Figma it is the "text field" frame
inside InputField (64:556) and inside PasswordField (95:596); neither is an
instance of a shared component. Its name is therefore a name by role, not a
Figma name, and is proposed here for review.

## Name

| Proposed | Why |
| --- | --- |
| `FieldControl` | It is the control part of a form field, as opposed to the field's label. `InputControl` and `TextFieldBox` were the alternatives; `FieldControl` reads correctly for both TextField and PasswordField. |

The Designer may want to make this frame a component in Figma, so both
InputField and PasswordField use instances of it. There is no Components row
for it in the registry; only the Designer can create one.

## Props

None come from Figma, because there is no Figma node. Where a prop carries a
TextField property through, it keeps the meaning (and, where it can, the
name) of that property.

| Prop | Default | What it does | TextField property it carries |
| --- | --- | --- | --- |
| `state` | `idle` | `idle`, `hover`, `active`, `typing`, `focus`, `error`, `disable`, with the same meaning as TextField's (see `docs/textfield-prop-names.md`). | `state` |
| `size` | `lg` | `lg` (`size-control-lg`) or `sm` (`size-control-md`). | `size` |
| `placeholderText` | none | The input's placeholder. | `placeholderText` |
| `showLeading` | `true` | Shows the leading icon. | `showLeading` |
| `leadingIcon` | Lucide `Circle` | The leading icon, a Lucide component. | `swapLeadingIcon` |
| `showTrailing` | `false` | Shows the trailing action. It is shown only when `trailingIcon` is also set. | `showTrailing` |
| `trailingIcon` | none | The trailing action's icon, a Lucide component. | `swapTrailingIcon` |
| `trailingLabel` | none | The trailing action's accessible name (`aria-label`). It is required whenever the action is shown, because the button has no visible text. | — (TextField passes `Clear <labelText>`) |
| `trailingPressed` | none | `aria-pressed` on the trailing button, for an action that toggles (PasswordField's show/hide). Leave it unset for a one-shot action such as clear. | — |
| `onTrailingClick` | none | `(event, input) => void`, called when the trailing action is clicked. `input` is the `<input>` element. Afterwards focus returns to the input. | — (TextField clears the field) |

`leadingIcon` and `trailingIcon` drop TextField's `swap` prefix because they
are not Figma instance-swap properties here. TextField keeps
`swapLeadingIcon` and `swapTrailingIcon` and maps them through.

### Not from Figma: the input's own attributes

`type` (default `text`), `id`, `name`, `value`, `defaultValue`, `onChange`,
`onFocus`, `onBlur` and the rest go to the `<input>`. FieldControl renders
no label. The parent renders it and passes the input's `id`; used on its
own, FieldControl needs an `aria-label`.

## Behaviour carried over from TextField unchanged

- The trailing action is a real `<button type="button">`, out of the tab
  order (`tabIndex={-1}`), and never takes focus from the input. It is
  disabled when `state` is `disable`.
- Hover, active, typing and keyboard focus come from real input. Only
  keyboard focus shows the ring, which is drawn outside the box.
- The caret is always `background-interactive-brand-idle`, in every look,
  including `error` (owner decision, 2026-10-04).

## What moved, for the reviewer

- `TextField.css`'s box, icon, input, look and ring rules moved to
  `FieldControl.css`, with the classes renamed from `text-field__control`
  and friends to `field-control*`. Every token is the same.
- `data-state`, `data-look` and `data-ring` moved from TextField's outer
  `<div>` to the FieldControl box. The label and the outer wrapper are
  unchanged.

## For review

- The trailing action stays out of the tab order, as TextField's clear
  button was. For PasswordField's show/hide toggle, that means keyboard
  users cannot reveal the password. Figma gives the trailing icon no focus
  look, so making it a tab stop needs a design decision first.
