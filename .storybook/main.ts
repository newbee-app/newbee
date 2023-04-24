import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: [],
  addons: [
    '@storybook/addon-essentials',
    '@sotrybook/addon-interactions',
    '@storybook/addon-a11y',
    'storybook-dark-mode',
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
};

export default config;
