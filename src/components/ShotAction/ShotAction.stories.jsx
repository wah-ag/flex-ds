// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=31-191
import { ShotAction } from './ShotAction';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';

// Each state's own Figma variant node. ShotAction has one size.
const NODES = {
  idle: '31-190',
  active: '31-189',
};

export default {
  title: 'Components/ShotAction',
  component: ShotAction,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `Save toggle. Figma: [Button/ShotAction](${FIGMA}?node-id=31-191). ` +
          'Built from ButtonCTA (size sm): `idle` is the secondary look ("Save"), ' +
          '`active` the primary look ("Saved"). The parent sets `state`; a click calls `onClick` ' +
          'and the component never flips itself. `aria-pressed` follows `state`.',
      },
    },
  },
  argTypes: {
    state: { control: 'inline-radio', options: ['idle', 'active'] },
    onClick: { action: 'clicked' },
  },
  args: {
    state: 'idle',
  },
};

const cell = (state) => {
  const node = NODES[state];
  return {
    name: state,
    args: { state },
    parameters: {
      design: { type: 'figma', url: `${FIGMA}?node-id=${node}` },
      docs: { description: { story: `Figma node [${node}](${FIGMA}?node-id=${node}).` } },
    },
  };
};

export const Idle = cell('idle');
export const Active = cell('active');
