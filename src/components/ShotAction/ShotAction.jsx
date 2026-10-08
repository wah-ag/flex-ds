import { Bookmark } from 'lucide-react';
import { ButtonCTA } from '../ButtonCTA/ButtonCTA';
import './ShotAction.css';

// Figma: Button/ShotAction, node 31:191.
// `state` is Figma's only component property: idle (31:190) and active (31:189).
// Each look is a ButtonCTA instance, size sm, leading icon only, so ShotAction
// imports ButtonCTA. Its only styles are its own icon's stroke. The button
// fits its label, as ButtonCTA does (owner decision: no width token).

// The outline bookmark (31:190) strokes at border-width-icon-default (1px,
// owner ruling), falling back to the old border-width-icon until token PR #64
// reaches the build; drawn in screen pixels (see ShotAction.css).
function BookmarkOutline({ className, ...props }) {
  return (
    <Bookmark
      {...props}
      className={[className, 'shot-action__icon'].filter(Boolean).join(' ')}
      nonScalingStroke
    />
  );
}

// Lucide has no solid bookmark. By owner decision, the active look fills the
// Lucide Bookmark with currentColor, so it follows the label colour, and
// draws no stroke: Figma's filled bookmark (31:189) is fill only.
function BookmarkFilled(props) {
  return <Bookmark {...props} fill="currentColor" stroke="none" />;
}

const LOOK = {
  idle: { category: 'secondary', buttonLabel: 'Save', swapIcon: BookmarkOutline },
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
