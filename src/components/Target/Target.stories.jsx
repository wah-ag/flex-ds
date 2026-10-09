// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=32-273
import { Target } from './Target';
import targetCss from './Target.css?raw';
import { MODES, exists, referencedTokens, resolve } from '../../../stories/lib/tokens.js';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';
const NODE = '32-273';
const figmaLink = `Figma node [${NODE.replace('-', ':')}](${FIGMA}?node-id=${NODE}).`;

export default {
  title: 'Components/CardContent/Target',
  component: Target,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: `${FIGMA}?node-id=${NODE}` },
    docs: {
      description: {
        component: `Target card content. Figma: [CardContent/Target](${FIGMA}?node-id=${NODE}). ` +
          'A target name (label/md, text-neutral-secondary) above its value (body/md-bold, text-neutral-bold), ' +
          'spacing-gap-xs apart. `targetName` and `targetValue` are the Figma text properties ' +
          '(docs/target-prop-names.md). The component hugs its content: the value stays on one line and sets the ' +
          'width, and the name fills that width and wraps inside it, as Figma lays them out. Figma designs no ' +
          'variants, sizes or interaction states, and the content is not interactive.',
      },
    },
  },
  argTypes: {
    targetName: { control: 'text' },
    targetValue: { control: 'text' },
  },
  args: {
    targetName: 'Experience',
    targetValue: '5 - 7 Years',
  },
};

export const Default = {
  name: 'Default',
  parameters: { docs: { description: { story: `${figmaLink} The component as Figma draws it.` } } },
};

// Every token Target.css references, followed through each alias in every
// mode. Read from the component's own CSS and the build output, so it can
// never drift from either.
export const Tokens = {
  name: 'Tokens',
  parameters: {
    layout: 'padded',
    docs: { description: { story: 'Read from Target.css and build/css/*.css by stories/lib/tokens.js.' } },
  },
  render: () => {
    const names = referencedTokens(targetCss);
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
