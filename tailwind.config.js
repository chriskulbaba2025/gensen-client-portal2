/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // ✅ match your Next.js App Router structure
  ],
  theme: {
    extend: {
      fontFamily: {
        raleway: ['Raleway', 'sans-serif'], // ✅ global Raleway font
      },
      colors: {
        brandBlue: '#076aff',   // ✅ Gensen blue
        brandDark: '#002c71',   // ✅ deep navy tone
        brandLight: '#f5f8ff',  // ✅ light background tone
        textGray: '#333333',    // ✅ consistent neutral text
      },
      borderRadius: {
        lg: '12px',
        xl: '15px', // ✅ standard rounded corners
        '2xl': '20px',
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0, 0, 0, 0.08)',
        glow: '0 0 10px rgba(7, 106, 255, 0.3)',
      },
    },
  },
  plugins: [],
};
