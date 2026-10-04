import './FieldLabel.css';

// FieldLabel: the visible label above a form field, shared by TextField and
// PasswordField. It has no Figma node of its own; it is the label text layer
// inside InputField (64:556) and PasswordField (95:596, layer 93:575),
// extracted on 2026-10-04 by owner decision so both import it
// (docs/field-control-prop-names.md).
//
// It is a real <label>: pass `htmlFor` the id of the input it names.
export function FieldLabel({ labelText, htmlFor, className, ...rest }) {
  return (
    <label
      {...rest}
      className={['field-label', className].filter(Boolean).join(' ')}
      htmlFor={htmlFor}
    >
      {labelText}
    </label>
  );
}

export default FieldLabel;
