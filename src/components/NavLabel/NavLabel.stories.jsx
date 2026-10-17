// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=55-34
import { NavLabel } from './NavLabel';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';

// Each state's own Figma variant node.
const NODES = {
  idle: '191-1243',
  hover: '55-32',
  active: '55-33',
};

export default {
  title: 'Components/Header/NavLabel',
  component: NavLabel,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: `${FIGMA}?node-id=55-34` },
    docs: {
      description: {
        component: `Header navigation link. Figma: [Header/NavLabel](${FIGMA}?node-id=55-34). ` +
          '`hover` comes from a real pointer; passing it as `state` pins the look for review. ' +
          '`active` marks the current page (`aria-current="page"`) and paints the underline. ' +
          'Idle and hover keep the underline\'s space but paint nothing, as drawn, so the text sits at the ' +
          'same height in every state and does not jump on hover (owner ruling 2026-10-14). ' +
          '`showNavLine` turns the underline slot on or off in every state. Width hugs the text. ' +
          'Figma designs no focused, pressed or disabled state; by owner ruling (2026-10-04) none is ' +
          'invented and focus keeps the browser default outline. HTML attributes (`href`, `onClick`, ...) ' +
          'pass through to the `<a>`. See docs/nav-label-prop-names.md.',
      },
    },
  },
  argTypes: {
    state: { control: 'inline-radio', options: Object.keys(NODES) },
    navLabelText: { control: 'text' },
    showNavLine: { control: 'boolean' },
  },
  args: {
    state: 'idle',
    navLabelText: 'Nav Label',
    showNavLine: true,
    href: '#',
  },
};

const cell = (state, showNavLine = true) => {
  const node = NODES[state];
  return {
    name: showNavLine ? state : `${state}, showNavLine off`,
    args: { state, showNavLine },
    parameters: {
      design: { type: 'figma', url: `${FIGMA}?node-id=${node}` },
      docs: { description: { story: `Figma node [${node}](${FIGMA}?node-id=${node}).` } },
    },
  };
};

export const Idle = cell('idle');
export const Hover = cell('hover');
export const Active = cell('active');
export const HoverNoNavLine = cell('hover', false);
export const ActiveNoNavLine = cell('active', false);
