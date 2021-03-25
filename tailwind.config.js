module.exports = {
  purge: {
    content: [
      'build/index.html',
      'build/app.js',
    ]
  },
   
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
