
// Figma: Header/NavLabel, node 55:34. Props are named as Figma names its
// component properties (docs/nav-label-prop-names.md):
// - `state`: idle, hover, active. Figma renamed this variant property from
//   `type` to `state` (owner decision, 2026-10-17).
// - `navLabelText`: the label, default "Nav Label".
// - `showNavLine`: whether the underline slot exists (in every state; only
//   active paints it).
//
// NavLabel is a header navigation link, so it renders an <a>. Its HTML
// attributes (`href`, `onClick`, `target`, ...) pass through; give it an
// `href` so it is a real, focusable link.
//
// States come from real input:
// - `hover` is a real pointer over the link;
// - `active` is the current page, and sets `aria-current="page"`.
// Passing `hover` as `state` only pins the look, for docs. Hover and active
// share the brand text colour. Idle, hover and active share one layout,
// but only active paints the underline: Figma keeps the underline's space
// with no fill on idle and hover (design change and owner ruling,
// 2026-10-14), so the text never jumps. Figma designs no focused, pressed or disabled
// state, and by owner ruling (2026-10-04) none is invented: focus keeps the
// browser's default outline.

const STATES = ['idle', 'hover', 'active'];

export function NavLabel({
  state = 'idle',
  navLabelText = 'Nav Label',
  showNavLine = true,
  className,
  ...rest
}) {
  const look = STATES.includes(state) ? state : 'idle';

  return (
    <a
      aria-current={look === 'active' ? 'page' : undefined}
      {...rest}
      className={['nav-label', className].filter(Boolean).join(' ')}
      data-state={look}
    >
      <span className="nav-label__text">{navLabelText}</span>
      {showNavLine && <span className="nav-label__line" aria-hidden="true" />}
    </a>
  );
}

export default NavLabel;
