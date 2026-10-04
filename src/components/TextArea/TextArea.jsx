import { useId } from 'react';
import { FieldLabel } from '../FieldLabel/FieldLabel';
import './TextArea.css';

// Figma: TextArea, node 110:1364. Props are named as Figma names its
// component properties (docs/text-area-prop-names.md):
// - `state`: idle, hover, press, active, disable.
// - `placeholderText`: the placeholder, default "Enter your text".
// - `textAreaLevelText`: the label, default "Text Area". Figma spells it this
//   way; a rename to `labelText` is proposed for review, not applied.
//
// The label is FieldLabel (code-only, imported). The box is the <textarea>
// itself, so the browser's own resize handle can size it: FieldControl is an
// <input> and cannot be reused here.
//
// States come from real input:
// - `hover` is a real pointer over the box;
// - `press` is the pointer held down on it;
// - `active` is the box focused (typing), by pointer or keyboard;
// - `disable` really disables the <textarea>.
// Passing `hover`, `press` or `active` as `state` only pins the look, for
// docs. Focus and error states are deferred by owner ruling (2026-10-04).
//
// The input's own HTML attributes (`id`, `name`, `value`, `defaultValue`,
// `onChange`, `rows`, ...) pass through to the <textarea>. `id` defaults to a
// generated one, so the label is always tied to it.

const STATES = ['idle', 'hover', 'press', 'active', 'disable'];

export function TextArea({
  state = 'idle',
  placeholderText = 'Enter your text',
  textAreaLevelText = 'Text Area',
  id,
  className,
  ...rest
}) {
  const generatedId = useId();
  const textAreaId = id ?? generatedId;
  const look = STATES.includes(state) ? state : 'idle';

  return (
    <div className={['text-area', className].filter(Boolean).join(' ')}>
      <FieldLabel labelText={textAreaLevelText} htmlFor={textAreaId} />
      <textarea
        {...rest}
        id={textAreaId}
        className="text-area__box"
        data-state={look}
        placeholder={placeholderText}
        disabled={look === 'disable'}
      />
    </div>
  );
}

export default TextArea;
