import { Box, Grid } from '@mui/material';
import React from 'react';
export default function FrontFooter() {
  const ulStyle = {
    display: 'flex',
    fontSize: '.9rem',
  };
  return (
    <>
      <div id="footer">
        <Grid container id="footer__outer">
          <Grid item md={3} xs={6}>
            <Box id="logo">INFO BOX</Box>
            <span>情報の玉手箱(成長中)</span>
            <p id="copyright">© 2024 INFO BOX</p>
          </Grid>
          <Grid item md={9} xs={6}>
            <Grid container alignItems="flex-end" style={{ height: '100%' }}>
              <Box id="nav">
                <ul style={ulStyle}>
                  <li style={{ paddingRight: '10px' }}>
                    <a href="/">ホーム</a>
                  </li>
                  <li>
                    <a href="/articles/search">記事検索</a>
                  </li>
                  <li>
                    <a href="/infomations/list">お知らせ一覧</a>
                  </li>
                </ul>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
FrontFooter.defaultProps = {};
