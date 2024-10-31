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
          thumb: 'rgb(245, 245, 245)', // Even more transparent
          track: 'transparent',
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
          position: 'relative',
          overflowY: 'auto', // Enable scrolling
          scrollbarWidth: '5px',  // Hide scrollbar for Firefox
          '-ms-overflow-style': '10x', // Hide scrollbar for IE and Edge

          '&::-webkit-scrollbar': {
            width: '5px', 
            height: '5px', // Hide scrollbar for Chrome, Safari, etc.
          },
          
          '&:hover::-webkit-scrollbar': {
            width: '5px', 
            height: '5px',// Show scrollbar on hover
          },
          
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme('scrollbar.DEFAULT.thumb'),
            borderRadius: '9999px', // Fully rounded
          },

          '&::-webkit-scrollbar-track': {
            backgroundColor: theme('scrollbar.DEFAULT.track'),
          },

          /* Dark mode scrollbars */
          '.dark &::-webkit-scrollbar-thumb': {
            backgroundColor: theme('scrollbar.dark.thumb'),
          },

          '.dark &::-webkit-scrollbar-track': {
            backgroundColor: theme('scrollbar.dark.track'),
          },
          
          '.dark &:hover::-webkit-scrollbar': {
            width: '5px',
            height: '5px',  // Show scrollbar on hover in dark mode
          },
          
        },
      };

      addComponents(newComponents);
    },
  ],
};
