// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=32-258
import { Briefcase, Mars, UsersRound, Venus, VenusAndMars } from 'lucide-react';
import { JobPosition } from './JobPosition';
import jobPositionCss from './JobPosition.css?raw';
import { MODES, exists, referencedTokens, resolve } from '../../../stories/lib/tokens.js';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';
const NODE = '32-258';
const figmaLink = `Figma node [${NODE.replace('-', ':')}](${FIGMA}?node-id=${NODE}).`;

const ICONS = { UsersRound, VenusAndMars, Venus, Mars, Briefcase };

export default {
  title: 'Components/CardContent/JobPosition',
  component: JobPosition,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: `${FIGMA}?node-id=${NODE}` },
    docs: {
      description: {
        component: `Job position card content. Figma: [CardContent/JobPosition](${FIGMA}?node-id=${NODE}). ` +
          'The job title (title/md) above two Labels (brand / md / idle), imported as they are. `jobTitle` and ' +
          '`showLabel` are the Figma component properties; the pill props (`openingsText`, `openingsIcon`, ' +
          '`genderText`, `genderIcon`) have no Figma property and are proposed in docs/job-position-prop-names.md. ' +
          'Owner rulings, 2026-10-09: the Labels keep their own md padding (spacing-padding-sm); Figma\'s ' +
          'instance override to the narrower spacing-padding-xs is accepted as a known difference and is not built. The ' +
          'component hugs its content. Owner ruling 2026-10-09 (replacing the earlier wrap ruling): a long title stays ' +
          'on one line and ends in an ellipsis when the parent limits the width, and the pill row keeps one line and ' +
          'may overflow. There are no interaction states, because Figma ' +
          'designs none and the content is not interactive (a Label\'s own pointer hover is Label\'s behaviour). ' +
          'Default icons are Lucide UsersRound and VenusAndMars, matching Figma\'s glyphs. The pill icons draw at Label md\'s ' +
          'border-width-icon-default stroke (Label PR #77).',
      },
    },
  },
  argTypes: {
    jobTitle: { control: 'text' },
    showLabel: { control: 'boolean' },
    openingsText: { control: 'text' },
    openingsIcon: { control: 'select', options: Object.keys(ICONS), mapping: ICONS },
    genderText: { control: 'text' },
    genderIcon: { control: 'select', options: Object.keys(ICONS), mapping: ICONS },
  },
  args: {
    jobTitle: 'Senior Product Designer',
    showLabel: true,
    openingsText: '3 openings',
    openingsIcon: 'UsersRound',
    genderText: 'opens to male',
    genderIcon: 'VenusAndMars',
  },
};

export const Default = {
  name: 'Default (showLabel=true)',
  parameters: { docs: { description: { story: `${figmaLink} The component as Figma draws it.` } } },
};

export const WithoutLabel = {
  name: 'showLabel=false',
  args: { showLabel: false },
  parameters: { docs: { description: { story: `${figmaLink} The label row hidden through the Figma boolean.` } } },
};

// The narrow parent is a story-only constraint that stands in for a product
// layout. It is not a component value: the component itself sets no width.
export const LongTitleNarrowContainer = {
  name: 'Long title in a narrow container',
  args: { jobTitle: 'Senior Product Designer, Design Systems and Accessibility' },
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} Owner ruling 2026-10-09: a long title stays on one line and ends in an ellipsis ` +
          'when the parent limits the width. The pill row keeps one line and may overflow the parent; the owner ' +
          'accepted that. The dashed outline marks the parent.',
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

export const CustomLabels = {
  name: 'Custom pill content',
  args: { openingsText: '1 opening', genderText: 'opens to female', genderIcon: 'Venus' },
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} Owner ruling 2026-10-09: the pill texts and icons are sample defaults and change ` +
          'per use through the pill props.',
      },
    },
  },
};

// Every token JobPosition.css references, followed through each alias in
// every mode. Read from the component's own CSS and the build output, so it
// can never drift from either. Label's tokens are listed in its own story.
export const Tokens = {
  name: 'Tokens',
  parameters: {
    layout: 'padded',
    docs: { description: { story: 'Read from JobPosition.css and build/css/*.css by stories/lib/tokens.js.' } },
  },
  render: () => {
    const names = referencedTokens(jobPositionCss);
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
