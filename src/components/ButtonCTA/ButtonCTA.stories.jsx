// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=16-438
import { ArrowRight, Circle, Plus } from 'lucide-react';
import { ButtonCTA } from './ButtonCTA';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';

// Each cell's own Figma variant node, keyed `type/size/state`.
const NODES = {
  'primary/lg/idle': '16-442', 'primary/md/idle': '16-401', 'primary/sm/idle': '16-426',
  'primary/lg/hover': '16-423', 'primary/md/hover': '16-413', 'primary/sm/hover': '16-412',
  'primary/lg/press': '16-416', 'primary/md/press': '16-415', 'primary/sm/press': '16-410',
  'primary/lg/focus': '16-421', 'primary/md/focus': '16-435', 'primary/sm/focus': '16-417',
  'primary/lg/disable': '16-414', 'primary/md/disable': '16-424', 'primary/sm/disable': '16-428',
  'primary/lg/error': '16-434', 'primary/md/error': '16-431', 'primary/sm/error': '16-418',
  'secondary/lg/idle': '16-422', 'secondary/md/idle': '16-425', 'secondary/sm/idle': '16-433',
  'secondary/lg/hover': '16-409', 'secondary/md/hover': '16-430', 'secondary/sm/hover': '16-436',
  'secondary/lg/press': '16-403', 'secondary/md/press': '16-402', 'secondary/sm/press': '16-429',
  'secondary/lg/focus': '16-437', 'secondary/md/focus': '16-419', 'secondary/sm/focus': '16-432',
  'secondary/lg/disable': '16-406', 'secondary/md/disable': '16-405', 'secondary/sm/disable': '16-404',
  'secondary/lg/error': '16-420', 'secondary/md/error': '16-408', 'secondary/sm/error': '16-407',
};

const ICONS = { Circle, ArrowRight, Plus };

export default {
  title: 'Components/ButtonCTA',
  component: ButtonCTA,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `Call-to-action button. Figma: [ButtonCTA](${FIGMA}?node-id=16-438). ` +
          '`hover`, `press` and `focus` come from real input; passing them as `state` pins the look for review.',
      },
    },
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['primary', 'secondary'] },
    size: { control: 'inline-radio', options: ['lg', 'md', 'sm'] },
    state: { control: 'select', options: ['idle', 'hover', 'press', 'focus', 'disable', 'error'] },
    swapIcon: { control: 'select', options: Object.keys(ICONS), mapping: ICONS },
    htmlType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
  },
  args: {
    type: 'primary',
    size: 'lg',
    state: 'idle',
    buttonLabel: 'Component',
    leadingIcon: true,
    trailingIcon: true,
    swapIcon: 'Circle',
  },
};

const cell = (type, size, state) => {
  const node = NODES[`${type}/${size}/${state}`];
  return {
    name: `${type} / ${size} / ${state}`,
    args: { type, size, state },
    parameters: {
      design: { type: 'figma', url: `${FIGMA}?node-id=${node}` },
      docs: { description: { story: `Figma node [${node}](${FIGMA}?node-id=${node}).` } },
    },
  };
};

export const PrimaryLgIdle = cell('primary', 'lg', 'idle');
export const PrimaryMdIdle = cell('primary', 'md', 'idle');
export const PrimarySmIdle = cell('primary', 'sm', 'idle');
export const PrimaryLgHover = cell('primary', 'lg', 'hover');
export const PrimaryMdHover = cell('primary', 'md', 'hover');
export const PrimarySmHover = cell('primary', 'sm', 'hover');
export const PrimaryLgPress = cell('primary', 'lg', 'press');
export const PrimaryMdPress = cell('primary', 'md', 'press');
export const PrimarySmPress = cell('primary', 'sm', 'press');
export const PrimaryLgFocus = cell('primary', 'lg', 'focus');
export const PrimaryMdFocus = cell('primary', 'md', 'focus');
export const PrimarySmFocus = cell('primary', 'sm', 'focus');
export const PrimaryLgDisable = cell('primary', 'lg', 'disable');
export const PrimaryMdDisable = cell('primary', 'md', 'disable');
export const PrimarySmDisable = cell('primary', 'sm', 'disable');
export const PrimaryLgError = cell('primary', 'lg', 'error');
export const PrimaryMdError = cell('primary', 'md', 'error');
export const PrimarySmError = cell('primary', 'sm', 'error');

export const SecondaryLgIdle = cell('secondary', 'lg', 'idle');
export const SecondaryMdIdle = cell('secondary', 'md', 'idle');
export const SecondarySmIdle = cell('secondary', 'sm', 'idle');
export const SecondaryLgHover = cell('secondary', 'lg', 'hover');
export const SecondaryMdHover = cell('secondary', 'md', 'hover');
export const SecondarySmHover = cell('secondary', 'sm', 'hover');
export const SecondaryLgPress = cell('secondary', 'lg', 'press');
export const SecondaryMdPress = cell('secondary', 'md', 'press');
export const SecondarySmPress = cell('secondary', 'sm', 'press');
export const SecondaryLgFocus = cell('secondary', 'lg', 'focus');
export const SecondaryMdFocus = cell('secondary', 'md', 'focus');
export const SecondarySmFocus = cell('secondary', 'sm', 'focus');
export const SecondaryLgDisable = cell('secondary', 'lg', 'disable');
export const SecondaryMdDisable = cell('secondary', 'md', 'disable');
export const SecondarySmDisable = cell('secondary', 'sm', 'disable');
export const SecondaryLgError = cell('secondary', 'lg', 'error');
export const SecondaryMdError = cell('secondary', 'md', 'error');
export const SecondarySmError = cell('secondary', 'sm', 'error');
