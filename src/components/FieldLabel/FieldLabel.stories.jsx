// Figma: no node of its own. FieldLabel is the label text layer inside
// InputField (https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=64-556)
// and PasswordField (node 95-596, layer 93-575), extracted so both import it.
import { FieldLabel } from './FieldLabel';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';

export default {
  title: 'Components/FieldLabel',
  component: FieldLabel,
  parameters: {
    layout: 'padded',
    design: { type: 'figma', url: `${FIGMA}?node-id=64-556` },
    docs: {
      description: {
        component: 'The label above a form field, a real `<label>` tied to its input through ' +
          '`htmlFor`. Shared by TextField and PasswordField. It has no Figma node and one look ' +
          '(no hover, focus or disabled look). See docs/field-control-prop-names.md.',
      },
    },
  },
  argTypes: { labelText: { control: 'text' } },
  args: { labelText: 'Email' },
};

export const Default = { name: 'default' };

export const Password = { name: 'password', args: { labelText: 'Password' } };
