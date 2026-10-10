import { ExternalLink } from 'lucide-react';
import { ButtonCTA } from '../ButtonCTA/ButtonCTA';
import { ShotAction } from '../ShotAction/ShotAction';
import './BtnGroup.css';

// Figma: CardContent/BtnGroup, node 32:573. A row holding a ShotAction
// (instance 32:353, idle: "Save") and a ButtonCTA (instance 32:517:
// secondary, sm, leading icon only, "Share"), spacing-gap-md apart. Both are
// imported as they are; BtnGroup styles only the row.
//
// Figma gives BtnGroup no component properties. Owner rulings, 2026-10-10
// (docs/btn-group-prop-names.md):
// - `shotActionProps` passes through to ShotAction (state, onClick, aria-*).
//   ShotAction keeps its own look; the parent owns `state`.
// - `buttonCTAProps` passes through to the Share ButtonCTA (onClick,
//   aria-*). The Share look (category, size, state, label, icons) is fixed
//   as Figma draws it and cannot be overridden.
// - The Share icon is Lucide `ExternalLink`: Figma's layer is named "share",
//   but its path, scaled 16 → 24, is Lucide ExternalLink's exactly.
// - No interaction states on BtnGroup itself; the buttons keep their own.

export function BtnGroup({ shotActionProps, buttonCTAProps, className, ...rest }) {
  return (
    <div {...rest} className={['btn-group', className].filter(Boolean).join(' ')}>
      <ShotAction {...shotActionProps} />
      <ButtonCTA
        {...buttonCTAProps}
        category="secondary"
        size="sm"
        state="idle"
        buttonLabel="Share"
        leadingIcon
        trailingIcon={false}
        swapIcon={ExternalLink}
      />
    </div>
  );
}

export default BtnGroup;
