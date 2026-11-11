import React from 'react';
import { Box, Link, Typography } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

type Neighbor = { id: number; title: string } | null;

type Props = {
  prevArticle: Neighbor;
  nextArticle: Neighbor;
};

// 記事詳細の末尾に出す「前の記事 / 次の記事」(同じジャンルの公開済み記事を公開日の順で)
export default function ArticleNeighborNav(props: Props) {
  const { prevArticle, nextArticle } = props;
  if (!prevArticle && !nextArticle) return null;

  const item = (article: NonNullable<Neighbor>, direction: 'prev' | 'next') => (
    <Link
      href={`/articles/details/${article.id}`}
      underline="hover"
      color="inherit"
      rel={direction}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        padding: '12px',
        border: '1px solid #d0d0d0',
        borderRadius: '6px',
        height: '100%',
        justifyContent: direction === 'prev' ? 'flex-start' : 'flex-end',
        textAlign: direction === 'prev' ? 'left' : 'right',
      }}
    >
      {direction === 'prev' && <NavigateBeforeIcon />}
      <Box>
        <Typography variant="caption" sx={{ color: '#555' }}>
          {direction === 'prev' ? '前の記事' : '次の記事'}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {article.title}
        </Typography>
      </Box>
      {direction === 'next' && <NavigateNextIcon />}
    </Link>
  );

  return (
    <Box
      component="nav"
      aria-label="前後の記事"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: 2,
        mt: 4,
      }}
    >
      {/* 「次の記事」だけのときも右側に出すため、PC では空の箱を左に置く */}
      {prevArticle ? (
        item(prevArticle, 'prev')
      ) : (
        <Box sx={{ display: { xs: 'none', sm: 'block' } }} />
      )}
      {nextArticle && item(nextArticle, 'next')}
    </Box>
  );
}
