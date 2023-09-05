import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: [],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],

  framework: {
    name: '@storybook/angular',
    options: {},
  },

  docs: {
    autodocs: true
  }
};

export default config;
