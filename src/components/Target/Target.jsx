import './Target.css';

// Figma: CardContent/Target, node 32:273. An atom: a target name (for
// example "Experience") above its value (for example "5 - 7 Years").
//
// `targetName` and `targetValue` are named as the Figma MCP reports the
// component's text properties (docs/target-prop-names.md).
//
// Figma designs no variants, sizes or interaction states for 32:273, and the
// content is not interactive, so none are built.

export function Target({
  targetName = 'Experience',
  targetValue = '5 - 7 Years',
  className,
  ...rest
}) {
  return (
    <div {...rest} className={['target', className].filter(Boolean).join(' ')}>
      <p className="target__name">{targetName}</p>
      <p className="target__value">{targetValue}</p>
    </div>
  );
}

export default Target;
