/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e75556',
        secondary: '#2c3e50',
        accent: '#f39c12',
        dark: '#333333',
        darker: '#1a1a1a',
        light: '#ffffff'
      }
    },
  },
  plugins: [],
}
