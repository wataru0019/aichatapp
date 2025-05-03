/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        // ここでデフォルトフォントを指定 (希望するフォントに変更してください)
        sans: [
          '"Hiragino Kaku Gothic ProN"', 
          '"Hiragino Kaku Gothic Pro"', 
          '"游ゴシック"', 
          '"Yu Gothic"', 
          'YuGothic', 
          'Meiryo', 
          'sans-serif'
        ],
      },
    },
  },
  plugins: [],
};