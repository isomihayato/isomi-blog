import React from 'react';
import PropTypes from 'prop-types';
import Front from '@/Components/header/Front';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import WebIcon from '@mui/icons-material/Web';
import { Helmet } from 'react-helmet';
import { Head } from '@inertiajs/react';
import ResponsibleHeader from '@/Components/header/ResponsibleHeader';

export default function InfomationList() {
  return (
    <>
      <Helmet>
        <meta
          name="keywords"
          content={'MIE Fishing,MIE Fishing about,MIE Fishing 概要'}
        />
        <meta
          name="description"
          content={
            '当ブログサイト、MIE Fishingは、管理主、コモ&トモのプログラミングや技術系の情報を発信するためのブログサイトです'
          }
        />
        <meta property="og:type" content="article" />
      </Helmet>
      <Head title={`MIE Fishingについて`} />
      <ResponsibleHeader
        breadcrumbsLink={
          <>
            <Breadcrumbs
              aria-label="breadcrumb"
              style={{ margin: '10px 15px' }}
            >
              <Link underline="hover" color="inherit" href="/">
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Top 記事一覧
              </Link>
              <Typography color="text.primary">
                <WebIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                このサイトについて
              </Typography>
            </Breadcrumbs>
          </>
        }
      />

      <MainFront
        element={
          <>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight={'bold'}
            >
              このサイトは何？
            </Typography>
            <Box>
              <Typography variant="body1" component="p" gutterBottom>
                このサイトは、管理主、コモ&トモのプログラミングや技術系の情報を発信するためのブログサイトです♪(
                ´θ｀)ノ
              </Typography>
              <br />
              <Typography variant="body1" component="p" gutterBottom>
                プログラミングを中心に、技術系の情報を発信していきゆくゆくは、ハードウェア系の情報も発信していきたいと考えています。
              </Typography>
              <br />
              <Typography variant="body1" component="p" gutterBottom>
                現在(2024年4月)は、技術を身につける段階ですので、読んでいる書籍を紹介する「読書メモ」や、技術系の情報を発信する「技術情報」、
                プログラミングに関する情報を発信する「プログラミング」、ふと思ったことを書き留める「ポエム」の4つのカテゴリーで情報を発信しています。
              </Typography>
              <br />
              <Typography variant="body1" component="p" gutterBottom>
                また、このサイトは、管理主がプログラミングを学び始めた2024年4月に作成したサイトです。
                そのため、技術的な情報が少ないですが、徐々に情報を充実させていく予定です。
              </Typography>
              <br />
              <br />

              <Typography variant="body1" component="p" gutterBottom>
                乞うご期待！✨
              </Typography>
            </Box>
          </>
        }
      />
      <FrontFooter />
    </>
  );
}

InfomationList.propTypes = {
  infomations_pagenation: PropTypes.object.isRequired,
};
