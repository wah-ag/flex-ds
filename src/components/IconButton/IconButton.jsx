import { BellRing } from 'lucide-react';
import './IconButton.css';

// Figma: IconButton, node 45:324.
// Props are named as Figma names its component properties.

// Figma's `disable` is a held state. `hover` and `press` happen through real
// input; passing them only pins the look, for docs.
export function IconButton({
  state = 'idle',
  swapIcon: SwapIcon = BellRing,
  type = 'button',
  className,
  ...rest
}) {
  return (
    <button
      {...rest}
      type={type}
      className={['icon-button', className].filter(Boolean).join(' ')}
      data-state={state}
      disabled={state === 'disable'}
    >
      <SwapIcon className="icon-button__icon" aria-hidden="true" focusable="false" />
    </button>
  );
}

export default IconButton;
