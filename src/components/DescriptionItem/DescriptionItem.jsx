import { useId } from 'react';
import { Square, SquareCheck } from 'lucide-react';
import { Label } from '../Label/Label';
import './DescriptionItem.css';

// Figma: CardContent/DescriptionItem, node 124:826.
// Props are named as Figma names its component properties
// (docs/description-item-prop-names.md).
//
// Owner rulings, 2026-10-10:
// - `category="check"` is ticked and `category="uncheck"` is empty, as the
//   variant names say. Figma's glyphs are swapped; the Designer fixes them.
// - The checkbox is a real, native, keyboard-operable control. Only the
//   checkbox toggles: the description, the Label and the row do nothing.
//   The checkbox is named by the description through aria-labelledby.
// - Controlled: the parent owns `category` and hears about a toggle through
//   `onCategoryChange(nextCategory, event)`.
// - No hover, press, focus or disabled styling: the browser's own focus ring
//   only.
// - The row fills its parent; the description is one line with an ellipsis.
// - The Label is imported as it is (brand / md / no icon), hugging its text.
export function DescriptionItem({
  category = 'check',
  descriptionText = 'Own end-to end product design from research to shipped UI',
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
      <Label
        className="description-item__label"
        category="brand"
        size="md"
        showIcon={false}
        labelText={labelText}
      />
    </div>
  );
}

export default DescriptionItem;
