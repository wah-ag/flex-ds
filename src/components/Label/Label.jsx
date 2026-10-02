import { Circle } from 'lucide-react';
import './Label.css';

// Figma: Label, node 31:228.
// Props are named as Figma names its component properties.

// `state` is idle or hover, and nothing else, by owner decision on 2026-10-03
// (docs/label-prop-names.md). Label is not a control: it takes no focus and
// has no press or disabled look. Hover happens through a real pointer;
// passing `state="hover"` only pins the look, for docs.

// The default icon is Figma's "circle" layer, mapped to Lucide Circle
// (pending the Designer's confirmation).
export function Label({
  category = 'brand',
  size = 'lg',
  state = 'idle',
  labelText = 'Label',
  showIcon = true,
  swapIcon: SwapIcon = Circle,
  className,
  ...rest
}) {
  return (
    <span
      {...rest}
      className={['label', `label--${category}`, `label--${size}`, className]
        .filter(Boolean)
        .join(' ')}
      data-state={state}
    >
      {showIcon && SwapIcon && (
        <SwapIcon className="label__icon" aria-hidden="true" focusable="false" />
      )}
      <span className="label__text">{labelText}</span>
    </span>
  );
}

export default Label;
