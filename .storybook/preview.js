import '../build/css/tokens.css';
import '../build/css/tokens-dark.css';
import '../build/css/tokens-back-office.css';

// Theme and scale are attributes on <html>, the same ancestor the product
// uses. Components never read them; the token cascade resolves them.
const withModes = (Story, context) => {
  const root = document.documentElement;
  const { theme, scale } = context.globals;

  if (theme === 'dark') root.setAttribute('data-theme', 'dark');
  else root.removeAttribute('data-theme');

  if (scale === 'back-office') root.setAttribute('data-scale', 'back-office');
  else root.removeAttribute('data-scale');

  return Story();
};

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  decorators: [withModes],
  globalTypes: {
    theme: {
      description: 'Semantic colour mode',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'on-light' },
          { value: 'dark', title: 'on-dark' },
        ],
        dynamicTitle: true,
      },
    },
    scale: {
      description: 'Type scale mode',
      toolbar: {
        title: 'Scale',
        icon: 'ruler',
        items: [
          { value: 'web', title: 'web' },
          { value: 'back-office', title: 'back-office' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    scale: 'web',
  },
};

export default preview;
