module.exports = {
  stories: [],
  addons: [
    // Includes Docs, Controls, Actions, Viewport, Backgrounds, Toolbars & globals, Measure & outline
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  // uncomment the property below if you want to apply some webpack config globally
  // webpackFinal: async (config, { configType }) => {
  //   // Make whatever fine-grained changes you need that should apply to all storybook configs

  //   // Return the altered config
  //   return config;
  // },
};
