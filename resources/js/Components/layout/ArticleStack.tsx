import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { Chip } from '@mui/material';
import { Link } from '@inertiajs/react';
import Tags from '@/Components/Tags';
import { convertGenre, makeGenreColor } from '../filters/articleFilter';
import { ArticleType } from '../types/ArticleTypes';
import { articleCardSx, formatPublishedDate } from './articleCardStyle';

type Props = {
  articles: ArticleType[];
};

export default function ArticleStack(props: Props) {
  const { articles } = props;

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {articles?.map((article: ArticleType) => (
          <Paper key={article.id} component="article" sx={articleCardSx}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '4px 8px',
                fontSize: '.8rem',
                // 狭い画面では、日付や作成者の途中ではなく要素の間で折り返す
                '& > *': { whiteSpace: 'nowrap' },
              }}
            >
              <Chip
                label={convertGenre(article.genre)}
                size="small"
                sx={{
                  backgroundColor: makeGenreColor(article.genre),
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
              <time dateTime={formatPublishedDate(article.published_at)}>
                {formatPublishedDate(article.published_at)}
              </time>
              <span>written by りっすん</span>
            </Box>
            <Box
              component="h2"
              sx={{
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                fontWeight: 600,
                lineHeight: 1.4,
                margin: '8px 0',
                padding: 0,
                // サイト共通の h2 の装飾(左の緑線・下線)をカードでは使わない
                border: 'none',
                overflowWrap: 'anywhere',
              }}
            >
              {/* フルリロードではなくInertiaのSPA遷移で記事詳細へ移動する */}
              <Link
                href={'/articles/details/' + article.id}
                className="article-card__link"
              >
                {article.title}
              </Link>
            </Box>
            {article.describe ? (
              <Box
                component="p"
                sx={{
                  margin: '0 0 8px',
                  fontSize: '.9rem',
                  lineHeight: 1.6,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {article.describe}
              </Box>
            ) : null}
            <div className="article-card__above">
              <Tags tags={(article.tags ?? '').split(',')} />
            </div>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
