import { themes } from '@storybook/theming';

export const parameters = {
  docs: {
    inlineStories: true,
  },
  darkMode: {
    dark: { ...themes.dark, appBg: '#262626', appContentBg: '#404040' },
    light: { ...themes.light, appBg: '#f5f5f5', appContentBg: 'white' },
    stylePreview: true,
  },
  options: {
    storySort: {
      method: 'alphabetical',
    },
  },
};
