import { useId, useRef, useState } from 'react';
import { Circle, CircleX } from 'lucide-react';
import './TextField.css';

// Figma: InputField, node 64:556. Built as TextField by owner decision
// (docs/textfield-prop-names.md). Props are named as Figma names its
// component properties.

// States, by owner decision on 2026-10-03:
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
  swapLeadingIcon: LeadingIcon = Circle,
  swapTrailingIcon: TrailingIcon = CircleX,
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
  const generatedId = useId();
  const inputId = id ?? generatedId;
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
      className={['text-field', `text-field--${size}`, className].filter(Boolean).join(' ')}
      data-state={state}
      data-look={look}
      data-ring={showRing ? '' : undefined}
    >
      <label className="text-field__label" htmlFor={inputId}>
        {labelText}
      </label>
      <div className="text-field__control">
        <div className="text-field__content">
          {showLeading && LeadingIcon && (
            <LeadingIcon
              className="text-field__icon text-field__icon--leading"
              aria-hidden="true"
              focusable="false"
            />
          )}
          <input
            {...rest}
            ref={inputRef}
            id={inputId}
            type={type}
            className="text-field__input"
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
          // The clear button stays out of the tab order; clearing returns
          // focus to the input. See docs/textfield-prop-names.md.
          <button
            type="button"
            className="text-field__clear"
            aria-label={`Clear ${labelText}`}
            tabIndex={-1}
            disabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              const input = inputRef.current;
              if (!input) return;
              clearInput(input);
              input.focus();
            }}
          >
            <TrailingIcon
              className="text-field__icon text-field__icon--trailing"
              aria-hidden="true"
              focusable="false"
            />
          </button>
        )}
      </div>
    </div>
  );
}

export default TextField;
