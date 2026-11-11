import React from 'react';
import FrontPage from '@/Components/layout/FrontPage';
import { Box, Typography } from '@mui/material';
import WebIcon from '@mui/icons-material/Web';
import { Helmet } from 'react-helmet';
import { Head } from '@inertiajs/react';

export default function About() {
  return (
    <>
      <Helmet>
        <meta
          name="keywords"
          content={'INFO BOX,INFO BOX about,INFO BOX 概要'}
        />
        <meta
          name="description"
          content={
            '当ブログサイト、INFO BOXは、管理主、りっすんのプログラミングや技術系の情報を発信するためのブログサイトです'
          }
        />
        <meta property="og:type" content="article" />
      </Helmet>
      <Head title={`INFO BOXについて`} />
      <FrontPage
        breadcrumbs={[
          {
            label: 'このサイトについて',
            icon: <WebIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
          },
        ]}
        title="このサイトは何？"
      >
        <Box>
          <Typography variant="body1" component="p" gutterBottom>
            このサイトは、管理主、りっすんのプログラミングや技術系の情報を発信するためのブログサイトです♪(
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
      </FrontPage>
    </>
  );
}
