// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=110-1364
import { TextArea } from './TextArea';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';

// Each state's own Figma variant node.
const NODES = {
  idle: '110-1363',
  hover: '110-1361',
  press: '110-1359',
  active: '110-1360',
  disable: '110-1362',
};

export default {
  title: 'Components/TextArea',
  component: TextArea,
  parameters: {
    layout: 'padded',
    design: { type: 'figma', url: `${FIGMA}?node-id=110-1364` },
    docs: {
      description: {
        component: `Multi-line text input with a label. Figma: [TextArea](${FIGMA}?node-id=110-1364). ` +
          'It fills its container. `hover` comes from a real pointer, `press` from holding the ' +
          'pointer down on the box, and `active` from focusing it (pointer or keyboard). Passing ' +
          'any of these as `state` pins the look for review. `disable` disables the textarea. ' +
          'Height is 120, resizable from 120 to 150 with the browser\'s own vertical resize ' +
          'handle, by owner ruling (2026-10-04); Figma\'s drawn "long-text" grip is not used. ' +
          'Focus and error states are deferred by owner ruling. HTML attributes (`id`, `name`, ' +
          '`value`, `defaultValue`, `onChange`, ...) pass through to the `<textarea>`. ' +
          'See docs/text-area-prop-names.md.',
      },
    },
  },
  argTypes: {
    state: { control: 'select', options: Object.keys(NODES) },
    placeholderText: { control: 'text' },
    textAreaLevelText: { control: 'text' },
  },
  args: {
    state: 'idle',
    placeholderText: 'Enter your text',
    textAreaLevelText: 'Text Area',
  },
};

const cell = (state) => {
  const node = NODES[state];
  return {
    name: state,
    // Figma's active cell shows the entered text.
    args: { state, ...(state === 'active' ? { defaultValue: 'Use Design Tools like Figma, Sketch' } : {}) },
    parameters: {
      design: { type: 'figma', url: `${FIGMA}?node-id=${node}` },
      docs: { description: { story: `Figma node [${node}](${FIGMA}?node-id=${node}).` } },
    },
  };
};

export const Idle = cell('idle');
export const Hover = cell('hover');
export const Press = cell('press');
export const Active = cell('active');
export const Disable = cell('disable');
