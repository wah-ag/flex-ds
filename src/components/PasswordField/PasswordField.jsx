import { useEffect, useId, useState } from 'react';
import { Circle, Eye, EyeOff } from 'lucide-react';
import { FieldControl } from '../FieldControl/FieldControl';
import './PasswordField.css';

// Figma: PasswordField, node 95:596. Props are named as Figma names its
// component properties, and `state` takes Figma's variant values as written
// (docs/password-field-prop-names.md).
//
// The bordered box is FieldControl, shared with TextField. Its trailing
// action is the show/hide toggle. Owner decisions, 2026-10-04:
// - the hidden password uses the browser's own bullets (type="password"),
//   not Figma's drawn dots;
// - the caret is brand in every state, including error.
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

// Only the `invisible` states start hidden: every other Figma cell shows the
// open eye. See docs/password-field-prop-names.md, "Question".
const startsVisible = (state) => !state.endsWith('invisible');

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
      <label className="password-field__label" htmlFor={inputId}>
        {labelText}
      </label>
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
        onTrailingClick={() => setVisible((value) => !value)}
      />
    </div>
  );
}

export default PasswordField;
