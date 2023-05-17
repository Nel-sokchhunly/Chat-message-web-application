/** @type {import('tailwindcss').Config} */

const defaultColors = require('tailwindcss/colors');

// these colors are deprecated and being delete to remove the warning when building in production
delete defaultColors['lightBlue'];
delete defaultColors['warmGray'];
delete defaultColors['trueGray'];
delete defaultColors['coolGray'];
delete defaultColors['blueGray'];

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/@formkit/themes/dist/tailwindcss/genesis/index.cjs'
  ],
  theme: {
    fontFamily: {
      poppins: ['Poppins', 'sans-serif']
    },
    colors: {
      ...defaultColors,
      primary: '#23B7F4',
      'alt-primary': '#5FDFFA',
      secondary: '#88E8B7'
    },
    extend: {}
  },
  plugins: []
};
