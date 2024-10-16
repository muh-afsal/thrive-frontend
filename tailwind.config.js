/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "thirve-blue": "#4787FA",
        "dark-bg": "#171717",
        "dark-text": "#FFFFFF",
        "dark-links": "#6495ED",
        "dark-scroll-thumb": "#4A5568",
        "dark-scroll-track": "#2D3748",
      },
      scrollbar: {
        DEFAULT: {
          thumb: 'rgba(147, 147, 147, 0.3)', // Even more transparent
          track: 'transparent',
        },
        hover: {
          thumb: 'rgba(168, 168, 168, 0.5)', // More visible on hover
        },
        dark: {
          thumb: 'rgba(74, 85, 104, 0.3)', // More transparent dark mode thumb
          track: 'transparent',
        }
      }
    },
  },
  plugins: [
    function ({ addComponents, theme }) {
      const newComponents = {
        '.scrollbar-custom': {
          /* Webkit browsers (Chrome, Safari) */
          '&::-webkit-scrollbar': {
            width: '1px', // Extremely thin
            height: '1px', // For horizontal scrollbars
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme('scrollbar.DEFAULT.thumb'),
            borderRadius: '9999px', // Fully rounded
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme('scrollbar.DEFAULT.track'),
          },
          '&:hover::-webkit-scrollbar-thumb': {
            backgroundColor: theme('scrollbar.hover.thumb'),
          },

          /* Dark mode scrollbars */
          '.dark &::-webkit-scrollbar-thumb': {
            backgroundColor: theme('scrollbar.dark.thumb'),
          },
          '.dark &::-webkit-scrollbar-track': {
            backgroundColor: theme('scrollbar.dark.track'),
          },

          /* For Firefox */
          'scrollbar-width': 'none', // Hide scrollbar in Firefox
          '&:hover': {
            'scrollbar-width': 'thin', // Show thin scrollbar on hover in Firefox
          },
          'scrollbar-color': `${theme('scrollbar.DEFAULT.thumb')} ${theme('scrollbar.DEFAULT.track')}`,
          '.dark & ': {
            'scrollbar-color': `${theme('scrollbar.dark.thumb')} ${theme('scrollbar.dark.track')}`,
          },
        },
      };

      addComponents(newComponents);
    },
  ],
}