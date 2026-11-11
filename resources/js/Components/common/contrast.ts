// 文字と背景のコントラスト(WCAG 2.x)に関する関数

// #rgb / #rrggbb を [r, g, b](0〜255)にする。読めない値は undefined
function parseHex(color: string): [number, number, number] | undefined {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!m) return undefined;
  const hex =
    m[1].length === 3
      ? m[1]
          .split('')
          .map((c) => c + c)
          .join('')
      : m[1];
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
}

// 相対輝度
function luminance([r, g, b]: [number, number, number]): number {
  const [R, G, B] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

// 2色のコントラスト比(1〜21)
export function contrastRatio(a: string, b: string): number | undefined {
  const ca = parseHex(a);
  const cb = parseHex(b);
  if (!ca || !cb) return undefined;
  const [hi, lo] = [luminance(ca), luminance(cb)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// 背景色の上で読みやすい文字色(白か黒)を返す。
// 色を読めないときは、これまでどおり白にする
export function readableTextColor(background: string | null | undefined) {
  if (!background) return '#fff';
  const white = contrastRatio('#fff', background);
  const black = contrastRatio('#000', background);
  if (white === undefined || black === undefined) return '#fff';
  return white >= black ? '#fff' : '#000';
}
