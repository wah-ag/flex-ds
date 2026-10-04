# TextField — prop names

TextField is the Figma component set `InputField`, node 64:556 (registry row
"InputField/TextField"). The owner decided on 2026-10-03 to build it as
`TextField`, in `src/components/TextField`, on `component/textfield`.

Its props are the Figma component properties, in camelCase, following the
convention agreed for ButtonCTA on 2026-09-30
(`docs/button-cta-prop-names.md`). The owner confirmed these names on
2026-10-03.

| Figma property | Prop |
| --- | --- |
| `state` (variant: `idle`, `hover`, `active`, `typing`, `error`, `focus`, `disable`) | `state` |
| `size` (variant: `lg`, `sm`) | `size` |
| label text (text, default "Email") | `labelText` |
| placeholder text (text, default "Enter your email") | `placeholderText` |
| show leading (boolean) | `showLeading` |
| show trailing (boolean) | `showTrailing` |
| swap leading icon (instance swap, default "circle") | `swapLeadingIcon` |
| swap trailing icon (instance swap, default "circle-x") | `swapTrailingIcon` |
| helper text (text) | not built, see below |
| show helper text (boolean) | not built, see below |

## Not from Figma

These are the input's own HTML attributes, passed through to the `<input>`:
`type` (default `text`), `id`, `name`, `value`, `defaultValue`, `onChange`,
`onFocus`, `onBlur` and the rest. `id` defaults to a generated one so the
label is always tied to the input.

## Owner decisions (2026-10-03)

- **Helper Text is deferred.** `helperText` and `showHelperText` are not
  built. This is a design gap: in Figma, Helper Text is positioned
  absolutely, 6 below the field, outside the component's own frame, and the
  offset is bound to no variable. No semantic spacing token resolves to 6 in
  the web scale (only the core `scale-3`, and `size-dots-sm`, which is a dot
  size). The Designer should place it in the auto-layout flow and bind its
  spacing to an existing token.
- **Width.** The field fills its container, by owner decision. Figma's
  width is a fixed 376 with no token; this is settled, not an open question.
- **States.**
  - `active` is focused and empty (pointer focus).
  - `typing` is focused with a value.
  - `focus` is keyboard focus, and only it shows the ring.
  - `hover` comes from a real pointer.
  - `error` and `disable` are held, set through `state`.
  - Passing `hover`, `active`, `typing` or `focus` as `state` only pins the
    look, for docs.
- **Focus ring.** It is drawn outside the field, as in ButtonCTA, so focus
  never changes the field's height. In Figma, the ring is in the layout and
  the component grows from 76 to 84.
- **Trailing icon.** It is a working button that clears the input. The
  default icons are Lucide `Circle` (leading) and `CircleX` (trailing).
- **Sizes.** `sm` uses `size-control-md` (40) and `lg` uses
  `size-control-lg` (48). This is intended.
- **`scale/1`.** The Figma MCP reported a `scale/1` binding inside the idle
  trailing icon. The owner cannot find it in Figma; it is dropped. The icon
  stroke uses `border-width-icon`, like every other icon in the set.

## Implementation choices that need a review

- The clear button is out of the tab order (`tabIndex={-1}`) and has the
  accessible name "Clear <labelText>". Clicking it empties the field, fires
  `onChange`, and returns focus to the input. Figma gives it no focus look of
  its own, so it is not made a tab stop. Keyboard users clear the field by
  editing the text.
- The clear button is shown whenever `showTrailing` is on, even when the field
  is empty, because Figma shows it in every state.
- The text caret is the browser's own, coloured with
  `background-interactive-brand-idle`, the variable Figma binds to its drawn
  "blink cursor".

## Out of scope by owner decision (2026-10-03)

The owner decided to leave these states out. They are not built, and they
are not open design gaps:

- **Holding a value but not focused.** There is no dedicated look. The
  entered text uses `text-neutral-base`, the colour of Figma's `typing`
  text, and the field otherwise looks `idle`.
- **Error with hover or focus.** The error look holds on hover. Keyboard
  focus still shows the standard ring.
- **Press.**

## Deferred design gap

- **Helper Text.** Not built; see *Owner decisions* above. The Designer
  needs to fix it in Figma before `helperText` and `showHelperText` can be
  built.

## Question for the Designer

- **Keyboard focus while the field holds a value.** Figma's `focus` cell
  shows only an empty field. For now it shows the `typing` look plus the
  ring.

## FieldControl (2026-10-04)

By owner decision, TextField's bordered box (border, icons, input, caret and
the clear button) moved into the shared subcomponent `FieldControl`
(`src/components/FieldControl`, `docs/field-control-prop-names.md`), so
PasswordField can import it. TextField's props, look and behaviour are
unchanged; it passes its props through and makes the trailing action clear
the field.

The label moved the same way, into the shared subcomponent `FieldLabel`
(`src/components/FieldLabel`), so PasswordField can import it too. Its look
is unchanged.
