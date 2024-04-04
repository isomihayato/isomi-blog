import React from 'react';
import Front from '@/Components/header/Front';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import ArticleStack from '@/Components/layout/ArticleStack';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

export default function Welcome({ articles }) {
  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="INFO BOXは、磯海隼人がIT関連の知識を記録・共有するためのサービスです。 プログラミングに関するTips、ノウハウ、メモを簡単に記録 &amp; 公開することができます。"
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://info-space-box.net" />
      </Helmet>
      <Front />
      <MainFront element={<ArticleStack articles={articles} />} />
      <FrontFooter />
    </>
  );
}

Welcome.propTypes = {
  articles: PropTypes.array,
};
