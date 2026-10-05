// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=58-406
import { NavItems } from './NavItems';
import navItemsCss from './NavItems.css?raw';
import sample from '../Avatar/avatar-sample.png';
import { MODES, exists, referencedTokens, resolve } from '../../../stories/lib/tokens.js';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';
const NODE = '58-406';

export default {
  title: 'Components/Header/NavItems',
  component: NavItems,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: `${FIGMA}?node-id=${NODE}` },
    docs: {
      description: {
        component: `Header navigation items. Figma: [Header/NavItems](${FIGMA}?node-id=${NODE}). ` +
          'Composes NavLabel, two IconButtons (bell and mail) and an xl circle-image Avatar, imported as ' +
          'they are. Figma gives NavItems no component properties, no variants and no states of its own; ' +
          'each child keeps its own states through real input (hover the label; hover or press a button). ' +
          '`navLabelProps`, `notificationButtonProps`, `mailButtonProps` and `avatarProps` pass straight ' +
          'through to the children (docs/nav-items-prop-names.md). The avatar image is a neutral stand-in, ' +
          'not Figma content.',
      },
    },
  },
  argTypes: {
    navLabelProps: { control: 'object' },
    notificationButtonProps: { control: 'object' },
    mailButtonProps: { control: 'object' },
    avatarProps: { control: 'object' },
  },
  args: {
    navLabelProps: { href: '#', navLabelText: 'Nav Label' },
    avatarProps: { src: sample, alt: 'Sample avatar' },
  },
};

export const Default = {
  name: 'Default',
  parameters: {
    design: { type: 'figma', url: `${FIGMA}?node-id=${NODE}` },
    docs: { description: { story: `Figma node [${NODE.replace('-', ':')}](${FIGMA}?node-id=${NODE}).` } },
  },
};

// Every token NavItems.css references, followed through each alias in every
// mode. The list is read from the component's own CSS and the build output,
// so it can never drift from either. The children's tokens are listed in
// their own stories.
export const Tokens = {
  name: 'Tokens',
  parameters: {
    layout: 'padded',
    docs: { description: { story: 'Read from NavItems.css and build/css/*.css by stories/lib/tokens.js.' } },
  },
  render: () => {
    const names = referencedTokens(navItemsCss);
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
