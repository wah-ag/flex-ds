import { BellRing, Mail } from 'lucide-react';
import { NavLabel } from '../NavLabel/NavLabel';
import { IconButton } from '../IconButton/IconButton';
import { Avatar } from '../Avatar/Avatar';
import './NavItems.css';

// Figma: Header/NavItems, node 58:406. A molecule: one NavLabel (58:394),
// two IconButtons (58:395, the bell; 58:396, mail) and an Avatar (58:397,
// xl, circle image), in a row with the spacing-gap-lg gap.
//
// Figma gives NavItems no component properties, so it has no Figma-named
// props. Each child is imported as it is and keeps its own props and states;
// the four `…Props` objects below pass straight through to them
// (docs/nav-items-prop-names.md). Defaults are the instances as Figma draws
// them.
//
// NavItems has no state of its own. Hover on the NavLabel, and hover, press
// and disable on the IconButtons, come from the children through real input.

export function NavItems({
  navLabelProps,
  notificationButtonProps,
  mailButtonProps,
  avatarProps,
  className,
  ...rest
}) {
  return (
    <div {...rest} className={['nav-items', className].filter(Boolean).join(' ')}>
      <NavLabel type="idle" navLabelText="Nav Label" {...navLabelProps} />
      <IconButton swapIcon={BellRing} aria-label="Notifications" {...notificationButtonProps} />
      <IconButton swapIcon={Mail} aria-label="Mail" {...mailButtonProps} />
      <Avatar size="xl" category="circle image" {...avatarProps} />
    </div>
  );
}

export default NavItems;
