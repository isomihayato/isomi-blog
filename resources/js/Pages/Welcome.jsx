import React from 'react';
import Front from '@/Components/header/Front';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import ArticleStack from '@/Components/layout/ArticleStack';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import BlogPagination from '@/Components/navigations/BlogPagination';
import { Head } from '@inertiajs/react';

export default function Welcome({ articles_pagenation }) {
  const articles = articles_pagenation.data;
  return (
    <>
      <Helmet>
        <meta name="keywords" content={'INFO BOX,INFO BOX 記事一覧'} />
        <meta
          name="description"
          content="記事一覧 ${articles_pagenation.current_page}ページ目 | INFO BOX"
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://info-space-box.net" />
      </Helmet>
      <Head
        title={`技術系記事一覧 ${articles_pagenation.current_page}ページ目`}
      />
      <Front />
      <MainFront
        element={
          <>
            <ArticleStack articles={articles} />
            <BlogPagination paginator={articles_pagenation} />
          </>
        }
      />
      <FrontFooter />
    </>
  );
}

Welcome.propTypes = {
  articles: PropTypes.array,
  articles_pagenation: PropTypes.object,
};
