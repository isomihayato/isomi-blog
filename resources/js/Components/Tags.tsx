import { Chip } from '@mui/material';
import { Link } from '@inertiajs/react';
import React from 'react';

type Props = {
  tags: string[];
};

// タグを、押すとそのタグで記事を検索するリンクとして表示する(単色・枠なし)
export default function Tags(props: Props) {
  const tags = props.tags.map((tag) => tag.trim()).filter((tag) => tag !== '');

  return (
    <>
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={`#${tag}`}
          size="small"
          clickable
          component={Link}
          href={`/articles/search?search=${encodeURIComponent(tag)}`}
          sx={{ margin: '2px 4px 2px 0' }}
        />
      ))}
    </>
  );
}
