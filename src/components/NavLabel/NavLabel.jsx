import './NavLabel.css';

// Figma: Header/NavLabel, node 55:34. Props are named as Figma names its
// component properties (docs/nav-label-prop-names.md):
// - `type`: idle, hover, active.
// - `navLabelText`: the label, default "Nav Label".
// - `showNavLine`: whether the underline shows on hover and active.
//
// NavLabel is a header navigation link, so it renders an <a>. Its HTML
// attributes (`href`, `onClick`, `target`, ...) pass through; give it an
// `href` so it is a real, focusable link.
//
// States come from real input:
// - `hover` is a real pointer over the link;
// - `active` is the current page, and sets `aria-current="page"`.
// Passing `hover` as `type` only pins the look, for docs. Hover and active
// look the same, as drawn. Figma designs no focused, pressed or disabled
// state, and by owner ruling (2026-10-04) none is invented: focus keeps the
// browser's default outline.
//
// `type` is consumed here and never forwarded, so it never reaches the <a>'s
// own HTML `type` attribute.

const TYPES = ['idle', 'hover', 'active'];

export function NavLabel({
  type = 'idle',
  navLabelText = 'Nav Label',
  showNavLine = true,
  className,
  ...rest
}) {
  const look = TYPES.includes(type) ? type : 'idle';

  return (
    <a
      aria-current={look === 'active' ? 'page' : undefined}
      {...rest}
      className={['nav-label', className].filter(Boolean).join(' ')}
      data-type={look}
    >
      <span className="nav-label__text">{navLabelText}</span>
      {showNavLine && <span className="nav-label__line" aria-hidden="true" />}
    </a>
  );
}

export default NavLabel;
