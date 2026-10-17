import { UsersRound, VenusAndMars } from 'lucide-react';
import { Label } from '../Label/Label';

// Figma: CardContent/JobPosition, node 32:258. A molecule: the job title
// above a row of two Label instances, brand / md / idle. Figma exposes both
// instances: 32:239 `openingsLabel` and 32:247 `genderLabel`.
//
// Figma component properties (Plugin API, 2026-10-17): `jobTitle` (text) and
// `show label` (boolean), as `jobTitle` and `showLabel` under the camelCase
// convention (docs/button-cta-prop-names.md).
//
// Pill props, owner decision 2026-10-17 (docs/job-position-prop-names.md):
// "Pass-through". `openingsLabel` and `genderLabel` are named after the
// exposed Figma instances. Each is an object of Label's own props
// (`labelText`, `swapIcon`, `showIcon`, `category`, `size`, `state`, ...)
// spread onto its Label. Defaults are the Figma instances' values; any value
// the consumer passes overrides its default. They replace the earlier
// `openingsText`, `openingsIcon`, `genderText` and `genderIcon`.
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
// Default icons: Figma's "people" and "gender" glyphs in 32:239 and 32:247
// are Lucide UsersRound and VenusAndMars; their vector paths match Lucide's
// exactly (QA finding, 2026-10-09).

const PILL = { category: 'brand', size: 'md', state: 'idle' };
const OPENINGS_LABEL = { ...PILL, labelText: '3 openings', swapIcon: UsersRound };
const GENDER_LABEL = { ...PILL, labelText: 'opens to male', swapIcon: VenusAndMars };

export function JobPosition({
  jobTitle = 'Senior Product Designer',
  showLabel = true,
  openingsLabel,
  genderLabel,
  className,
  ...rest
}) {
  return (
    <div {...rest} className={['job-position', className].filter(Boolean).join(' ')}>
      <p className="job-position__title" title={jobTitle}>{jobTitle}</p>
      {showLabel && (
        <div className="job-position__labels">
          <Label {...OPENINGS_LABEL} {...openingsLabel} />
          <Label {...GENDER_LABEL} {...genderLabel} />
        </div>
      )}
    </div>
  );
}

export default JobPosition;
