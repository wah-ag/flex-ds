import { Search } from 'lucide-react';
import { FieldControl } from '../FieldControl/FieldControl';

// Figma: SearchBarItem/SearchField, node 199:102. Props are named as Figma
// names its component properties (`state`, `labelText`, `showLeading`), and
// `state` takes Figma's variant values as written
// (docs/search-field-prop-names.md).
//
// The whole field is FieldControl, imported as it is: the Designer aligned
// SearchField to FieldControl's box on 2026-10-10 (padding, typing look,
// error background), so SearchField adds no styles of its own. It renders
// no label: Figma draws none.
//
// Owner rulings, 2026-10-10:
// - it fills its container (Figma's fixed 352 is ignored);
// - keyboard focus draws the ring outside the box, as FieldControl does, so
//   the height never changes;
// - `labelText` is the placeholder and also the input's aria-label; there
//   is no separate prop for the accessible name;
// - a plain text input with the standard value/onChange, no submit prop;
// - no pressed state and no clear or trailing button;
// - typing and the typed-text colour follow FieldControl.
//
// Looks Figma binds that FieldControl offers as parent choices:
// - hover border is border/interactive/brand-hover (199:99), so
//   hoverBorder="brand-hover";
// - the leading icon stays icon/neutral/primary in keyboard focus (195:1262),
//   which is FieldControl's default (focusLeadingIcon="neutral").
// Figma's height is size/control/md, which is FieldControl's size="sm".
//
// States: `hover` comes from a real pointer; `typing` (focused, with the
// brand caret and brand icon) from real focus and input; `focus` is keyboard
// focus and shows the ring. Passing them as `state` only pins the look, for
// docs. `error` and `disable` are held; `disable` really disables the input.

const STATES = ['idle', 'hover', 'typing', 'focus', 'error', 'disable'];

export function SearchField({
  state = 'idle',
  labelText = 'Search 250+ Jobs',
  showLeading = true,
  className,
  ...rest
}) {
  return (
    <FieldControl
      {...rest}
      className={['search-field', className].filter(Boolean).join(' ')}
      type="text"
      state={STATES.includes(state) ? state : 'idle'}
      size="sm"
      placeholderText={labelText}
      aria-label={labelText}
      showLeading={showLeading}
      leadingIcon={Search}
      showTrailing={false}
      hoverBorder="brand-hover"
    />
  );
}

export default SearchField;
