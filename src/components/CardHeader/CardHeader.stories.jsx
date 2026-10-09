// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=32-346
import { Bookmark } from 'lucide-react';
import { CardHeader } from './CardHeader';
import { IconButton } from '../IconButton/IconButton';
import cardHeaderCss from './CardHeader.css?raw';
import { MODES, exists, referencedTokens, resolve } from '../../../stories/lib/tokens.js';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';
const NODE = '32-346';
const figmaLink = `Figma node [${NODE.replace('-', ':')}](${FIGMA}?node-id=${NODE}).`;

// The dashed outline marks the parent. It is a story-only frame, not a
// component value: CardHeader fills whatever parent it is given.
const parentOutline = { outline: 'var(--border-width-default) dashed var(--text-neutral-secondary)' };

export default {
  title: 'Components/CardContent/CardHeader',
  component: CardHeader,
  parameters: {
    layout: 'padded',
    design: { type: 'figma', url: `${FIGMA}?node-id=${NODE}` },
    docs: {
      description: {
        component: `Card header. Figma: [CardContent/CardHeader](${FIGMA}?node-id=${NODE}). ` +
          'An EmployerProfile above a JobPosition (spacing-gap-lg apart), both imported as they are, with the ' +
          'header slot at the far end of the row. `showHeaderSlot` and `children` are the Figma component ' +
          'properties; `employerProfileProps` and `jobPositionProps` pass through to the imported components ' +
          '(docs/card-header-prop-names.md). Owner rulings, 2026-10-09: the row fills its parent; the column and ' +
          'the slot keep at least spacing-gap-lg apart; the slot hugs its content at the top; EmployerProfile and ' +
          'JobPosition keep their own layout (JobPosition\'s title gap renders spacing-gap-xxs, a Figma mismatch ' +
          'the Designer fixes; the pills keep Label md padding). CardHeader has no interaction states; the slot ' +
          'content brings its own.',
      },
    },
  },
  argTypes: {
    showHeaderSlot: { control: 'boolean' },
    children: { control: false },
    employerProfileProps: { control: 'object' },
    jobPositionProps: { control: 'object' },
  },
  args: {
    showHeaderSlot: true,
  },
  decorators: [
    (Story) => (
      <div style={parentOutline}>
        <Story />
      </div>
    ),
  ],
};

export const Default = {
  name: 'Default (showHeaderSlot=true, empty slot)',
  parameters: { docs: { description: { story: `${figmaLink} The component as Figma draws it: the slot is empty.` } } },
};

export const WithSlotContent = {
  name: 'showHeaderSlot=true, with slot content',
  args: {
    children: <IconButton swapIcon={Bookmark} aria-label="Save job" />,
  },
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} The slot filled with an IconButton, imported as it is, as an example. The slot hugs ` +
          'it at the top. The IconButton brings its own hover, press, focus and disabled states.',
      },
    },
  },
};

export const HeaderSlotHidden = {
  name: 'showHeaderSlot=false',
  args: {
    showHeaderSlot: false,
    children: <IconButton swapIcon={Bookmark} aria-label="Save job" />,
  },
  parameters: {
    docs: { description: { story: `${figmaLink} The header slot hidden through the Figma boolean, even with content passed.` } },
  },
};

export const CustomContent = {
  name: 'Custom content (pass-through props)',
  args: {
    employerProfileProps: { employerTitle: 'Flex Global Recruiting Ltd.', postedTime: 'Posted today' },
    jobPositionProps: { jobTitle: 'Staff Frontend Engineer', openingsText: '1 opening' },
    children: <IconButton swapIcon={Bookmark} aria-label="Save job" />,
  },
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} Content set through employerProfileProps and jobPositionProps (owner approval ` +
          '2026-10-09).',
      },
    },
  },
};

export const NarrowContainer = {
  name: 'Long content in a narrow container',
  args: {
    employerProfileProps: { employerTitle: 'Hire-Me International Recruitment Company Limited' },
    jobPositionProps: { jobTitle: 'Senior Product Designer, Design Systems and Accessibility' },
    children: <IconButton swapIcon={Bookmark} aria-label="Save job" />,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '36ch' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} In a narrow parent the slot keeps its content width and at least spacing-gap-lg ` +
          'from the column; the titles end in their own ellipsis (EmployerProfile and JobPosition rulings), and ' +
          'the pill row may overflow, as JobPosition allows.',
      },
    },
  },
};

// Every token CardHeader.css references, followed through each alias in
// every mode. Read from the component's own CSS and the build output, so it
// can never drift from either. The imported components list theirs.
export const Tokens = {
  name: 'Tokens',
  decorators: [(Story) => <Story />],
  parameters: {
    docs: { description: { story: 'Read from CardHeader.css and build/css/*.css by stories/lib/tokens.js.' } },
  },
  render: () => {
    const names = referencedTokens(cardHeaderCss);
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
