import { useMediaQuery } from '@mui/material';
import { Breakpoint, useTheme } from '@mui/material/styles';

/**
 * 画面幅が指定したブレイクポイント以上かどうかを返す(MUI の標準値: sm 600 / md 900 / lg 1200 / xl 1536px)。
 *
 * レイアウトの切り替えはブラウザの種類ではなく画面幅で行う。
 * - md 未満: スマホ用レイアウト
 * - lg 以上: 記事詳細の右サイドバー(目次・関連記事)を表示
 * - xl 以上: 記事詳細の左の広告を表示
 * CSS(public/css/basic.css)のメディアクエリも md(900px)を境にしている。
 *
 * サーバー側で描画しないため noSsr を指定し、初回の描画から正しい値を使う(PC で一瞬スマホ表示になるのを防ぐ)。
 */
export function useBreakpointUp(key: Breakpoint): boolean {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up(key), { noSsr: true });
}
