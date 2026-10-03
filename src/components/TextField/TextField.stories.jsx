// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=64-556
import { AtSign, Circle, CircleX, Mail, Search, X } from 'lucide-react';
import { TextField } from './TextField';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';

// Each cell's own Figma variant node, keyed `size/state`.
const NODES = {
  'lg/idle': '64-557', 'lg/hover': '64-573', 'lg/active': '64-581', 'lg/typing': '64-591',
  'lg/focus': '64-610', 'lg/error': '64-601', 'lg/disable': '64-565',
  'sm/idle': '126-741', 'sm/hover': '126-757', 'sm/active': '126-765', 'sm/typing': '126-775',
  'sm/focus': '126-794', 'sm/error': '126-785', 'sm/disable': '126-749',
};

const LEADING_ICONS = { Circle, Mail, AtSign, Search };
const TRAILING_ICONS = { CircleX, X };

export default {
  title: 'Components/TextField',
  component: TextField,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Text input with a label. Figma: [InputField](${FIGMA}?node-id=64-556). ` +
          'It fills its container. `hover` comes from a real pointer; `active` (focused, empty) and ' +
          '`typing` (focused, with a value) from real focus and input; `focus` is keyboard focus and ' +
          'shows the ring. Passing any of these as `state` pins the look for review. `error` and ' +
          '`disable` are held states. The trailing icon clears the field. Helper Text is deferred ' +
          '(see docs/textfield-prop-names.md).',
      },
    },
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['idle', 'hover', 'active', 'typing', 'focus', 'error', 'disable'],
    },
    size: { control: 'inline-radio', options: ['lg', 'sm'] },
    labelText: { control: 'text' },
    placeholderText: { control: 'text' },
    showLeading: { control: 'boolean' },
    showTrailing: { control: 'boolean' },
    swapLeadingIcon: {
      control: 'select',
      options: Object.keys(LEADING_ICONS),
      mapping: LEADING_ICONS,
    },
    swapTrailingIcon: {
      control: 'select',
      options: Object.keys(TRAILING_ICONS),
      mapping: TRAILING_ICONS,
    },
  },
  args: {
    state: 'idle',
    size: 'lg',
    labelText: 'Email',
    placeholderText: 'Enter your email',
    showLeading: true,
    showTrailing: true,
    swapLeadingIcon: 'Circle',
    swapTrailingIcon: 'CircleX',
  },
};

const cell = (size, state) => {
  const node = NODES[`${size}/${state}`];
  return {
    name: `${size} / ${state}`,
    // Figma's typing cell shows the entered text "Enter your email".
    args: { size, state, ...(state === 'typing' ? { defaultValue: 'Enter your email' } : {}) },
    parameters: {
      design: { type: 'figma', url: `${FIGMA}?node-id=${node}` },
      docs: { description: { story: `Figma node [${node}](${FIGMA}?node-id=${node}).` } },
    },
  };
};

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
