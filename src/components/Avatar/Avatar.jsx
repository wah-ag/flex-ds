import { PenTool } from 'lucide-react';
import './Avatar.css';

// Figma: Avatar, node 32:315.
// `size`, `category` and `swapIcon` are named as Figma names its component
// properties. Figma has no image property; `src` and `alt` are added for the
// image categories and proposed for review in docs/avatar-prop-names.md.

// Avatar is not a control: Figma gives it no state property, so it takes no
// focus and has no hover, press or disabled look.

// The default icon is Figma's "graphic" instance. Its vector matches Lucide
// PenTool exactly (see docs/avatar-prop-names.md).

const IMAGE_CATEGORIES = ['rectangle image', 'circle image'];

const categoryClass = (category) => `avatar--${category.replace(/\s+/g, '-')}`;

export function Avatar({
  size = '2xl',
  category = 'rectangle image',
  swapIcon: SwapIcon = PenTool,
  src,
  alt = '',
  className,
  ...rest
}) {
  const isImage = IMAGE_CATEGORIES.includes(category);

  return (
    <span
      {...rest}
      className={['avatar', `avatar--${size}`, categoryClass(category), className]
        .filter(Boolean)
        .join(' ')}
    >
      {isImage && src && <img className="avatar__image" src={src} alt={alt} />}
      {category === 'icon' && SwapIcon && (
        <SwapIcon className="avatar__icon" aria-hidden="true" focusable="false" />
      )}
    </span>
  );
}

export default Avatar;
