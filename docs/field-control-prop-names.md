# FieldControl and FieldLabel — names and prop names (for review)

FieldControl and FieldLabel are the two parts of a form field, extracted
from TextField on 2026-10-04 by owner decision (a one-off exception for
TextField, which reads Completed), so that PasswordField can import them
instead of copying TextField's styles. TextField imports both, and its
rendered look, props, stories and behaviour are unchanged.

- **FieldControl** is the bordered box: the border, the leading icon, the
  input with its caret, and one trailing action.
- **FieldLabel** is the label above it.

Neither has **a Figma node of its own**. In Figma they are the "text field"
frame and the label text layer inside InputField (64:556) and inside
PasswordField (95:596, label layer 93:575). Neither is an instance of a
shared component. Their names are therefore names by role, not Figma names,
and are proposed here for review.

## Names

| Proposed | Why |
| --- | --- |
| `FieldControl` | It is the control part of a form field, as opposed to the field's label. `InputControl` and `TextFieldBox` were the alternatives; `FieldControl` reads correctly for both TextField and PasswordField. |
| `FieldLabel` | The label of a form field. It is not `Label`, which is already the badge-style Label component (Figma 31:228). |

The Designer may want to make both components in Figma, so InputField and
PasswordField use instances of them. Neither has a Components row in the
registry, and only the Designer can create one.

## FieldControl props

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
| `trailingFocusable` | `false` | When `true`, the trailing action is a tab stop with a focus ring, and keeps focus when it is used from the keyboard. When `false` (TextField's clear), it is out of the tab order and focus returns to the input after it runs. | — |
| `onTrailingClick` | none | `(event, input) => void`, called when the trailing action is clicked. `input` is the `<input>` element. | — (TextField clears the field) |
| `hoverBorder` | `brand-idle` | The hover border: `brand-idle` (`border-interactive-brand-idle`, InputField 64:573) or `brand-hover` (`border-interactive-brand-hover`, PasswordField 149:146). | — (TextField uses the default) |
| `focusLeadingIcon` | `neutral` | The leading icon in keyboard focus: `neutral` (unchanged, `icon-neutral-primary`, InputField 64:610) or `brand` (`icon-interactive-brand-idle`, PasswordField 93:528). | — (TextField uses the default) |

`hoverBorder` and `focusLeadingIcon` exist because the two Figma components
that draw this box disagree on those two looks (see *Design gap*). Each
parent passes the look its own Figma binds. This was decided by the owner on
2026-10-04, in PasswordField's fix round 1.

`leadingIcon` and `trailingIcon` drop TextField's `swap` prefix because they
are not Figma instance-swap properties here. TextField keeps
`swapLeadingIcon` and `swapTrailingIcon` and maps them through.

### Not from Figma: the input's own attributes

`type` (default `text`), `id`, `name`, `value`, `defaultValue`, `onChange`,
`onFocus`, `onBlur` and the rest go to the `<input>`. FieldControl renders
no label. The parent renders a FieldLabel and passes the input's `id`; used
on its own, FieldControl needs an `aria-label`.

## FieldLabel props

| Prop | What it does |
| --- | --- |
| `labelText` | The label's text. TextField and PasswordField pass their own `labelText`. |
| `htmlFor` | The `id` of the input it names. It renders a real `<label>`. |

It has one look (`title-sm`, `text-neutral-base`) and no states.

## Behaviour

- The trailing action is a real `<button type="button">`. A pointer never
  takes focus from the input. It is disabled when `state` is `disable`.
- By default (TextField's clear button, unchanged) it is out of the tab
  order. With `trailingFocusable` (PasswordField's eye, owner decision
  2026-10-04) it is a tab stop. Its keyboard focus ring uses the existing
  focus tokens: `border-width-focus`, `border-interactive-brand-focus`,
  offset `spacing-padding-xxs`, radius `border-radius-control-xs`.
- Hover, active, typing and keyboard focus come from real input. Only
  keyboard focus on the input shows the field's ring, which is drawn outside
  the box.
- The caret is always `background-interactive-brand-idle`, in every look,
  including `error` (owner decision, 2026-10-04).

## Design gap

- **No focus look for a focusable trailing action.** Figma draws no focus
  state for the eye (or any trailing icon). The ring above is built from the
  existing focus tokens. The Designer should draw it.
- **InputField and PasswordField draw the same box with two different
  looks.** The hover border is `border/interactive/brand-idle` in InputField
  (64:573) and `border/interactive/brand-hover` in PasswordField (149:146).
  The keyboard-focus leading icon is `icon/neutral/primary` in InputField
  (64:610) and `icon/interactive/brand-idle` in PasswordField (93:528). The
  Designer should decide whether this is intended. If not, align one
  component, and `hoverBorder` and `focusLeadingIcon` can go.

## What moved, for the reviewer

- `TextField.css`'s box, icon, input, look and ring rules moved to
  `FieldControl.css`, with the classes renamed from `text-field__control`
  and friends to `field-control*`. Every token is the same.
- `data-state`, `data-look` and `data-ring` moved from TextField's outer
  `<div>` to the FieldControl box.
- TextField's label rule moved to `FieldLabel.css`, with `text-field__label`
  renamed `field-label`. The tokens are the same.
