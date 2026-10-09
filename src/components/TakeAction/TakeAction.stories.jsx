// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=32-652
import { TakeAction } from './TakeAction';
import takeActionCss from './TakeAction.css?raw';
import { MODES, exists, referencedTokens, resolve } from '../../../stories/lib/tokens.js';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';
const NODE = '32-652';
const figmaLink = `Figma node [${NODE.replace('-', ':')}](${FIGMA}?node-id=${NODE}).`;

export default {
  title: 'Components/CardContent/TakeAction',
  component: TakeAction,
  parameters: {
    layout: 'padded',
    design: { type: 'figma', url: `${FIGMA}?node-id=${NODE}` },
    docs: {
      description: {
        component: `Take-action card content. Figma: [CardContent/TakeAction](${FIGMA}?node-id=${NODE}). ` +
          'Under a divider (border-width-divider, border-neutral-base), a Lucide Clock (size-icon-sm, ' +
          'icon-interactive-info) and the time remaining (label/lg, text-interactive-info) sit at the start, and ' +
          'the imported ButtonCTA (primary, md, no icons) sits at the end. The row fills its parent, ButtonCTA keeps ' +
          'its own width, and the time text stays on one line and ends in an ellipsis when space runs out. ' +
          'Prop names, widths and `buttonProps` are provisional, awaiting owner confirmation ' +
          '(docs/take-action-prop-names.md). The button\'s hover, press, focus and disabled states are ButtonCTA\'s own.',
      },
    },
  },
  argTypes: {
    timeRemaining: { control: 'text' },
    buttonLabel: { control: 'text' },
    buttonProps: { control: 'object' },
  },
  args: {
    timeRemaining: 'Closes in 12 days',
    buttonLabel: 'Apply Now',
  },
};

export const Default = {
  name: 'Default',
  parameters: { docs: { description: { story: `${figmaLink} The component as Figma draws it.` } } },
};

// Every token TakeAction.css references, followed through each alias in every
// mode. Read from the component's own CSS and the build output, so it can
// never drift from either. ButtonCTA's tokens are listed in its own stories.
export const Tokens = {
  name: 'Tokens',
  parameters: {
    docs: { description: { story: 'Read from TakeAction.css and build/css/*.css by stories/lib/tokens.js.' } },
  },
  render: () => {
    const names = referencedTokens(takeActionCss);
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
