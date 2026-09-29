/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  framework: '@storybook/react-vite',
  core: { disableTelemetry: true },
  stories: ['../src/components/**/*.stories.@(js|jsx)'],
};

export default config;
