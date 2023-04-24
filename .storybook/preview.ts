import type { Preview } from '@storybook/angular';
import { themes } from '@storybook/theming';

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
      },
    },
    darkMode: {
      dark: { ...themes.dark, appBg: '#262626', appContentBg: '#404040' },
      light: { ...themes.light, appBg: '#f5f5f5', appContentBg: 'white' },
      stylePreview: true,
    },
  },
};

export default preview;
