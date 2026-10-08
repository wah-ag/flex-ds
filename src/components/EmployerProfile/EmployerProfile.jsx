import { Avatar } from '../Avatar/Avatar';
import './EmployerProfile.css';

// Figma: CardContent/EmployerProfile, node 32:337. A molecule: an Avatar
// (32:322, xl, rectangle image) beside a column holding the employer title
// and an optional helper line.
//
// `employerTitle`, `postedTime` and `showHelperText` are named as the Figma
// MCP reports the component properties. `avatarProps` has no Figma property;
// it passes straight through to Avatar (src, alt, ...) and was approved by
// the owner on 2026-10-08 (docs/employer-profile-prop-names.md).
//
// Owner rulings, 2026-10-08:
// - Width: Figma's unbound 198 is not built. The component hugs its content.
// - A long employer title stays on one line and ends in an ellipsis when the
//   parent limits the width.
// - No interaction states: Figma designs none and the content is not
//   interactive.

export function EmployerProfile({
  employerTitle = 'Hire-Me Co,Ltd.',
  postedTime = 'Posted 2 days ago',
  showHelperText = true,
  avatarProps,
  className,
  ...rest
}) {
  return (
    <div {...rest} className={['employer-profile', className].filter(Boolean).join(' ')}>
      <Avatar size="xl" category="rectangle image" {...avatarProps} />
      <div className="employer-profile__text">
        <p className="employer-profile__title" title={employerTitle}>
          {employerTitle}
        </p>
        {showHelperText && <p className="employer-profile__helper">{postedTime}</p>}
      </div>
    </div>
  );
}

export default EmployerProfile;
