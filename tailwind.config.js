/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode using the class strategy
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "thirve-blue": "#4787FA",
        "dark-bg": "#171717 ", 
        "dark-text": "#FFFFFF", 
        "dark-links": "#6495ED",
        "dark-scroll-thumb": "#4A5568", 
        "dark-scroll-track": "#2D3748", 

      },
      scrollbar: {
        DEFAULT: {
          thumb: '#E5E4E2', 
          track: '#f1f1f1',
        },
        hover: {
          thumb: '#a8a8a8', 
        },
        dark: {
          thumb: '#4A5568', // Dark mode thumb
          track: '#2D3748', // Dark mode track
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
            width: '2px', 
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme('scrollbar.DEFAULT.thumb'),
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme('scrollbar.DEFAULT.track'),
          },
          '&::-webkit-scrollbar-thumb:hover': {
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
          'scrollbar-width': 'thin',
          'scrollbar-color': `${theme('scrollbar.DEFAULT.thumb')} ${theme('scrollbar.DEFAULT.track')}`,
          '.dark scrollbar-color': `${theme('scrollbar.dark.thumb')} ${theme('scrollbar.dark.track')}`,
        },
      };

      addComponents(newComponents);
    },
  ],
}
