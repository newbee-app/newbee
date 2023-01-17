const colors = require('tailwindcss/colors');

module.exports = {
  theme: {
    extend: {
      colors: {
        // used for setting the color of the background of components
        bg: {
          // primary background of the app
          primary: {
            light: colors.white,
            dark: colors.neutral['700'],
          },
          // slightly off from the primary background, to highlight something subtly
          secondary: {
            light: colors.neutral['100'],
            dark: colors.neutral['600'],
          },
        },
        // used for setting the color of the outline of components
        outline: {
          // strongly distinguishable outline for the borders of components
          primary: {
            light: colors.gray['500'],
            dark: colors.gray['400'],
          },
          // subtly distinguishable outline for the border of components
          secondary: {
            light: colors.gray['200'],
            dark: colors.gray['600'],
          },
        },
        // used for highlighting components to draw attention to them
        highlight: {
          // useful for showing something is clickable or that it's being selected
          primary: {
            light: colors.blue['500'],
            dark: colors.blue['300'],
          },
          // useful for showing something was already clicked
          secondary: {
            light: colors.purple['700'],
            dark: colors.purple['400'],
          },
        },
        // used to indicate something is wrong
        error: {
          primary: {
            light: colors.red['600'],
            dark: colors.red['300'],
          },
        },
        // used for the logo
        logo: {
          light: colors.yellow['500'],
          dark: colors.yellow['400'],
        },
        // used for buttons
        primary: {
          light: colors.yellow['300'],
          dark: colors.yellow['500'],
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
};
