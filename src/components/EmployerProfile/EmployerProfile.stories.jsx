// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=32-337
import { EmployerProfile } from './EmployerProfile';
import employerProfileCss from './EmployerProfile.css?raw';
import sample from '../Avatar/avatar-sample.png';
import { MODES, exists, referencedTokens, resolve } from '../../../stories/lib/tokens.js';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';
const NODE = '32-337';
const figmaLink = `Figma node [${NODE.replace('-', ':')}](${FIGMA}?node-id=${NODE}).`;

export default {
  title: 'Components/CardContent/EmployerProfile',
  component: EmployerProfile,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: `${FIGMA}?node-id=${NODE}` },
    docs: {
      description: {
        component: `Employer profile card content. Figma: [CardContent/EmployerProfile](${FIGMA}?node-id=${NODE}). ` +
          'Composes an xl rectangle-image Avatar, imported as it is, beside the employer title (title/sm) and an ' +
          'optional helper line (label/md). `employerTitle`, `postedTime` and `showHelperText` are the Figma ' +
          'component properties; `avatarProps` passes straight through to Avatar (docs/employer-profile-prop-names.md). ' +
          'Owner rulings, 2026-10-08: the component hugs its content (Figma\'s unbound 198 width is not built); a long ' +
          'title stays on one line and ends in an ellipsis when the parent limits the width; there are no interaction ' +
          'states, because Figma designs none and the content is not interactive. The avatar image is a neutral ' +
          'stand-in, not Figma content.',
      },
    },
  },
  argTypes: {
    employerTitle: { control: 'text' },
    postedTime: { control: 'text' },
    showHelperText: { control: 'boolean' },
    avatarProps: { control: 'object' },
  },
  args: {
    employerTitle: 'Hire-Me Co,Ltd.',
    postedTime: 'Posted 2 days ago',
    showHelperText: true,
    avatarProps: { src: sample, alt: '' },
  },
};

export const Default = {
  name: 'Default (showHelperText=true)',
  parameters: { docs: { description: { story: `${figmaLink} The component as Figma draws it.` } } },
};

export const WithoutHelperText = {
  name: 'showHelperText=false',
  args: { showHelperText: false },
  parameters: { docs: { description: { story: `${figmaLink} The helper line hidden through the Figma boolean.` } } },
};

// The narrow parent is a story-only constraint that stands in for a product
// layout. It is not a component value: the component itself sets no width.
export const LongTitleNarrowContainer = {
  name: 'Long title in a narrow container',
  args: { employerTitle: 'Hire-Me International Recruitment Partners Co,Ltd.' },
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} Owner ruling 2026-10-08: a long title stays on one line and ends in an ellipsis ` +
          'when the parent limits the width. The dashed outline marks the parent.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '24ch', outline: 'var(--border-width-default) dashed var(--text-neutral-secondary)' }}>
        <Story />
      </div>
    ),
  ],
};

// Every token EmployerProfile.css references, followed through each alias in
// every mode. Read from the component's own CSS and the build output, so it
// can never drift from either. Avatar's tokens are listed in its own story.
export const Tokens = {
  name: 'Tokens',
  parameters: {
    layout: 'padded',
    docs: { description: { story: 'Read from EmployerProfile.css and build/css/*.css by stories/lib/tokens.js.' } },
  },
  render: () => {
    const names = referencedTokens(employerProfileCss);
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
