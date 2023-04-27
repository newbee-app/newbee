const colors = require('tailwindcss/colors');

module.exports = {
  daisyui: {
    themes: ['bumblebee', 'dark'],
  },
  theme: {
    extend: {
      colors: {
        // used for the logo
        logo: colors.yellow['500'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
};
