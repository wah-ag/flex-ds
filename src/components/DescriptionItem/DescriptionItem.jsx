import { useId } from 'react';
import { Square, SquareCheck } from 'lucide-react';
import { Label } from '../Label/Label';
import './DescriptionItem.css';

// Figma: CardContent/DescriptionItem, node 269:447.
// Props are named as Figma names its component properties
// (docs/description-item-prop-names.md).
//
// Owner rulings, 2026-10-10:
// - Figma 269:447 is the source of truth. It has one variant property,
//   `category`; the earlier `alignPosition` prop (124:826) is removed.
// - `category="check"` is ticked and `category="uncheck"` is empty, as the
//   variant names say. Figma's glyphs are swapped; the Designer fixes them.
// - The checkbox is a real, native, keyboard-operable control. Only the
//   checkbox toggles: the description, the Label and the row do nothing.
//   The checkbox is named by the description through aria-labelledby.
// - Controlled: the parent owns `category` and hears about a toggle through
//   `onCategoryChange(nextCategory, event)`.
// - No hover, press, focus or disabled styling: the browser's own focus ring
//   only.
// - The row fills its parent and wraps, as Figma's frame does: the Label
//   sits beside the description while both fit, and moves to its own line
//   under it when they do not. The description wraps onto several lines.
// - The Label is imported as it is (brand / md / no icon), hugging its text.
export function DescriptionItem({
  category = 'check',
  descriptionText = 'Own end-to end product design from research to shipped something',
  labelText = 'In 74% of posts',
  onCategoryChange,
  className,
  ...rest
}) {
  const descriptionId = useId();
  const checked = category === 'check';
  const Icon = checked ? SquareCheck : Square;

  return (
    <div
      {...rest}
      className={['description-item', `description-item--${category}`, className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="description-item__content">
        <span className="description-item__control">
          <input
            type="checkbox"
            className="description-item__input"
            checked={checked}
            aria-labelledby={descriptionId}
            onChange={(event) =>
              onCategoryChange?.(event.target.checked ? 'check' : 'uncheck', event)
            }
          />
          <Icon className="description-item__icon" aria-hidden="true" focusable="false" />
        </span>
        <p id={descriptionId} className="description-item__text">
          {descriptionText}
        </p>
      </div>
      <div className="description-item__label-slot">
        <Label category="brand" size="md" showIcon={false} labelText={labelText} />
      </div>
    </div>
  );
}

export default DescriptionItem;
