import React from 'react';
import PropTypes from 'prop-types';
import Front from '@/Components/header/Front';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import { Typography } from '@mui/material';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
            <Markdown remarkPlugins={[remarkGfm]}>{infomation.body}</Markdown>
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
