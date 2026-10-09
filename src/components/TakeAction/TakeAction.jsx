import { Clock } from 'lucide-react';
import { ButtonCTA } from '../ButtonCTA/ButtonCTA';
import './TakeAction.css';

// Figma: CardContent/TakeAction, node 32:652. The foot of a card: the time
// left to act (a clock and a line of text) on one side, and a ButtonCTA on
// the other, under a divider.
//
// Figma reports no component properties for 32:652. `timeRemaining`,
// `buttonLabel` and `buttonProps` are provisional, awaiting owner
// confirmation (docs/take-action-prop-names.md).
//
// The button is the existing ButtonCTA, imported as it is: primary, md, no
// icons, as Figma's instance 32:628 sets it. Its hover, press, focus and
// disabled states are ButtonCTA's own. `buttonProps` passes anything else
// (onClick, state, type, aria attributes) straight through to it.

export function TakeAction({
  timeRemaining = 'Closes in 12 days',
  buttonLabel = 'Apply Now',
  buttonProps,
  className,
  ...rest
}) {
  return (
    <div {...rest} className={['take-action', className].filter(Boolean).join(' ')}>
      <p className="take-action__time">
        <Clock className="take-action__icon" aria-hidden="true" focusable="false" />
        <span className="take-action__text">{timeRemaining}</span>
      </p>
      <ButtonCTA
        category="primary"
        size="md"
        leadingIcon={false}
        trailingIcon={false}
        {...buttonProps}
        buttonLabel={buttonLabel}
      />
    </div>
  );
}

export default TakeAction;
