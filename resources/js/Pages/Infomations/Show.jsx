import React from 'react';
import PropTypes from 'prop-types';
import Front from '@/Components/header/Front';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import { Typography } from '@mui/material';
import Markdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default function Show({ infomation }) {
  return (
    <>
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
