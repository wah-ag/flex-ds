// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=32-315
import { PenTool, User, Building2 } from 'lucide-react';
import { Avatar } from './Avatar';
import avatarCss from './Avatar.css?raw';
import sample from './avatar-sample.png';
import { MODES, exists, referencedTokens, resolve } from '../../../stories/lib/tokens.js';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';

// Each cell's own Figma variant node, keyed `size/category`.
const NODES = {
  '2xl/rectangle image': '32-324', '2xl/icon': '38-234', '2xl/circle image': '47-333',
  'xl/rectangle image': '32-314', 'xl/icon': '38-250', 'xl/circle image': '47-335',
  'lg/rectangle image': '32-313', 'lg/icon': '38-256', 'lg/circle image': '47-336',
  'md/rectangle image': '32-312', 'md/icon': '38-262', 'md/circle image': '47-337',
  'sm/rectangle image': '32-311', 'sm/icon': '38-268', 'sm/circle image': '47-338',
};

const ICONS = { PenTool, User, Building2 };

export default {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `Avatar. Figma: [Avatar](${FIGMA}?node-id=32-315). ` +
          'Figma has no state property and no image property: `src` and `alt` are proposed in ' +
          'docs/avatar-prop-names.md. The sample image is a neutral stand-in, not Figma content.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['2xl', 'xl', 'lg', 'md', 'sm'] },
    category: { control: 'inline-radio', options: ['rectangle image', 'icon', 'circle image'] },
    swapIcon: { control: 'select', options: Object.keys(ICONS), mapping: ICONS, if: { arg: 'category', eq: 'icon' } },
    src: { control: 'text' },
    alt: { control: 'text' },
  },
  args: {
    size: '2xl',
    category: 'rectangle image',
    swapIcon: 'PenTool',
    src: sample,
    alt: 'Sample avatar',
  },
};

const cell = (size, category) => {
  const node = NODES[`${size}/${category}`];
  return {
    name: `${size} / ${category}`,
    args: { size, category },
    parameters: {
      design: { type: 'figma', url: `${FIGMA}?node-id=${node}` },
      docs: { description: { story: `Figma node [${node}](${FIGMA}?node-id=${node}).` } },
    },
  };
};

export const Size2xlRectangleImage = cell('2xl', 'rectangle image');
export const Size2xlIcon = cell('2xl', 'icon');
export const Size2xlCircleImage = cell('2xl', 'circle image');

export const XlRectangleImage = cell('xl', 'rectangle image');
export const XlIcon = cell('xl', 'icon');
export const XlCircleImage = cell('xl', 'circle image');

export const LgRectangleImage = cell('lg', 'rectangle image');
export const LgIcon = cell('lg', 'icon');
export const LgCircleImage = cell('lg', 'circle image');

export const MdRectangleImage = cell('md', 'rectangle image');
export const MdIcon = cell('md', 'icon');
export const MdCircleImage = cell('md', 'circle image');

export const SmRectangleImage = cell('sm', 'rectangle image');
export const SmIcon = cell('sm', 'icon');
export const SmCircleImage = cell('sm', 'circle image');

// Every token Avatar.css references, followed through each alias in every
// mode. The list is read from the component's own CSS and the build output,
// so it can never drift from either.
export const Tokens = {
  name: 'Tokens',
  parameters: {
    layout: 'padded',
    docs: { description: { story: 'Read from Avatar.css and build/css/*.css by stories/lib/tokens.js.' } },
  },
  render: () => {
    const names = referencedTokens(avatarCss);
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
