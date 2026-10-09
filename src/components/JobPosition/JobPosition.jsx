import { Mars, Users } from 'lucide-react';
import { Label } from '../Label/Label';
import './JobPosition.css';

// Figma: CardContent/JobPosition, node 32:258. A molecule: the job title
// above a row of two Label instances (32:239 and 32:247, brand / md / idle).
//
// `jobTitle` and `showLabel` are named as the Figma MCP reports the component
// properties. The pill props (`openingsText`, `openingsIcon`, `genderText`,
// `genderIcon`) have no Figma property: the owner ruled on 2026-10-09 that
// the pill texts and icons are sample defaults that change per use. The
// names are proposed for review in docs/job-position-prop-names.md.
//
// Owner rulings, 2026-10-09:
// - Label is imported unchanged, at its own md padding (spacing-padding-sm).
//   Figma's instance override to spacing-padding-xs is not built, and
//   Label's styles are not overridden here.
// - The component hugs its content. A long job title stays on one line and
//   ends in an ellipsis when the parent limits the width; the full title is
//   also set as the `title` attribute. The pill row keeps one line and may
//   overflow a narrow parent.
// - No interaction states: Figma designs none and the content is not
//   interactive.
//
// Default icons: Figma's "people" and "gender" icons, mapped to Lucide Users
// and Mars, pending the Designer's confirmation.

export function JobPosition({
  jobTitle = 'Senior Product Designer',
  showLabel = true,
  openingsText = '3 openings',
  openingsIcon = Users,
  genderText = 'opens to male',
  genderIcon = Mars,
  className,
  ...rest
}) {
  return (
    <div {...rest} className={['job-position', className].filter(Boolean).join(' ')}>
      <p className="job-position__title" title={jobTitle}>{jobTitle}</p>
      {showLabel && (
        <div className="job-position__labels">
          <Label category="brand" size="md" state="idle" labelText={openingsText} swapIcon={openingsIcon} />
          <Label category="brand" size="md" state="idle" labelText={genderText} swapIcon={genderIcon} />
        </div>
      )}
    </div>
  );
}

export default JobPosition;
