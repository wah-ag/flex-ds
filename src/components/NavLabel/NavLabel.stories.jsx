// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=55-34
import { NavLabel } from './NavLabel';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';

// Each type's own Figma variant node.
const NODES = {
  idle: '55-31',
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
          '`hover` comes from a real pointer; passing it as `type` pins the look for review. ' +
          '`active` marks the current page (`aria-current="page"`). Hover and active look the same, as drawn. ' +
          '`showNavLine` turns the underline on hover and active on or off. Width hugs the text. ' +
          'Figma designs no focused, pressed or disabled state; by owner ruling (2026-10-04) none is ' +
          'invented and focus keeps the browser default outline. HTML attributes (`href`, `onClick`, ...) ' +
          'pass through to the `<a>`. See docs/nav-label-prop-names.md.',
      },
    },
  },
  argTypes: {
    type: { control: 'inline-radio', options: Object.keys(NODES) },
    navLabelText: { control: 'text' },
    showNavLine: { control: 'boolean' },
  },
  args: {
    type: 'idle',
    navLabelText: 'Nav Label',
    showNavLine: true,
    href: '#',
  },
};

const cell = (type, showNavLine = true) => {
  const node = NODES[type];
  return {
    name: showNavLine ? type : `${type}, showNavLine off`,
    args: { type, showNavLine },
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
