import React from 'react';
import ResponsibleHeader from '@/Components/header/ResponsibleHeader';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import ArticleStack from '@/Components/layout/ArticleStack';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import BlogPagination from '@/Components/navigations/BlogPagination';
import { Head } from '@inertiajs/react';
import HomeIcon from '@mui/icons-material/Home';
import { Link, Breadcrumbs } from '@mui/material';
export default function Welcome({ articles_pagenation }) {
  const articles = articles_pagenation.data;
  return (
    <>
      <Helmet>
        <meta name="keywords" content={'MIE Fishing,MIE Fishing 記事一覧'} />
        <meta
          name="description"
          content="記事一覧 ${articles_pagenation.current_page}ページ目 | MIE Fishing"
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://mie-fishing.info" />
      </Helmet>
      <Head
        title={`釣り記事一覧 ${articles_pagenation.current_page}ページ目`}
      />
      <ResponsibleHeader
        breadcrumbsLink={
          <Breadcrumbs aria-label="breadcrumb" style={{ margin: '10px 15px' }}>
            <Link underline="hover" color="inherit" href="/">
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Top 記事一覧ページ
            </Link>
          </Breadcrumbs>
        }
      />
      <MainFront
        element={
          <>
            <ArticleStack articles={articles} />
            <BlogPagination paginator={articles_pagenation} />
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
};
