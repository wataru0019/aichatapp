export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      screens: {
        'xs': '375px',    // 小型スマートフォン
        'sm': '640px',    // タブレット（小）
        'md': '768px',    // タブレット（中）
        'lg': '1024px',   // デスクトップ（小）
        'xl': '1280px',   // デスクトップ（中）
        '2xl': '1536px',  // デスクトップ（大）
      },
      fontFamily: {
        // ここでデフォルトフォントを指定
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