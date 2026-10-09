import { EmployerProfile } from '../EmployerProfile/EmployerProfile';
import { JobPosition } from '../JobPosition/JobPosition';
import './CardHeader.css';

// Figma: CardContent/CardHeader, node 32:346. An organism: a column holding
// an EmployerProfile (instance 32:338) above a JobPosition (instance 32:286),
// with the "header slot" (32:344) at the far end of the row.
//
// `showHeaderSlot` and `children` (the slot's content) are named as the Figma
// MCP reports the component properties; the owner confirmed them on
// 2026-10-09. `employerProfileProps` and `jobPositionProps` have no Figma
// property: they pass straight through to the two imported components and
// were approved by the owner on 2026-10-09 (docs/card-header-prop-names.md).
//
// Owner rulings, 2026-10-09:
// - The row fills its parent; Figma's unbound 439 width is not built.
// - The column and the slot keep at least spacing-gap-lg between them.
// - The slot hugs its content and sits at the top; Figma's unbound 40
//   height is not built.
// - EmployerProfile and JobPosition are imported as they are. Figma's
//   instance overrides (EmployerProfile at 252 wide, JobPosition's
//   spacing-gap-xs title gap, the Labels' spacing-padding-xs) are not built;
//   the JobPosition gap is a Figma mismatch the Designer fixes in Figma.
// - No interaction states: CardHeader is not interactive. Whatever goes in
//   the slot brings its own states.

export function CardHeader({
  showHeaderSlot = true,
  children = null,
  employerProfileProps,
  jobPositionProps,
  className,
  ...rest
}) {
  return (
    <div {...rest} className={['card-header', className].filter(Boolean).join(' ')}>
      <div className="card-header__content">
        <EmployerProfile {...employerProfileProps} />
        <JobPosition {...jobPositionProps} />
      </div>
      {showHeaderSlot && <div className="card-header__slot">{children}</div>}
    </div>
  );
}

export default CardHeader;
