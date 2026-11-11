import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { Link } from '@inertiajs/react';
import { ArticleType } from '../types/ArticleTypes';
import { articleCardSx } from './articleCardStyle';
import { formatJstDate } from '../common/dateFormat';

type Props = {
  articles: ArticleType[];
};

export default function RelativeArticleStack(props: Props) {
  const { articles } = props;

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {articles?.map((article: ArticleType) => (
          <Paper
            key={article.id}
            component="article"
            sx={{ ...articleCardSx, padding: '12px 16px' }}
          >
            <Box component="time" sx={{ fontSize: '.8rem' }}>
              {formatJstDate(article.published_at)}
            </Box>
            <Box
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {/* フルリロードではなくInertiaのSPA遷移で記事詳細へ移動する */}
              <Link
                href={'/articles/details/' + article.id}
                className="article-card__link"
                title={article.title}
              >
                {article.title}
              </Link>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
