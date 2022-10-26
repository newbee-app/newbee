const colors = require('tailwindcss/colors');

module.exports = {
  theme: {
    extend: {
      colors: {
        bg: {
          primary: {
            light: colors.white,
            dark: colors.neutral['700'],
          },
          secondary: {
            light: colors.neutral['100'],
            dark: colors.neutral['600'],
          },
        },
        outline: {
          primary: {
            light: colors.gray['500'],
            dark: colors.gray['400'],
          },
          secondary: {
            light: colors.gray['200'],
            dark: colors.gray['600'],
          },
        },
        highlight: {
          primary: {
            light: colors.blue['500'],
            dark: colors.blue['300'],
          },
          secondary: {
            light: colors.purple['700'],
            dark: colors.purple['400'],
          },
        },
        error: {
          primary: colors.red['500'],
        },
        logo: {
          light: colors.yellow['500'],
          dark: colors.yellow['400'],
        },
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
