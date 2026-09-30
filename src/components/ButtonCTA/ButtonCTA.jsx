import { Circle } from 'lucide-react';
import './ButtonCTA.css';

// Figma: ButtonCTA, node 16:438.
// Props are named as Figma names its component properties.

// Figma's `disable` and `error` are held states. `hover`, `press` and `focus`
// happen through real input; passing them only pins the look, for docs.
const TONE = { disable: 'disabled', error: 'danger' };

export function ButtonCTA({
  category = 'primary',
  size = 'lg',
  state = 'idle',
  buttonLabel = 'Component',
  leadingIcon = true,
  trailingIcon = true,
  swapIcon: SwapIcon = Circle,
  type = 'button',
  className,
  ...rest
}) {
  const icon = <SwapIcon className="button-cta__icon" aria-hidden="true" focusable="false" />;

  return (
    <button
      {...rest}
      type={type}
      className={['button-cta', `button-cta--${category}`, `button-cta--${size}`, className]
        .filter(Boolean)
        .join(' ')}
      data-state={state}
      data-tone={TONE[state] ?? 'brand'}
      disabled={state === 'disable'}
    >
      {leadingIcon && icon}
      <span className="button-cta__label">{buttonLabel}</span>
      {trailingIcon && icon}
    </button>
  );
}

export default ButtonCTA;
