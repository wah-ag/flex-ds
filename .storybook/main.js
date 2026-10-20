/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  framework: '@storybook/react-vite',
  core: { disableTelemetry: true },
  stories: ['../src/components/**/*.stories.@(js|jsx)'],
  // Docs pages exist only to carry each component's props table, which the
  // docs site embeds on its Design tab.
  addons: ['@storybook/addon-docs'],
};

export default config;
