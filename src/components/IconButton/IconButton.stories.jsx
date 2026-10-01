// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=45-324
import { BellRing, Plus, Search } from 'lucide-react';
import { IconButton } from './IconButton';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';

// Each state's own Figma variant node. IconButton has one size, lg.
const NODES = {
  idle: '45-323',
  hover: '45-322',
  press: '77-317',
  disable: '77-320',
};

const ICONS = { BellRing, Plus, Search };

export default {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `Icon-only button, size lg. Figma: [IconButton](${FIGMA}?node-id=45-324). ` +
          '`hover` and `press` come from real input; passing them as `state` pins the look for review. ' +
          'An icon-only button has no visible label, so give it an `aria-label`.',
      },
    },
  },
  argTypes: {
    state: { control: 'select', options: ['idle', 'hover', 'press', 'disable'] },
    swapIcon: { control: 'select', options: Object.keys(ICONS), mapping: ICONS },
    type: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
  },
  args: {
    state: 'idle',
    swapIcon: 'BellRing',
    'aria-label': 'Notifications',
  },
};

const cell = (state) => {
  const node = NODES[state];
  return {
    name: `lg / ${state}`,
    args: { state },
    parameters: {
      design: { type: 'figma', url: `${FIGMA}?node-id=${node}` },
      docs: { description: { story: `Figma node [${node}](${FIGMA}?node-id=${node}).` } },
    },
  };
};

export const LgIdle = cell('idle');
export const LgHover = cell('hover');
export const LgPress = cell('press');
export const LgDisable = cell('disable');
