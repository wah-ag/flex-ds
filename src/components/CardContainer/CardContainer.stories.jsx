// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=36-158
import { CardContainer } from './CardContainer';
import cardContainerCss from './CardContainer.css?raw';
import { MODES, exists, referencedTokens, resolve } from '../../../stories/lib/tokens.js';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';

// Each state's own Figma variant node.
const NODES = {
  idle: '36-157',
  hover: '36-159',
  active: '36-169',
};

// Figma draws the card at a fixed 514 wide with an empty 266-tall slot,
// neither bound to a token. The card itself fills its container (owner
// ruling, 2026-10-04); these two numbers only frame the stories the way
// Figma frames the variants. They are story scaffolding, not component
// values.
const FIGMA_FRAME_WIDTH = 514;
const FIGMA_SLOT_HEIGHT = 266;

// Sample slot content. Its type and colour are semantic tokens.
const SlotContent = () => (
  <div
    style={{
      minHeight: FIGMA_SLOT_HEIGHT,
      font: 'var(--body-md)',
      color: 'var(--text-neutral-base)',
    }}
  >
    Card slot content
  </div>
);

export default {
  title: 'Components/CardContainer',
  component: CardContainer,
  parameters: {
    layout: 'padded',
    design: { type: 'figma', url: `${FIGMA}?node-id=36-158` },
    docs: {
      description: {
        component: `Card surface that holds any content in its slot. Figma: [CardContainer](${FIGMA}?node-id=36-158). ` +
          'Figma\'s `card slot` is React\'s `children` (see docs/card-container-prop-names.md). ' +
          '`hover` comes from a real pointer over an idle card; passing it as `state` pins the look for review. ' +
          '`active` is the card the product has chosen, set with `state="active"`. ' +
          'The card fills its container; Figma\'s fixed 514 width is unbound by owner ruling (2026-10-04). ' +
          'Focus, pressed and disabled are not designed and are skipped by owner ruling (2026-10-04). ' +
          'HTML attributes pass through to the root `<div>`.',
      },
    },
  },
  argTypes: {
    state: { control: 'select', options: Object.keys(NODES) },
    children: { control: false },
  },
  args: {
    state: 'idle',
    children: <SlotContent />,
  },
};

const cell = (state) => {
  const node = NODES[state];
  return {
    name: state,
    args: { state },
    decorators: [
      (Story) => (
        <div style={{ width: FIGMA_FRAME_WIDTH, maxWidth: '100%' }}>
          <Story />
        </div>
      ),
    ],
    parameters: {
      design: { type: 'figma', url: `${FIGMA}?node-id=${node}` },
      docs: { description: { story: `Figma node [${node}](${FIGMA}?node-id=${node}).` } },
    },
  };
};

export const Idle = cell('idle');
export const Hover = cell('hover');
export const Active = cell('active');

// Every token CardContainer.css references, followed through each alias in
// every mode. The list is read from the component's own CSS and the build
// output, so it can never drift from either.
export const Tokens = {
  name: 'Tokens',
  parameters: {
    docs: { description: { story: 'Read from CardContainer.css and build/css/*.css by stories/lib/tokens.js.' } },
  },
  render: () => {
    const names = referencedTokens(cardContainerCss);
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
