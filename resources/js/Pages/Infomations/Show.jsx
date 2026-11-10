import React from 'react';
import PropTypes from 'prop-types';
import Front from '@/Components/header/Front';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import { Typography } from '@mui/material';
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
      <MainFront
        element={
          <>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ borderLeft: 'solid 5px #32be16', paddingLeft: '10px' }}
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
