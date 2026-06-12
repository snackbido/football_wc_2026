/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wc: {
          cream: '#f7f4f0',
          creamDarker: '#ebdcd0',
          charcoal: '#1a1a1a',
          olive: '#2d382e',
          accent: '#c29b38',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
