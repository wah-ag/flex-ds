import { useId } from 'react';
import { Circle, CircleX } from 'lucide-react';
import { FieldControl } from '../FieldControl/FieldControl';
import { FieldLabel } from '../FieldLabel/FieldLabel';
import './TextField.css';

// Figma: InputField, node 64:556. Built as TextField by owner decision
// (docs/textfield-prop-names.md). Props are named as Figma names its
// component properties.
//
// The bordered box (icons, input, caret, trailing action) is FieldControl,
// extracted on 2026-10-04 by owner decision so PasswordField can share it
// (docs/field-control-prop-names.md), with the label as FieldLabel. TextField
// lays them out and makes the trailing action clear the field. States are FieldControl's:
// - `active` is focused and empty; `typing` is focused with a value. Both
//   come from real focus and real input.
// - `focus` is keyboard focus, and only keyboard focus shows the ring.
// - `hover` comes from a real pointer.
// - `error` and `disable` are held states, set through `state`.
// Passing `hover`, `active`, `typing` or `focus` as `state` only pins the
// look, for docs.
//
// Helper Text is deferred (Figma places it 6 below the field with no token),
// so `helperText` and `showHelperText` are not built.

// Sets the input's value the way typing does, so React's onChange fires for
// controlled and uncontrolled use alike.
function clearInput(input) {
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  setValue.call(input, '');
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

export function TextField({
  state = 'idle',
  size = 'lg',
  labelText = 'Email',
  placeholderText = 'Enter your email',
  showLeading = true,
  showTrailing = true,
  swapLeadingIcon = Circle,
  swapTrailingIcon = CircleX,
  type = 'text',
  id,
  className,
  ...rest
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={['text-field', className].filter(Boolean).join(' ')}>
      <FieldLabel labelText={labelText} htmlFor={inputId} />
      <FieldControl
        {...rest}
        id={inputId}
        type={type}
        state={state}
        size={size}
        placeholderText={placeholderText}
        showLeading={showLeading}
        leadingIcon={swapLeadingIcon}
        showTrailing={showTrailing}
        trailingIcon={swapTrailingIcon}
        trailingLabel={`Clear ${labelText}`}
        // The clear button stays out of the tab order; clearing returns
        // focus to the input. See docs/textfield-prop-names.md.
        onTrailingClick={(event, input) => clearInput(input)}
      />
    </div>
  );
}

export default TextField;
