// Figma: https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress?node-id=31-228
import { Circle, Info, Star } from 'lucide-react';
import { Label } from './Label';

const FIGMA = 'https://www.figma.com/design/de4EKsCcP28lQPV2upHdAN/Flex.Global.Component.V1.0.In-Progress';

// Each cell's own Figma variant node, keyed `category/size/state`.
const NODES = {
  'brand/lg/idle': '31-227', 'brand/lg/hover': '71-2432',
  'brand/md/idle': '31-226', 'brand/md/hover': '71-2435',
  'brand/sm/idle': '31-225', 'brand/sm/hover': '71-2438',
  'info/lg/idle': '71-2347', 'info/lg/hover': '71-2462',
  'info/md/idle': '71-2376', 'info/md/hover': '71-2456',
  'info/sm/idle': '71-2400', 'info/sm/hover': '71-2459',
  'success/lg/idle': '71-2351', 'success/lg/hover': '71-2486',
  'success/md/idle': '71-2384', 'success/md/hover': '71-2480',
  'success/sm/idle': '71-2408', 'success/sm/hover': '71-2483',
  'error/lg/idle': '71-2355', 'error/lg/hover': '71-2510',
  'error/md/idle': '71-2392', 'error/md/hover': '71-2504',
  'error/sm/idle': '71-2416', 'error/sm/hover': '71-2507',
  'warning/lg/idle': '71-2558', 'warning/lg/hover': '71-2597',
  'warning/md/idle': '71-2546', 'warning/md/hover': '71-2591',
  'warning/sm/idle': '71-2552', 'warning/sm/hover': '71-2594',
};

const ICONS = { Circle, Info, Star };

export default {
  title: 'Components/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `Label (tag). Figma: [Label](${FIGMA}?node-id=31-228). ` +
          'States are `idle` and `hover` only, by owner decision (see docs/label-prop-names.md). ' +
          '`hover` comes from a real pointer; passing it as `state` pins the look for review.',
      },
    },
  },
  argTypes: {
    category: { control: 'inline-radio', options: ['brand', 'info', 'success', 'error', 'warning'] },
    size: { control: 'inline-radio', options: ['lg', 'md', 'sm'] },
    state: { control: 'inline-radio', options: ['idle', 'hover'] },
    labelText: { control: 'text' },
    showIcon: { control: 'boolean' },
    swapIcon: { control: 'select', options: Object.keys(ICONS), mapping: ICONS },
  },
  args: {
    category: 'brand',
    size: 'lg',
    state: 'idle',
    labelText: 'Label',
    showIcon: true,
    swapIcon: 'Circle',
  },
};

const cell = (category, size, state) => {
  const node = NODES[`${category}/${size}/${state}`];
  return {
    name: `${category} / ${size} / ${state}`,
    args: { category, size, state },
    parameters: {
      design: { type: 'figma', url: `${FIGMA}?node-id=${node}` },
      docs: { description: { story: `Figma node [${node}](${FIGMA}?node-id=${node}).` } },
    },
  };
};

export const BrandLgIdle = cell('brand', 'lg', 'idle');
export const BrandLgHover = cell('brand', 'lg', 'hover');
export const BrandMdIdle = cell('brand', 'md', 'idle');
export const BrandMdHover = cell('brand', 'md', 'hover');
export const BrandSmIdle = cell('brand', 'sm', 'idle');
export const BrandSmHover = cell('brand', 'sm', 'hover');

export const InfoLgIdle = cell('info', 'lg', 'idle');
export const InfoLgHover = cell('info', 'lg', 'hover');
export const InfoMdIdle = cell('info', 'md', 'idle');
export const InfoMdHover = cell('info', 'md', 'hover');
export const InfoSmIdle = cell('info', 'sm', 'idle');
export const InfoSmHover = cell('info', 'sm', 'hover');

export const SuccessLgIdle = cell('success', 'lg', 'idle');
export const SuccessLgHover = cell('success', 'lg', 'hover');
export const SuccessMdIdle = cell('success', 'md', 'idle');
export const SuccessMdHover = cell('success', 'md', 'hover');
export const SuccessSmIdle = cell('success', 'sm', 'idle');
export const SuccessSmHover = cell('success', 'sm', 'hover');

export const ErrorLgIdle = cell('error', 'lg', 'idle');
export const ErrorLgHover = cell('error', 'lg', 'hover');
export const ErrorMdIdle = cell('error', 'md', 'idle');
export const ErrorMdHover = cell('error', 'md', 'hover');
export const ErrorSmIdle = cell('error', 'sm', 'idle');
export const ErrorSmHover = cell('error', 'sm', 'hover');

export const WarningLgIdle = cell('warning', 'lg', 'idle');
export const WarningLgHover = cell('warning', 'lg', 'hover');
export const WarningMdIdle = cell('warning', 'md', 'idle');
export const WarningMdHover = cell('warning', 'md', 'hover');
export const WarningSmIdle = cell('warning', 'sm', 'idle');
export const WarningSmHover = cell('warning', 'sm', 'hover');
