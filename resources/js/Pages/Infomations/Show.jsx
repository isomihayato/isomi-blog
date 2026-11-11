import React from 'react';
import PropTypes from 'prop-types';
import Front from '@/Components/header/Front';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import { Typography, Breadcrumbs, Link, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ArticleIcon from '@mui/icons-material/Article';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Markdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { Helmet } from 'react-helmet';
import { Head } from '@inertiajs/react';

// 本文(Markdown)の先頭から、記号を除いた説明文を作る
function makeDescription(body) {
  return (body ?? '')
    .replace(/[#>*_`~\[\]()!-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
}

export default function Show({ infomation }) {
  return (
    <>
      <Helmet>
        <meta property="og:type" content="article" />
        <meta name="description" content={makeDescription(infomation.body)} />
        <link
          rel="canonical"
          href={`https://info-space-box.net/infomations/${infomation.id}`}
        />
      </Helmet>
      <Head title={`${infomation.title} | お知らせ`} />
      <Front />
      <Breadcrumbs aria-label="breadcrumb" style={{ margin: '10px 15px' }}>
        <Link underline="hover" color="inherit" href="/">
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Top 記事一覧
        </Link>
        <Link underline="hover" color="inherit" href="/infomations/list">
          <InfoIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          お知らせ一覧
        </Link>
        <Typography color="text.primary" aria-current="page">
          <ArticleIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          {infomation.title}
        </Typography>
      </Breadcrumbs>
      <MainFront
        element={
          <>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight={'bold'}
              sx={{
                borderLeft: 'solid 5px #32be16',
                paddingLeft: '10px',
                // お知らせのタイトルは長くなりやすいので、スマホでは小さくする
                fontSize: { xs: '1.5rem', sm: '2.125rem' },
              }}
            >
              {infomation.title}
            </Typography>
            {infomation.publish_at ? (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <time dateTime={infomation.publish_at.replace(' ', 'T')}>
                  {infomation.publish_at.slice(0, 10)}
                </time>
              </Typography>
            ) : null}
            <pre className="markdown-preview">
              <Markdown rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}>
                {infomation.body}
              </Markdown>
            </pre>
            <Box mt={4}>
              <Link
                href="/infomations/list"
                underline="hover"
                sx={{ display: 'inline-flex', alignItems: 'center' }}
              >
                <ChevronLeftIcon fontSize="small" />
                お知らせ一覧に戻る
              </Link>
            </Box>
          </>
        }
      />
      <FrontFooter />
    </>
  );
}

Show.propTypes = {
  infomation: PropTypes.object.isRequired,
};
