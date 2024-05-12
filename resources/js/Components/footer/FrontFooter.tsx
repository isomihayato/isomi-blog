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
            <Box id="logo">MIE Fishing</Box>
            <span>三重フィッシング</span>
            <p id="copyright">© 2024 MIE Fishing</p>
          </Grid>
          <Grid item md={9} xs={6}>
            <Box id="nav">
              <Grid container sx={ulStyle} alignItems="flex-end" spacing={1}>
                <Grid item md={1} xs={12}>
                  <a href="/">ホーム</a>
                </Grid>
                <Grid item md={2} xs={12}>
                  <a href="/about">このサイトについて</a>
                </Grid>
                <Grid item md={1} xs={12}>
                  <a href="/articles/search">記事検索</a>
                </Grid>
                <Grid item md={1.5} xs={12}>
                  <a href="/infomations/list">お知らせ一覧</a>
                </Grid>
                <Grid item md={2} xs={12}>
                  <a href="/privacy_policy">プライバシーポリシー</a>
                </Grid>
                <Grid item md={2} xs={12}>
                  <a href="/contact">お問い合わせ</a>
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
