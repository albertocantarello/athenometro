/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B3A5C',
        decisionGreen: '#2E7D32',
        decisionYellow: '#F9A825',
        decisionRed: '#C62828',
      }
    },
  },
  plugins: [],
}
