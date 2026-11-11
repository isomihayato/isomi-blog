import * as React from 'react';
import Box from '@mui/material/Box';
import { Link } from '@inertiajs/react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { ArticleType } from '../types/ArticleTypes';

export type PopularArticleType = ArticleType & { favorites_count: number };

type Props = {
  articles: PopularArticleType[];
};

// 1〜3位の順位の色(金・銀・銅)。4位以降はグレー
const RANK_COLORS = ['#b8860b', '#757575', '#a0522d'];

// 人気記事ランキング(お気に入り数の多い順)。順位・タイトル・お気に入り数を1行ずつ並べる
export default function PopularArticles(props: Props) {
  const { articles } = props;
  if (!articles || articles.length === 0) return null;

  return (
    <Box
      component="ol"
      sx={{ listStyle: 'none', margin: 0, padding: 0 }}
      aria-label="人気記事ランキング"
    >
      {articles.map((article, index) => (
        <Box
          component="li"
          key={article.id}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '8px 0',
            // サイト共通の「#main ul li」などの装飾を打ち消す
            margin: 0,
            fontSize: '.95rem',
            '& + &': { borderTop: '1px solid #e0e0e0' },
          }}
        >
          <Box
            component="span"
            aria-label={`${index + 1}位`}
            sx={{
              flex: '0 0 auto',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: RANK_COLORS[index] ?? '#bdbdbd',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '.8rem',
              lineHeight: '24px',
              textAlign: 'center',
            }}
          >
            {index + 1}
          </Box>
          <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
            {/* フルリロードではなくInertiaのSPA遷移で記事詳細へ移動する */}
            <Link
              href={'/articles/details/' + article.id}
              style={{
                color: '#212121',
                fontWeight: 600,
                textDecoration: 'none',
                overflowWrap: 'anywhere',
              }}
            >
              {article.title}
            </Link>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '.8rem',
                color: '#616161',
              }}
            >
              <FavoriteIcon sx={{ fontSize: '.9rem', color: '#e91e63' }} />
              <span>お気に入り {article.favorites_count}</span>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
