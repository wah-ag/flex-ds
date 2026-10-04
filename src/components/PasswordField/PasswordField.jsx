import { useEffect, useId, useState } from 'react';
import { Circle, Eye, EyeOff } from 'lucide-react';
import { FieldControl } from '../FieldControl/FieldControl';
import { FieldLabel } from '../FieldLabel/FieldLabel';
import './PasswordField.css';

// Figma: PasswordField, node 95:596. Props are named as Figma names its
// component properties, and `state` takes Figma's variant values as written
// (docs/password-field-prop-names.md).
//
// The label is FieldLabel and the bordered box is FieldControl, both shared
// with TextField. The box's trailing action is the show/hide toggle. Owner
// decisions, 2026-10-04:
// - the hidden password uses the browser's own bullets (type="password"),
//   not Figma's drawn dots;
// - the caret is brand in every state, including error;
// - the field starts hidden (eye closed);
// - the eye is in the tab order, with the focus-ring tokens;
// - hover uses border-interactive-brand-hover (149:146) and keyboard focus
//   colours the leading icon icon-interactive-brand-idle (93:528), as
//   PasswordField's Figma binds them; TextField keeps InputField's looks.
//
// States:
// - `hover` comes from a real pointer; `active` (focused, empty) and the
//   value looks from real focus and input; `focus` is keyboard focus and
//   shows the ring. Passing them as `state` only pins the look, for docs.
// - `error visible`, `error invisible` and `disable` are held.
// - visible / invisible is the toggle: the eye flips it. `state` only sets
//   where it starts. The eye shows the current visibility, as in Figma:
//   open while the password is shown, closed while it is hidden.

// Figma `state` → FieldControl look.
const LOOK = {
  idle: 'idle',
  hover: 'hover',
  active: 'active',
  focus: 'focus',
  'password visible': 'typing',
  'password invisible': 'typing',
  'error visible': 'error',
  'error invisible': 'error',
  disable: 'disable',
};

// The field starts hidden; only the `… visible` states start shown.
const startsVisible = (state) => state.endsWith(' visible');

export function PasswordField({
  state = 'idle',
  labelText = 'Password',
  showLeading = true,
  showTrailing = true,
  swapLeadingIcon = Circle,
  id,
  className,
  ...rest
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const [visible, setVisible] = useState(() => startsVisible(state));
  useEffect(() => {
    setVisible(startsVisible(state));
  }, [state]);

  return (
    <div className={['password-field', className].filter(Boolean).join(' ')} data-state={state}>
      <FieldLabel labelText={labelText} htmlFor={inputId} />
      <FieldControl
        {...rest}
        id={inputId}
        type={visible ? 'text' : 'password'}
        state={LOOK[state] ?? 'idle'}
        size="lg"
        placeholderText="Enter your password"
        showLeading={showLeading}
        leadingIcon={swapLeadingIcon}
        showTrailing={showTrailing}
        trailingIcon={visible ? Eye : EyeOff}
        trailingLabel={`Show ${labelText}`}
        trailingPressed={visible}
        trailingFocusable
        hoverBorder="brand-hover"
        focusLeadingIcon="brand"
        onTrailingClick={() => setVisible((value) => !value)}
      />
    </div>
  );
}

export default PasswordField;
