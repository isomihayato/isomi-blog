import { createTheme } from '@mui/material/styles';

/**
 * サイト全体の色・フォント・角丸・余白の基準。
 * 色を直書きせず、MUI では `primary.main` などのテーマの値、
 * CSS(public/css/basic.css)では `var(--color-primary)` などの CSS 変数を使う。
 * CSS 変数は app.jsx でこのテーマから出力する(値はここだけで管理する)。
 */

// メインカラー: ヘッダー・リンク・ボタン(白文字で 4.6:1)
const PRIMARY = '#1976d2';
// サブカラー: フッターの背景(白文字で 5.26:1)
const SECONDARY = '#1e7d0c';
// サブカラーの明るい色: 見出しの左線など、文字を載せない飾りだけに使う
const SECONDARY_LIGHT = '#20c200';

export const FONT_FAMILY = [
  '"Noto Sans JP"',
  '"Hiragino Sans"',
  '"Hiragino Kaku Gothic ProN"',
  'Meiryo',
  'sans-serif',
].join(',');

const theme = createTheme({
  palette: {
    primary: { main: PRIMARY },
    secondary: { main: SECONDARY, light: SECONDARY_LIGHT },
    divider: '#d0d0d0',
    background: { default: '#dddddd', paper: '#ffffff' },
  },
  typography: {
    fontFamily: FONT_FAMILY,
  },
  // 余白は theme.spacing(n) = n * 8px を使う
  spacing: 8,
  shape: { borderRadius: 4 },
});

// basic.css などの静的な CSS から使う CSS 変数
export const cssVariables = {
  '--color-primary': theme.palette.primary.main,
  '--color-secondary': theme.palette.secondary.main,
  '--color-secondary-light': theme.palette.secondary.light,
  '--color-divider': theme.palette.divider,
  '--color-background': theme.palette.background.default,
  '--font-sans': FONT_FAMILY,
  '--radius': `${theme.shape.borderRadius}px`,
};

export default theme;
