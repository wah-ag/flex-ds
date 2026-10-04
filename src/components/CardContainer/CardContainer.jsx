import './CardContainer.css';

// Figma: CardContainer, node 36:158. Props are named as Figma names its
// component properties (docs/card-container-prop-names.md):
// - `state`: idle, hover, active.
// - `card slot` is Figma's slot. A JavaScript prop cannot carry a space, so
//   the slot is React's `children`. This mapping is written up for review,
//   not a silent rename.
//
// States come from real input where the product has it:
// - `hover` is a real pointer over an idle card (the default border plus
//   elevation level 1);
// - `active` is held by the product (the card the user has chosen), so it
//   is set through `state="active"` and is never faked by a class on hover.
// Passing `hover` as `state` only pins the look, for docs. Focus, pressed and
// disabled are not designed and are skipped by owner ruling (2026-10-04).
//
// The card fills its container. Figma's width is a fixed 514 bound to no
// token; the owner ruled that is not a gap (2026-10-04). Height hugs the
// slot. Any other HTML attribute passes through to the root <div>.

const STATES = ['idle', 'hover', 'active'];

export function CardContainer({ state = 'idle', children, className, ...rest }) {
  const look = STATES.includes(state) ? state : 'idle';

  return (
    <div
      {...rest}
      className={['card-container', className].filter(Boolean).join(' ')}
      data-state={look}
    >
      {children}
    </div>
  );
}

export default CardContainer;
