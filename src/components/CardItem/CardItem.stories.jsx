// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=32-651
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CardItem } from './CardItem';
import { ButtonCTA } from '../ButtonCTA/ButtonCTA';
import cardItemCss from './CardItem.css?raw';
import { MODES, exists, referencedTokens, resolve } from '../../../stories/lib/tokens.js';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';
const NODE = '32-651';
const figmaLink = `Figma node [${NODE.replace('-', ':')}](${FIGMA}?node-id=${NODE}).`;

// The dashed outline marks the parent. It is a story-only frame, not a
// component value: CardItem fills whatever parent it is given.
const parentOutline = { outline: 'var(--border-width-default) dashed var(--text-neutral-secondary)' };

// Example Slot content, an imported ButtonCTA as it is. Figma leaves the
// Slot empty; the content brings its own states.
const slotExample = (
  <ButtonCTA category="primary" size="md" buttonLabel="Apply now" leadingIcon={false} swapIcon={ArrowRight} />
);

export default {
  title: 'Components/CardContent/CardItem',
  component: CardItem,
  parameters: {
    layout: 'padded',
    design: { type: 'figma', url: `${FIGMA}?node-id=${NODE}` },
    docs: {
      description: {
        component: `Card item. Figma: [CardContent/CardItem](${FIGMA}?node-id=${NODE}). ` +
          'A CardHeader with a BtnGroup in its header slot, above a row of Targets (spacing-gap-lg apart), and a ' +
          'bottom Slot under both (spacing-gap-sm). CardHeader, BtnGroup and Target are imported as they are. ' +
          '`showSlot` and `children` are the Figma component properties; `targets`, `employerProfileProps`, ' +
          '`jobPositionProps`, `shotActionProps` and `buttonCTAProps` were approved by the owner on 2026-10-10 ' +
          '(docs/card-item-prop-names.md). Owner rulings, 2026-10-10: the root fills its parent; the Target row ' +
          'and the Slot hug their content height; the Targets keep space-between; CardHeader keeps its own ' +
          'layout. CardItem has no interaction states; the buttons keep theirs.',
      },
    },
  },
  argTypes: {
    showSlot: { control: 'boolean' },
    children: { control: false },
    targets: { control: 'object' },
    employerProfileProps: { control: 'object' },
    jobPositionProps: { control: 'object' },
    shotActionProps: { control: 'object' },
    buttonCTAProps: { control: 'object' },
  },
  args: {
    showSlot: true,
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
  name: 'Default (showSlot=true, empty slot)',
  parameters: {
    docs: { description: { story: `${figmaLink} The component as Figma draws it: the bottom Slot is empty.` } },
  },
};

export const WithSlotContent = {
  name: 'showSlot=true, with slot content',
  args: { children: slotExample },
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} The Slot filled with a ButtonCTA, imported as it is, as an example. The Slot fills ` +
          'the width and hugs the content height.',
      },
    },
  },
};

export const SlotHidden = {
  name: 'showSlot=false',
  args: { showSlot: false, children: slotExample },
  parameters: {
    docs: { description: { story: `${figmaLink} The bottom Slot hidden through the Figma boolean, even with content passed.` } },
  },
};

export const CustomContent = {
  name: 'Custom content (pass-through props)',
  args: {
    employerProfileProps: { employerTitle: 'Flex Global Recruiting Ltd.', postedTime: 'Posted today' },
    jobPositionProps: { jobTitle: 'Staff Frontend Engineer', openingsText: '1 opening', genderText: 'open to all' },
    targets: [
      { targetName: 'Experience', targetValue: '8+ Years' },
      { targetName: 'Job Type', targetValue: 'Contract' },
      { targetName: 'Salary', targetValue: '30 - 40 Lakh' },
    ],
    shotActionProps: { state: 'active' },
  },
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} Content set through employerProfileProps, jobPositionProps, targets and ` +
          'shotActionProps (owner approval 2026-10-10). Save shows ShotAction\'s own active look.',
      },
    },
  },
};

export const TwoTargets = {
  name: 'targets: two entries',
  args: {
    targets: [
      { targetName: 'Experience', targetValue: '5 - 7 Years' },
      { targetName: 'Salary', targetValue: '15 - 20 Lakh' },
    ],
  },
  parameters: {
    docs: { description: { story: `${figmaLink} Two Targets, spread with Figma's space-between.` } },
  },
};

export const FourTargets = {
  name: 'targets: four entries',
  args: {
    targets: [
      { targetName: 'Experience', targetValue: '5 - 7 Years' },
      { targetName: 'Job Type', targetValue: 'Full - Time' },
      { targetName: 'Salary', targetValue: '15 - 20 Lakh' },
      { targetName: 'Location', targetValue: 'Remote' },
    ],
  },
  parameters: {
    docs: { description: { story: `${figmaLink} Four Targets, spread with Figma's space-between.` } },
  },
};

// The parent owns ShotAction's state, so this story holds it and flips it on
// click: real input, not a pinned look. Share counts its clicks.
function InteractiveCard() {
  const [saved, setSaved] = useState(false);
  const [shares, setShares] = useState(0);
  return (
    <div>
      <CardItem
        shotActionProps={{ state: saved ? 'active' : 'idle', onClick: () => setSaved((s) => !s) }}
        buttonCTAProps={{ onClick: () => setShares((n) => n + 1), 'aria-describedby': 'card-item-share-count' }}
      >
        {slotExample}
      </CardItem>
      <p id="card-item-share-count" aria-live="polite">Share clicked {shares} times</p>
    </div>
  );
}

export const Interactive = {
  name: 'Interactive (parent-owned state, click handlers)',
  render: () => <InteractiveCard />,
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} Click Save to toggle it (the story owns the state); click Share to call its onClick. ` +
          'Hover, press and keyboard focus are the buttons\' own.',
      },
    },
  },
};

export const NarrowContainer = {
  name: 'Long content in a narrow container',
  args: {
    employerProfileProps: { employerTitle: 'Hire-Me International Recruitment Company Limited' },
    jobPositionProps: { jobTitle: 'Senior Product Designer, Design Systems and Accessibility' },
    children: slotExample,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '48ch' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} In a narrow parent CardHeader keeps its own behaviour (titles end in ellipsis). ` +
          'The Target values do not wrap (Target\'s own rule), and Figma binds no gap between Targets.',
      },
    },
  },
};

// Every token CardItem.css references, followed through each alias in every
// mode. Read from the component's own CSS and the build output, so it can
// never drift from either. The imported components list theirs.
export const Tokens = {
  name: 'Tokens',
  decorators: [(Story) => <Story />],
  parameters: {
    docs: { description: { story: 'Read from CardItem.css and build/css/*.css by stories/lib/tokens.js.' } },
  },
  render: () => {
    const names = referencedTokens(cardItemCss);
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
