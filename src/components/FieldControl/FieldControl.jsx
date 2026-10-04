import { useRef, useState } from 'react';
import { Circle } from 'lucide-react';
import './FieldControl.css';

// FieldControl: the bordered box of a text input, shared by every field.
// It has no Figma node of its own; it is the "text field" frame inside
// InputField (64:556) and PasswordField (95:596), extracted so both import
// it (owner decision, 2026-10-04). See docs/field-control-prop-names.md.
//
// It holds the border box, the leading icon, the input with its caret, and
// one trailing action. The field's label is not part of it: the parent
// renders the label and passes the input's `id`.
//
// States are the same as TextField's (docs/textfield-prop-names.md):
// - `active` is focused and empty; `typing` is focused with a value. Both
//   come from real focus and real input.
// - `focus` is keyboard focus, and only keyboard focus shows the ring.
// - `hover` comes from a real pointer.
// - `error` and `disable` are held states, set through `state`.
// Passing `hover`, `active`, `typing` or `focus` as `state` only pins the
// look, for docs.

const PINNED = ['hover', 'active', 'typing', 'focus', 'error', 'disable'];

// Focus modality: was the last input before a focus a key or a pointer?
// Text inputs match :focus-visible on a click too, so CSS cannot tell
// keyboard focus from pointer focus on its own.
let lastInputWasKeyboard = false;
if (typeof document !== 'undefined') {
  document.addEventListener(
    'keydown',
    (event) => {
      if (!event.metaKey && !event.altKey && !event.ctrlKey) lastInputWasKeyboard = true;
    },
    true,
  );
  document.addEventListener('pointerdown', () => {
    lastInputWasKeyboard = false;
  }, true);
}

export function FieldControl({
  state = 'idle',
  size = 'lg',
  placeholderText,
  showLeading = true,
  leadingIcon: LeadingIcon = Circle,
  showTrailing = false,
  trailingIcon: TrailingIcon,
  trailingLabel,
  trailingPressed,
  trailingFocusable = false,
  onTrailingClick,
  type = 'text',
  id,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  className,
  ...rest
}) {
  const inputRef = useRef(null);

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
  const hasValue = String(isControlled ? value ?? '' : uncontrolledValue) !== '';

  // null, 'keyboard' or 'pointer'
  const [focusedBy, setFocusedBy] = useState(null);

  const isDisabled = state === 'disable';

  let look = 'idle';
  if (PINNED.includes(state)) look = state;
  else if (focusedBy === 'keyboard') look = hasValue ? 'typing' : 'focus';
  else if (focusedBy === 'pointer') look = hasValue ? 'typing' : 'active';

  const showRing = state === 'focus' || (focusedBy === 'keyboard' && !isDisabled);

  return (
    <div
      className={['field-control', `field-control--${size}`, className].filter(Boolean).join(' ')}
      data-state={state}
      data-look={look}
      data-ring={showRing ? '' : undefined}
    >
      <div className="field-control__content">
        {showLeading && LeadingIcon && (
          <LeadingIcon
            className="field-control__icon field-control__icon--leading"
            aria-hidden="true"
            focusable="false"
          />
        )}
        <input
          {...rest}
          ref={inputRef}
          id={id}
          type={type}
          className="field-control__input"
          placeholder={placeholderText}
          value={value}
          defaultValue={isControlled ? undefined : defaultValue}
          disabled={isDisabled}
          aria-invalid={state === 'error' ? true : undefined}
          onChange={(event) => {
            if (!isControlled) setUncontrolledValue(event.target.value);
            onChange?.(event);
          }}
          onFocus={(event) => {
            setFocusedBy(lastInputWasKeyboard ? 'keyboard' : 'pointer');
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocusedBy(null);
            onBlur?.(event);
          }}
        />
      </div>
      {showTrailing && TrailingIcon && (
        // A pointer never takes focus from the input. By default the action
        // is out of the tab order and focus returns to the input after it
        // runs. With `trailingFocusable`, it is a tab stop with its own focus
        // ring, and keeps focus when it is used from the keyboard.
        <button
          type="button"
          className="field-control__trailing"
          aria-label={trailingLabel}
          aria-pressed={trailingPressed}
          tabIndex={trailingFocusable ? undefined : -1}
          disabled={isDisabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={(event) => {
            const input = inputRef.current;
            if (!input) return;
            onTrailingClick?.(event, input);
            if (!trailingFocusable) input.focus();
          }}
        >
          <TrailingIcon
            className="field-control__icon field-control__icon--trailing"
            aria-hidden="true"
            focusable="false"
          />
        </button>
      )}
    </div>
  );
}

export default FieldControl;
