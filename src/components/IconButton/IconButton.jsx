import { BellRing } from 'lucide-react';

// Figma: IconButton, node 45:324 (rebuilt 2026-10-13).
// Props are named as Figma names its component properties:
//   category  variant: stroke (default) | default-fill | error-fill
//   state     variant: idle (default) | hover | press | disable
//   swapIcon  instance swap on the icon (default: the ringing bell)
//
// `hover` and `press` happen through real input; passing them as `state`
// only pins the look, for docs. `disable` is a held state: it sets the native
// disabled attribute, so the button takes no pointer or keyboard input.
export function IconButton({
  category = 'stroke',
  state = 'idle',
  swapIcon: SwapIcon = BellRing,
  type = 'button',
  disabled,
  className,
  ...rest
}) {
  return (
    <button
      {...rest}
      type={type}
      className={['icon-button', className].filter(Boolean).join(' ')}
      data-category={category}
      data-state={state}
      disabled={state === 'disable' || Boolean(disabled)}
    >
      <SwapIcon className="icon-button__icon" aria-hidden="true" focusable="false" />
    </button>
  );
}

export default IconButton;
