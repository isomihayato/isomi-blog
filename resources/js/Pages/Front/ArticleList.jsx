import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Head } from '@inertiajs/react';
import Front from '@/Components/header/Front';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import ArticleStack from '@/Components/layout/ArticleStack';
import BlogPagination from '@/Components/navigations/BlogPagination';

const SITE_URL = 'https://info-space-box.net';

// ジャンル別・タグ別の記事一覧(/articles/genre/{genre}・/articles/tag/{tag})
export default function ArticleList({
  list_type,
  genre,
  name,
  articles_pagenation,
}) {
  const isGenre = list_type === 'genre';
  const label = isGenre ? `ジャンル「${name}」` : `タグ「#${name}」`;
  const path = isGenre
    ? `/articles/genre/${genre}`
    : `/articles/tag/${encodeURIComponent(name)}`;
  const page = articles_pagenation.current_page;
  const title = `${label}の記事一覧${page > 1 ? ` ${page}ページ目` : ''}`;
  const articles = articles_pagenation.data;

  return (
    <>
      <Helmet>
        <meta name="keywords" content={`INFO BOX,${name}`} />
        <meta name="description" content={`${title} | INFO BOX`} />
        <meta property="og:type" content="website" />
        <link
          rel="canonical"
          href={`${SITE_URL}${path}${page > 1 ? `?page=${page}` : ''}`}
        />
      </Helmet>
      <Head title={title} />
      <Front />
      <Breadcrumbs aria-label="breadcrumb" style={{ margin: '10px 15px' }}>
        <Link underline="hover" color="inherit" href="/">
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Top 記事一覧
        </Link>
        <Typography color="text.primary">
          {isGenre ? (
            <CategoryIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          ) : (
            <LocalOfferIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          )}
          {label}
        </Typography>
      </Breadcrumbs>
      <MainFront
        element={
          <>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '1.4rem', md: '1.8rem' },
                fontWeight: 'bold',
                margin: '0 0 8px',
                overflowWrap: 'anywhere',
              }}
            >
              {label}の記事
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {articles_pagenation.total}件
            </Typography>
            {articles.length > 0 ? (
              <>
                <ArticleStack articles={articles} />
                <BlogPagination paginator={articles_pagenation} />
              </>
            ) : (
              <Typography>まだ記事がありません。</Typography>
            )}
          </>
        }
        paper={false}
      />
      <FrontFooter />
    </>
  );
}

ArticleList.propTypes = {
  list_type: PropTypes.oneOf(['genre', 'tag']).isRequired,
  genre: PropTypes.number,
  name: PropTypes.string.isRequired,
  articles_pagenation: PropTypes.object.isRequired,
};
