// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=124-826
import { useArgs } from 'storybook/preview-api';
import { DescriptionItem } from './DescriptionItem';
import descriptionItemCss from './DescriptionItem.css?raw';
import { MODES, exists, referencedTokens, resolve } from '../../../stories/lib/tokens.js';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';
const NODE = '124-826';
const figmaLink = `Figma node [${NODE.replace('-', ':')}](${FIGMA}?node-id=${NODE}).`;

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
          'A checkbox and a one-line description (body/lg, text-neutral-base), and a Label (brand / md / no icon, ' +
          'imported as it is). `alignPosition` is the Figma "align position" variant: `horizontal` puts the ' +
          'Label at the far end of the row, at least spacing-gap-lg after the description; `vertical` puts it ' +
          'on its own line, spacing-gap-xxs below, indented by size-icon-lg plus spacing-gap-sm so it lines up ' +
          'with the description (owner ruling, 2026-10-10). `category` is the Figma variant: ' +
          '`check` is ticked and `uncheck` is empty (owner ruling, 2026-10-10; Figma\'s glyphs are swapped and ' +
          'the Designer fixes them). Only the checkbox toggles, with a click or Space; it is a native checkbox ' +
          'named by the description. The component is controlled: the parent passes `category` and hears ' +
          '`onCategoryChange(nextCategory, event)`. `labelText` sets the Label\'s text ' +
          '(docs/description-item-prop-names.md). The component fills its parent; a long description ends in ' +
          'an ellipsis. No hover, press, focus or disabled styling is ' +
          'designed: the browser\'s own focus ring shows on the checkbox.',
      },
    },
  },
  argTypes: {
    category: { control: 'inline-radio', options: ['check', 'uncheck'] },
    alignPosition: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    descriptionText: { control: 'text' },
    labelText: { control: 'text' },
    onCategoryChange: { action: 'onCategoryChange' },
  },
  args: {
    category: 'check',
    alignPosition: 'horizontal',
    descriptionText: 'Own end-to end product design from research to shipped UI',
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
  name: 'category=check, alignPosition=horizontal',
  args: { category: 'check', alignPosition: 'horizontal' },
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} Ticked: Lucide SquareCheck in icon-interactive-brand-idle. Click the checkbox or ` +
          'press Space on it to untick.',
      },
    },
  },
};

export const Uncheck = {
  name: 'category=uncheck, alignPosition=horizontal',
  args: { category: 'uncheck', alignPosition: 'horizontal' },
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} Empty: Lucide Square in icon-neutral-primary. Click the checkbox or press Space on ` +
          'it to tick.',
      },
    },
  },
};

export const LongDescription = {
  name: 'Long description (ellipsis), alignPosition=horizontal',
  args: {
    category: 'uncheck',
    alignPosition: 'horizontal',
    descriptionText:
      'Own end-to end product design from research to shipped UI, including discovery, prototyping, ' +
      'usability testing, design system contributions and close collaboration with engineering',
  },
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} Owner ruling, 2026-10-10: a description longer than the row stays on one line and ` +
          'ends in an ellipsis, at least spacing-gap-lg before the Label.',
      },
    },
  },
};

export const CheckVertical = {
  name: 'category=check, alignPosition=vertical',
  args: { category: 'check', alignPosition: 'vertical' },
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} Ticked, with the Label on its own line (Figma 264:377, named category4 there; the ` +
          'Designer renames it). The Label sits spacing-gap-xxs below the checkbox row, indented by ' +
          'size-icon-lg plus spacing-gap-sm. Click the checkbox or press Space on it to untick.',
      },
    },
  },
};

export const UncheckVertical = {
  name: 'category=uncheck, alignPosition=vertical',
  args: { category: 'uncheck', alignPosition: 'vertical' },
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} Empty, with the Label on its own line (Figma 264:366, named category3 there; the ` +
          'Designer renames it). Click the checkbox or press Space on it to tick.',
      },
    },
  },
};

export const LongDescriptionVertical = {
  name: 'Long description (ellipsis), alignPosition=vertical',
  args: {
    category: 'uncheck',
    alignPosition: 'vertical',
    descriptionText:
      'Own end-to end product design from research to shipped UI, including discovery, prototyping, ' +
      'usability testing, design system contributions and close collaboration with engineering',
  },
  parameters: {
    docs: {
      description: {
        story: `${figmaLink} Owner ruling, 2026-10-10: in the vertical layout too, a description longer than ` +
          'the row stays on one line and ends in an ellipsis.',
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
