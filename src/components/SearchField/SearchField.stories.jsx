// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=199-102
import { useState } from 'react';
import { SearchField } from './SearchField';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';
const SET = '199-102';

// Each cell's own Figma variant node, keyed by Figma's `state` value.
const NODES = {
  idle: '199-98',
  hover: '199-99',
  typing: '199-96',
  focus: '199-97',
  error: '199-100',
  disable: '199-101',
};

const nodeLink = (node) => `Figma node [${node.replace('-', ':')}](${FIGMA}?node-id=${node}).`;

export default {
  title: 'Components/SearchBarItem/SearchField',
  component: SearchField,
  parameters: {
    layout: 'padded',
    design: { type: 'figma', url: `${FIGMA}?node-id=${SET}` },
    docs: {
      description: {
        component: `Search input. Figma: [SearchBarItem/SearchField](${FIGMA}?node-id=${SET}). ` +
          'The whole field is FieldControl, imported as it is (size `sm`, hover border brand-hover, Lucide ' +
          '`Search` leading icon, no trailing action). It fills its container. `labelText` is the placeholder ' +
          'and the input\'s aria-label. `hover` comes from a real pointer; `typing` from real focus and input; ' +
          '`focus` is keyboard focus and shows the ring outside the box. Passing any of these as `state` pins ' +
          'the look for review. `error` and `disable` are held. See docs/search-field-prop-names.md.',
      },
    },
  },
  argTypes: {
    state: { control: 'select', options: Object.keys(NODES) },
    labelText: { control: 'text' },
    showLeading: { control: 'boolean' },
  },
  args: {
    state: 'idle',
    labelText: 'Search 250+ Jobs',
    showLeading: true,
  },
};

const cell = (state) => {
  const node = NODES[state];
  return {
    name: state,
    args: { state },
    parameters: {
      design: { type: 'figma', url: `${FIGMA}?node-id=${node}` },
      docs: { description: { story: nodeLink(node) } },
    },
  };
};

export const Idle = cell('idle');
export const Hover = cell('hover');
export const Typing = cell('typing');
export const Focus = cell('focus');
export const ErrorState = cell('error');
export const Disable = cell('disable');

export const NoLeading = {
  name: 'idle, showLeading=false',
  args: { state: 'idle', showLeading: false },
  parameters: {
    design: { type: 'figma', url: `${FIGMA}?node-id=${NODES.idle}` },
    docs: {
      description: {
        story: `${nodeLink(NODES.idle)} Figma's \`showLeading\` property turned off: the Search icon is hidden.`,
      },
    },
  },
};

// The standard value/onChange (owner ruling, 2026-10-10). Typed text and the
// typing look come from FieldControl.
const ControlledSearch = (args) => {
  const [value, setValue] = useState('');
  return <SearchField {...args} value={value} onChange={(event) => setValue(event.target.value)} />;
};

export const Controlled = {
  name: 'idle, controlled value/onChange',
  args: { state: 'idle' },
  render: (args) => <ControlledSearch {...args} />,
  parameters: {
    design: { type: 'figma', url: `${FIGMA}?node-id=${SET}` },
    docs: {
      description: {
        story: `Figma: [SearchBarItem/SearchField](${FIGMA}?node-id=${SET}). A controlled field with the standard ` +
          '`value` and `onChange`. Click or tab in and type: the typing look and the typed-text colour are ' +
          'FieldControl\'s.',
      },
    },
  },
};
