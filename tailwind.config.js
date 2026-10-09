/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      "dark",
      "light",
      "synthwave",
      "cyberpunk",
      "retro",
      "cupcake",
      "night",
      "dracula",
      "forest",
      "business",
      "nord",
      "sunset"
    ],
  },
}
