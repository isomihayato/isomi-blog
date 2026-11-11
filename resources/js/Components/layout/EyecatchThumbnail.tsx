import * as React from 'react';
import Box from '@mui/material/Box';

type Props = {
  src?: string | null;
  // 表示する大きさ(px)。幅は高さの 4/3 倍にする
  height: { xs: number; md: number };
};

/**
 * 記事カードのアイキャッチ画像(サムネイル)。画像のない記事では何も表示しない。
 * 隣のタイトルのリンクで記事名は読み上げられるため、画像は装飾として alt を空にする。
 */
export default function EyecatchThumbnail(props: Props) {
  const { src, height } = props;
  if (!src) return null;
  return (
    <Box
      component="img"
      src={src}
      alt=""
      loading="lazy"
      sx={{
        flexShrink: 0,
        height: { xs: height.xs, md: height.md },
        width: { xs: (height.xs * 4) / 3, md: (height.md * 4) / 3 },
        objectFit: 'cover',
        borderRadius: 1,
        backgroundColor: 'action.hover',
      }}
    />
  );
}
