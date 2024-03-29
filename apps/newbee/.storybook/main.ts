import type { StorybookConfig } from '@storybook/angular';
import rootMain from '../../../.storybook/main';

const config: StorybookConfig = {
  ...rootMain,

  stories: ['../src/app/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/packages/storybook/documents/custom-builder-configs
