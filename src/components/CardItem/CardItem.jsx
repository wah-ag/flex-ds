import { BtnGroup } from '../BtnGroup/BtnGroup';
import { CardHeader } from '../CardHeader/CardHeader';
import { Target } from '../Target/Target';
import './CardItem.css';

// Figma: CardContent/CardItem, node 32:651. A molecule: a CardHeader
// (instance 32:541) with a BtnGroup (instance 32:576) in its header slot,
// above a row of three Targets ("Container", 32:285), and a bottom Slot
// (32:647) under both.
//
// `showSlot` and `children` (the bottom Slot's content) are named as the
// Figma MCP reports the component properties. The other props have no Figma
// property and were approved by the owner on 2026-10-10
// (docs/card-item-prop-names.md):
// - `targets`: an array of Target props, one Target per entry, in order.
//   The default is the three Figma draws.
// - `employerProfileProps`, `jobPositionProps`: pass through to CardHeader.
// - `shotActionProps`, `buttonCTAProps`: pass through to BtnGroup, which is
//   fixed content in CardHeader's header slot (no slot prop).
//
// Owner rulings, 2026-10-10:
// - The root fills its parent; Figma's fixed 454 width is not built.
// - The bottom Slot hugs its content; Figma's fixed 57 height is not built.
// - The Target row hugs its content; Figma's fixed 48 height is not built.
//   It keeps Figma's space-between distribution.
// - CardHeader is imported as it is. Figma's instance overrides (the
//   252-wide EmployerProfile, the JobPosition title gap) are not rebuilt.
// - No interaction states: CardItem is not interactive. The buttons in
//   BtnGroup and whatever goes in the Slot bring their own.

const DEFAULT_TARGETS = [
  { targetName: 'Experience', targetValue: '5 - 7 Years' },
  { targetName: 'Job Type', targetValue: 'Full - Time' },
  { targetName: 'Salary', targetValue: '15 - 20 Lakh' },
];

export function CardItem({
  showSlot = true,
  children = null,
  targets = DEFAULT_TARGETS,
  employerProfileProps,
  jobPositionProps,
  shotActionProps,
  buttonCTAProps,
  className,
  ...rest
}) {
  return (
    <div {...rest} className={['card-item', className].filter(Boolean).join(' ')}>
      <div className="card-item__content">
        <CardHeader employerProfileProps={employerProfileProps} jobPositionProps={jobPositionProps}>
          <BtnGroup shotActionProps={shotActionProps} buttonCTAProps={buttonCTAProps} />
        </CardHeader>
        <div className="card-item__targets">
          {targets.map((target, index) => (
            <Target key={`${index}-${target.targetName ?? ''}`} {...target} />
          ))}
        </div>
      </div>
      {showSlot && <div className="card-item__slot">{children}</div>}
    </div>
  );
}

export default CardItem;
