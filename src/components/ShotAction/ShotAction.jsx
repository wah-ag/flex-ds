import { Bookmark } from 'lucide-react';
import { ButtonCTA } from '../ButtonCTA/ButtonCTA';

// Figma: Button/ShotAction, node 31:191.
// `state` is Figma's only component property: idle (31:190) and active (31:189).
// Each look is a ButtonCTA instance, size sm, leading icon only, so ShotAction
// imports ButtonCTA and carries no styles of its own. The button fits its
// label, as ButtonCTA does (owner decision: no width token).

// Lucide has no solid bookmark. By owner decision, the active look fills the
// Lucide Bookmark with currentColor, so it follows the label colour.
function BookmarkFilled(props) {
  return <Bookmark {...props} fill="currentColor" />;
}

const LOOK = {
  idle: { category: 'secondary', buttonLabel: 'Save', swapIcon: Bookmark },
  active: { category: 'primary', buttonLabel: 'Saved', swapIcon: BookmarkFilled },
};

// The parent owns `state`: a click calls `onClick`, and ShotAction never
// flips itself. Other interaction states are out of scope by owner decision;
// see docs/shot-action-prop-names.md.
export function ShotAction({ state = 'idle', ...rest }) {
  const look = LOOK[state] ?? LOOK.idle;

  return (
    <ButtonCTA
      {...rest}
      {...look}
      size="sm"
      state="idle"
      leadingIcon
      trailingIcon={false}
      aria-pressed={state === 'active'}
    />
  );
}

export default ShotAction;
