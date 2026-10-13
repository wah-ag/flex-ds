// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=45-324
import { BellRing, Mail, Bookmark } from 'lucide-react';
import { IconButton } from './IconButton';
import iconButtonCss from './IconButton.css?raw';
import { MODES, exists, referencedTokens, resolve } from '../../../stories/lib/tokens.js';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';

const CATEGORIES = ['stroke', 'default-fill', 'error-fill'];
const STATES = ['idle', 'hover', 'press', 'disable'];

// Each cell's own Figma variant node. IconButton has one size (48 x 48,
// size/control/lg) and no size property; the stories name it lg.
const NODES = {
  stroke: { idle: '45-323', hover: '45-322', press: '77-317', disable: '77-320' },
  'default-fill': { idle: '224-908', hover: '224-914', press: '224-921', disable: '224-927' },
  'error-fill': { idle: '224-930', hover: '224-936', press: '224-942', disable: '224-954' },
};

const ICONS = { BellRing, Mail, Bookmark };

export default {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: `${FIGMA}?node-id=45-324` },
    docs: {
      description: {
        component: `Icon-only button, one size (lg). Figma: [IconButton](${FIGMA}?node-id=45-324). ` +
          '`category` and `state` are the Figma variant properties and `swapIcon` is its instance swap ' +
          '(docs/icon-button-prop-names.md). `hover` and `press` come from real input; passing them as `state` ' +
          'pins the look for review. `disable` sets the native disabled attribute. ' +
          'An icon-only button has no visible label, so give it an `aria-label`.',
      },
    },
  },
  argTypes: {
    category: { control: 'inline-radio', options: CATEGORIES },
    state: { control: 'inline-radio', options: STATES },
    swapIcon: { control: 'select', options: Object.keys(ICONS), mapping: ICONS },
    type: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
  },
  args: {
    category: 'stroke',
    state: 'idle',
    swapIcon: 'BellRing',
    'aria-label': 'Notifications',
  },
};

const cell = (category, state) => {
  const node = NODES[category][state];
  return {
    name: `${category} / lg / ${state}`,
    args: { category, state },
    parameters: {
      design: { type: 'figma', url: `${FIGMA}?node-id=${node}` },
      docs: {
        description: {
          story: `Figma node [${node.replace('-', ':')}](${FIGMA}?node-id=${node}): ` +
            `state=${state}, category=${category}.`,
        },
      },
    },
  };
};

export const StrokeLgIdle = cell('stroke', 'idle');
export const StrokeLgHover = cell('stroke', 'hover');
export const StrokeLgPress = cell('stroke', 'press');
export const StrokeLgDisable = cell('stroke', 'disable');

export const DefaultFillLgIdle = cell('default-fill', 'idle');
export const DefaultFillLgHover = cell('default-fill', 'hover');
export const DefaultFillLgPress = cell('default-fill', 'press');
export const DefaultFillLgDisable = cell('default-fill', 'disable');

export const ErrorFillLgIdle = cell('error-fill', 'idle');
export const ErrorFillLgHover = cell('error-fill', 'hover');
export const ErrorFillLgPress = cell('error-fill', 'press');
export const ErrorFillLgDisable = cell('error-fill', 'disable');

// The whole Figma matrix at once, laid out as the component set is:
// one column per category, one row per state.
export const Matrix = {
  name: 'Matrix (category x state)',
  parameters: {
    docs: { description: { story: `Every cell of [IconButton](${FIGMA}?node-id=45-324), as Figma lays it out.` } },
  },
  render: (args) => (
    <table>
      <thead>
        <tr>
          <th scope="col">state</th>
          {CATEGORIES.map((category) => <th scope="col" key={category}>{category}</th>)}
        </tr>
      </thead>
      <tbody>
        {STATES.map((state) => (
          <tr key={state}>
            <th scope="row">{state}</th>
            {CATEGORIES.map((category) => (
              <td key={category}>
                <IconButton {...args} category={category} state={state} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

// Every token IconButton.css references, followed through each alias in
// every mode. Read from the component's own CSS and the build output, so it
// can never drift from either.
export const Tokens = {
  name: 'Tokens',
  parameters: {
    layout: 'padded',
    docs: { description: { story: 'Read from IconButton.css and build/css/*.css by stories/lib/tokens.js.' } },
  },
  render: () => {
    const names = referencedTokens(iconButtonCss);
    return (
      <table>
        <thead>
          <tr>
            <th scope="col">Token</th>
            {MODES.map((mode) => <th scope="col" key={mode.id}>{mode.id}</th>)}
          </tr>
        </thead>
        <tbody>
          {names.map((name) => (
            <tr key={name}>
              <th scope="row"><code>{name}</code></th>
              {MODES.map((mode) => {
                const { chain, value } = resolve(name, mode);
                return (
                  <td key={mode.id}>
                    {exists(name) && value !== null
                      ? <code title={chain.join(' → ')}>{value}</code>
                      : <strong>missing from the build</strong>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};
