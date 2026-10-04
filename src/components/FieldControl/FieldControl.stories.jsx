// Figma: no node of its own. FieldControl is the "text field" frame inside
// InputField (https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=64-556)
// and PasswordField (node 95-596), extracted so both import it.
import { useState } from 'react';
import { AtSign, Circle, CircleX, Eye, EyeOff, Mail, Search, X } from 'lucide-react';
import { FieldControl } from './FieldControl';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';

const LEADING_ICONS = { Circle, Mail, AtSign, Search };
const TRAILING_ICONS = { CircleX, X, Eye, EyeOff };

export default {
  title: 'Components/FieldControl',
  component: FieldControl,
  parameters: {
    layout: 'padded',
    design: { type: 'figma', url: `${FIGMA}?node-id=64-556` },
    docs: {
      description: {
        component: 'The bordered box of a text input: leading icon, input, caret and one trailing ' +
          'action. Shared by TextField and PasswordField; it has no Figma node of its own and no ' +
          'label (the parent renders the label and passes `id`). `hover` comes from a real pointer; ' +
          '`active` and `typing` from real focus and input; `focus` is keyboard focus and shows the ' +
          'ring. Passing any of these as `state` pins the look. `error` and `disable` are held. ' +
          'See docs/field-control-prop-names.md.',
      },
    },
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['idle', 'hover', 'active', 'typing', 'focus', 'error', 'disable'],
    },
    size: { control: 'inline-radio', options: ['lg', 'sm'] },
    placeholderText: { control: 'text' },
    showLeading: { control: 'boolean' },
    leadingIcon: { control: 'select', options: Object.keys(LEADING_ICONS), mapping: LEADING_ICONS },
    showTrailing: { control: 'boolean' },
    trailingIcon: { control: 'select', options: Object.keys(TRAILING_ICONS), mapping: TRAILING_ICONS },
    trailingLabel: { control: 'text' },
  },
  args: {
    state: 'idle',
    size: 'lg',
    placeholderText: 'Enter your email',
    'aria-label': 'Email',
    showLeading: true,
    leadingIcon: 'Circle',
    showTrailing: true,
    trailingIcon: 'CircleX',
    trailingLabel: 'Clear Email',
  },
};

const cell = (size, state) => ({
  name: `${size} / ${state}`,
  args: { size, state, ...(state === 'typing' ? { defaultValue: 'Enter your email' } : {}) },
});

export const LgIdle = cell('lg', 'idle');
export const LgHover = cell('lg', 'hover');
export const LgActive = cell('lg', 'active');
export const LgTyping = cell('lg', 'typing');
export const LgFocus = cell('lg', 'focus');
export const LgError = cell('lg', 'error');
export const LgDisable = cell('lg', 'disable');

export const SmIdle = cell('sm', 'idle');
export const SmHover = cell('sm', 'hover');
export const SmActive = cell('sm', 'active');
export const SmTyping = cell('sm', 'typing');
export const SmFocus = cell('sm', 'focus');
export const SmError = cell('sm', 'error');
export const SmDisable = cell('sm', 'disable');

export const NoTrailing = {
  name: 'No trailing action',
  args: { showTrailing: false },
};

// The trailing slot as a toggle, the way PasswordField uses it: the parent
// owns the toggled state and swaps the icon and the input type, and the
// toggle is a tab stop (trailingFocusable). Figma shows
// the open eye while the password is visible and the closed eye while hidden.
export const TrailingToggle = {
  name: 'Trailing action as a toggle',
  render: (args) => {
    const [shown, setShown] = useState(false);
    return (
      <FieldControl
        {...args}
        type={shown ? 'text' : 'password'}
        placeholderText="Enter your password"
        aria-label="Password"
        trailingIcon={shown ? Eye : EyeOff}
        trailingLabel="Show password"
        trailingPressed={shown}
        trailingFocusable
        onTrailingClick={() => setShown((value) => !value)}
      />
    );
  },
};
