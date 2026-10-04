// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=95-596
import { AtSign, Circle, Lock, KeyRound } from 'lucide-react';
import { PasswordField } from './PasswordField';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';

// Each cell's own Figma variant node, keyed by Figma's `state` value.
const NODES = {
  idle: '95-590',
  hover: '149-146',
  active: '95-588',
  focus: '95-593',
  'password visible': '95-591',
  'password invisible': '95-594',
  'error visible': '95-592',
  'error invisible': '95-589',
  disable: '95-595',
};

// Figma's value cells show the entered password "Jae@74".
const WITH_VALUE = ['password visible', 'password invisible', 'error visible', 'error invisible'];

const LEADING_ICONS = { Circle, Lock, KeyRound, AtSign };

export default {
  title: 'Components/PasswordField',
  component: PasswordField,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Password input with a label and a show/hide toggle. Figma: [PasswordField](${FIGMA}?node-id=95-596). ` +
          'It fills its container. `hover`, `active` and `focus` come from real input; passing them as ' +
          '`state` pins the look. `error …` and `disable` are held. The eye toggles visibility; `state` ' +
          'only sets where it starts. Hidden passwords use the browser\'s own bullets. ' +
          'See docs/password-field-prop-names.md.',
      },
    },
  },
  argTypes: {
    state: { control: 'select', options: Object.keys(NODES) },
    labelText: { control: 'text' },
    showLeading: { control: 'boolean' },
    showTrailing: { control: 'boolean' },
    swapLeadingIcon: { control: 'select', options: Object.keys(LEADING_ICONS), mapping: LEADING_ICONS },
  },
  args: {
    state: 'idle',
    labelText: 'Password',
    showLeading: true,
    showTrailing: true,
    swapLeadingIcon: 'Circle',
  },
};

const cell = (state) => {
  const node = NODES[state];
  return {
    name: state,
    args: { state, ...(WITH_VALUE.includes(state) ? { defaultValue: 'Jae@74' } : {}) },
    parameters: {
      design: { type: 'figma', url: `${FIGMA}?node-id=${node}` },
      docs: { description: { story: `Figma node [${node}](${FIGMA}?node-id=${node}).` } },
    },
  };
};

export const Idle = cell('idle');
export const Hover = cell('hover');
export const Active = cell('active');
export const Focus = cell('focus');
export const PasswordVisible = cell('password visible');
export const PasswordInvisible = cell('password invisible');
export const ErrorVisible = cell('error visible');
export const ErrorInvisible = cell('error invisible');
export const Disable = cell('disable');
