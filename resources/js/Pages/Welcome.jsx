import React from 'react';
import { Paper, Typography } from '@mui/material';
import Front from '@/Components/header/Front';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import ArticleStack from '@/Components/layout/ArticleStack';
import PopularArticles from '@/Components/layout/PopularArticles';
import { PageBreadcrumbs, PageTitle } from '@/Components/layout/FrontPage';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import BlogPagination from '@/Components/navigations/BlogPagination';
import { Head } from '@inertiajs/react';
import { useBreakpointUp } from '@/Components/common/useBreakpoint';

export default function Welcome({ articles_pagenation, popular_articles }) {
  const articles = articles_pagenation.data;
  const isMobile = !useBreakpointUp('md'); // md(900px)未満はスマホ用レイアウト
  // 人気記事ランキングは1ページ目だけに出す(お気に入りがある記事がなければ出さない)。
  // スマホでは記事一覧が画面外に押し出されないよう、一覧の下に出す
  const popularSection =
    articles_pagenation.current_page === 1 && popular_articles?.length > 0 ? (
      <Paper
        component="section"
        aria-labelledby="popular-articles-heading"
        sx={{ padding: '16px 24px', mb: 3, mt: isMobile ? 3 : 0 }}
      >
        <Typography
          id="popular-articles-heading"
          component="h2"
          sx={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            margin: '0 0 4px',
            padding: 0,
            border: 'none',
          }}
        >
          人気記事ランキング
        </Typography>
        <PopularArticles articles={popular_articles} />
      </Paper>
    ) : null;
  return (
    <>
      <Helmet>
        <meta name="keywords" content={'INFO BOX,INFO BOX 記事一覧'} />
        <meta
          name="description"
          content={`記事一覧 ${articles_pagenation.current_page}ページ目 | INFO BOX`}
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://info-space-box.net" />
      </Helmet>
      <Head
        title={`技術系記事一覧 ${articles_pagenation.current_page}ページ目`}
      />
      <Front />
      {/* トップページは「Top 記事一覧」が表示中のページになる */}
      <PageBreadcrumbs items={[]} />
      <MainFront
        element={
          <>
            {isMobile ? null : popularSection}
            <PageTitle>記事一覧</PageTitle>
            <ArticleStack articles={articles} />
            <BlogPagination paginator={articles_pagenation} />
            {isMobile ? popularSection : null}
          </>
        }
        paper={false}
      />
      <FrontFooter />
    </>
  );
}

Welcome.propTypes = {
  articles: PropTypes.array,
  articles_pagenation: PropTypes.object,
  popular_articles: PropTypes.array,
};
