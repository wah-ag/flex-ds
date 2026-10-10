// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=32-573
import { useState } from 'react';
import { BtnGroup } from './BtnGroup';
import btnGroupCss from './BtnGroup.css?raw';
import { MODES, exists, referencedTokens, resolve } from '../../../stories/lib/tokens.js';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';
const NODE = '32-573';
const figmaLink = `Figma node [${NODE.replace('-', ':')}](${FIGMA}?node-id=${NODE}).`;

export default {
  title: 'Components/CardContent/BtnGroup',
  component: BtnGroup,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: `${FIGMA}?node-id=${NODE}` },
    docs: {
      description: {
        component: `Card button group. Figma: [CardContent/BtnGroup](${FIGMA}?node-id=${NODE}). ` +
          'A ShotAction ("Save") and a ButtonCTA (secondary, sm, Lucide ExternalLink, "Share"), ' +
          'spacing-gap-md apart, both imported as they are. Figma gives BtnGroup no component properties; ' +
          '`shotActionProps` and `buttonCTAProps` pass through to the two buttons (owner ruling 2026-10-10, ' +
          'docs/btn-group-prop-names.md). BtnGroup has no interaction states of its own; each button keeps ' +
          'its own hover, press and focus.',
      },
    },
  },
  argTypes: {
    shotActionProps: { control: 'object' },
    buttonCTAProps: { control: 'object' },
  },
};

export const Default = {
  name: 'Default (Save idle)',
  parameters: {
    docs: { description: { story: `${figmaLink} The component as Figma draws it: ShotAction idle ("Save") and Share.` } },
  },
};

export const SaveActive = {
  name: 'shotActionProps.state=active (Saved)',
  args: { shotActionProps: { state: 'active' } },
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} ShotAction set to \`active\` by the parent through shotActionProps. Figma draws only ` +
          'the idle instance; the active look is ShotAction\'s own (node 31:189).',
      },
    },
  },
};

// The parent owns ShotAction's state, so this story holds it and flips it on
// click: real input, not a pinned look. Share counts its clicks.
function InteractiveGroup() {
  const [saved, setSaved] = useState(false);
  const [shares, setShares] = useState(0);
  return (
    <div>
      <BtnGroup
        shotActionProps={{ state: saved ? 'active' : 'idle', onClick: () => setSaved((s) => !s) }}
        buttonCTAProps={{ onClick: () => setShares((n) => n + 1), 'aria-describedby': 'btn-group-share-count' }}
      />
      <p id="btn-group-share-count" aria-live="polite">Share clicked {shares} times</p>
    </div>
  );
}

export const Interactive = {
  name: 'Interactive (parent-owned state, click handlers)',
  render: () => <InteractiveGroup />,
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} Click Save to toggle it (the story owns the state); click Share to call its onClick. ` +
          'Hover, press and keyboard focus are the buttons\' own.',
      },
    },
  },
};

// Every token BtnGroup.css references, followed through each alias in every
// mode. Read from the component's own CSS and the build output, so it can
// never drift from either. The imported components list theirs.
export const Tokens = {
  name: 'Tokens',
  parameters: {
    layout: 'padded',
    docs: { description: { story: 'Read from BtnGroup.css and build/css/*.css by stories/lib/tokens.js.' } },
  },
  render: () => {
    const names = referencedTokens(btnGroupCss);
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
