// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=269-447
import { useArgs } from 'storybook/preview-api';
import { DescriptionItem } from './DescriptionItem';
import descriptionItemCss from './DescriptionItem.css?raw';
import { MODES, exists, referencedTokens, resolve } from '../../../stories/lib/tokens.js';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';
const NODE = '269-447';
const figmaLink = `Figma node [${NODE.replace('-', ':')}](${FIGMA}?node-id=${NODE}).`;

const LONG_DESCRIPTION =
  'Own end-to end product design from research to shipped UI, including discovery, prototyping, ' +
  'usability testing, design system contributions and close collaboration with engineering';

// The dashed outline marks the parent. It is a story-only frame, not a
// component value: DescriptionItem fills whatever parent it is given.
const parentOutline = { outline: 'var(--border-width-default) dashed var(--text-neutral-secondary)' };

// DescriptionItem is controlled. Each story owns `category` in its args, so
// the checkbox toggles for real with a click or Space.
const Controlled = (args) => {
  const [, updateArgs] = useArgs();
  return (
    <DescriptionItem
      {...args}
      onCategoryChange={(next, event) => {
        updateArgs({ category: next });
        args.onCategoryChange?.(next, event);
      }}
    />
  );
};

export default {
  title: 'Components/CardContent/DescriptionItem',
  component: DescriptionItem,
  render: Controlled,
  parameters: {
    layout: 'padded',
    design: { type: 'figma', url: `${FIGMA}?node-id=${NODE}` },
    docs: {
      description: {
        component: `Description item. Figma: [CardContent/DescriptionItem](${FIGMA}?node-id=${NODE}). ` +
          'A checkbox and a description (body/lg, text-neutral-base) that wraps onto as many lines as it ' +
          'needs, and a Label (brand / md / no icon, imported as it is). The row fills its parent and wraps: ' +
          'the Label sits beside the description, at least spacing-gap-lg after it, while both fit, and moves ' +
          'to its own line under it when they do not, indented by size-icon-lg plus spacing-gap-sm so it lines ' +
          'up with the description (owner ruling, 2026-10-10). `category` is the Figma variant: `check` is ' +
          'ticked and `uncheck` is empty (owner ruling, 2026-10-10; Figma\'s glyphs are swapped and the ' +
          'Designer fixes them). Only the checkbox toggles, with a click or Space; it is a native checkbox ' +
          'named by the description. The component is controlled: the parent passes `category` and hears ' +
          '`onCategoryChange(nextCategory, event)`. `labelText` sets the Label\'s text ' +
          '(docs/description-item-prop-names.md). No hover, press, focus or disabled styling is designed: ' +
          'the browser\'s own focus ring shows on the checkbox.',
      },
    },
  },
  argTypes: {
    category: { control: 'inline-radio', options: ['check', 'uncheck'] },
    descriptionText: { control: 'text' },
    labelText: { control: 'text' },
    onCategoryChange: { action: 'onCategoryChange' },
  },
  args: {
    category: 'check',
    descriptionText: 'Own end-to end product design from research to shipped something',
    labelText: 'In 74% of posts',
  },
  decorators: [
    (Story) => (
      <div style={parentOutline}>
        <Story />
      </div>
    ),
  ],
};

export const Check = {
  name: 'category=check',
  args: { category: 'check' },
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} Ticked (Figma 269:446): Lucide SquareCheck in icon-interactive-brand-idle. Click ` +
          'the checkbox or press Space on it to untick.',
      },
    },
  },
};

export const Uncheck = {
  name: 'category=uncheck',
  args: { category: 'uncheck' },
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} Empty (Figma 269:445): Lucide Square in icon-neutral-primary. Click the checkbox ` +
          'or press Space on it to tick.',
      },
    },
  },
};

export const LongDescriptionCheck = {
  name: 'category=check, long description (wraps)',
  args: { category: 'check', descriptionText: LONG_DESCRIPTION },
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} The description and the Label no longer fit on one line, so the Label wraps to ` +
          'its own line, indented to line up with the description, and the description wraps onto several ' +
          'lines. No gap is built between the wrapped lines (Figma\'s 4 is unbound).',
      },
    },
  },
};

export const LongDescriptionUncheck = {
  name: 'category=uncheck, long description (wraps)',
  args: { category: 'uncheck', descriptionText: LONG_DESCRIPTION },
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} As above, empty.`,
      },
    },
  },
};

// Every token DescriptionItem.css references, followed through each alias in
// every mode. Read from the component's own CSS and the build output, so it
// can never drift from either. Label's own tokens are listed in its stories.
export const Tokens = {
  name: 'Tokens',
  render: () => {
    const names = referencedTokens(descriptionItemCss);
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
  parameters: {
    docs: { description: { story: 'Read from DescriptionItem.css and build/css/*.css by stories/lib/tokens.js.' } },
  },
};
