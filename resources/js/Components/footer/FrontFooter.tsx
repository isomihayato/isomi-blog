import { Box, Grid } from '@mui/material';
import React from 'react';
export default function FrontFooter() {
  const ulStyle = {
    fontSize: '.9rem',
  };
  return (
    <>
      <div id="footer">
        <Grid container id="footer__outer" alignItems="flex-end">
          <Grid item md={3} xs={6}>
            <Box id="logo">INFO BOX</Box>
            <span>情報の玉手箱(成長中)</span>
            <p id="copyright">© 2024 INFO BOX</p>
          </Grid>
          <Grid item md={9} xs={6}>
            <Box id="nav">
              <Grid container sx={ulStyle} alignItems="flex-end">
                <Grid item md={1} xs={12}>
                  <a href="/">ホーム</a>
                </Grid>
                <Grid item md={1} xs={12}>
                  <a href="/articles/search">記事検索</a>
                </Grid>
                <Grid item md={2} xs={12}>
                  <a href="/infomations/list">お知らせ一覧</a>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
FrontFooter.defaultProps = {};
