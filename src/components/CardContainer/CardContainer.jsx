
// Figma: CardContainer, node 36:158. Props are named as Figma names its
// component properties (docs/card-container-prop-names.md):
// - `state`: idle, hover, active.
// - `card slot` is Figma's slot. It is the `cardSlot` prop, the literal
//   camelCase of the Figma name, by owner ruling (2026-10-15). React's
//   `children` is not part of the API: it is neither rendered nor passed to
//   the root <div>.
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

export function CardContainer({ state = 'idle', cardSlot, className, ...props }) {
  // `children` is not part of the API (the slot is `cardSlot`). Drop it so
  // it never reaches the root <div> through the pass-through attributes.
  const { children: _children, ...rest } = props;
  const look = STATES.includes(state) ? state : 'idle';

  return (
    <div
      {...rest}
      className={['card-container', className].filter(Boolean).join(' ')}
      data-state={look}
    >
      {cardSlot}
    </div>
  );
}

export default CardContainer;
