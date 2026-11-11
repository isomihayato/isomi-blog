import { Chip } from '@mui/material';
import { Link } from '@inertiajs/react';
import React from 'react';
import { convertGenre, makeGenreColor } from './filters/articleFilter';

type Props = {
  genre: number | null | undefined;
  size?: 'small' | 'medium';
};

// ジャンルを、押すとそのジャンルの記事一覧(/articles/genre/{genre})に移動するリンクとして表示する
export default function GenreChip(props: Props) {
  const { genre, size = 'small' } = props;
  const style = {
    backgroundColor: makeGenreColor(genre as number),
    color: 'white',
    fontWeight: 'bold',
  };

  // ジャンル未設定の記事は一覧ページがないので、リンクにしない
  if (genre === null || genre === undefined) {
    return (
      <Chip
        label={convertGenre(genre as unknown as number)}
        size={size}
        sx={style}
      />
    );
  }

  return (
    <Chip
      label={convertGenre(genre)}
      size={size}
      clickable
      component={Link}
      href={`/articles/genre/${genre}`}
      sx={{ ...style, '&:hover': { ...style, filter: 'brightness(0.9)' } }}
    />
  );
}
