import React from 'react';
import { Button, Grid, TextField } from '@mui/material';
import Front from '@/Components/header/Front';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import ArticleStack from '@/Components/layout/ArticleStack';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

export default function Search(articles) {
  const submitHndlr = (e) => {
    e.preventDefault();
    window.location.href = `/articles/search?search=${e.target.search.value}`;
  };
  const SearchPanel = () => {
    return (
      <>
        <Helmet>
          <meta property="og:type" content="article" />
          <link
            rel="canonical"
            href="https://info-space-box.net/articles/search"
          />
        </Helmet>
        <Grid container component={'form'} onSubmit={submitHndlr}>
          <Grid item md={11} xs={10}>
            <TextField
              label="記事タイトル検索"
              size="small"
              name="search"
              fullWidth
            />
          </Grid>
          <Grid item md={1} xs={2}>
            <Button type="submit" variant="contained">
              検索
            </Button>
          </Grid>
        </Grid>
        <div style={{ margin: '30px 0 0' }}></div>
        <ArticleStack articles={articles.articles} />
      </>
    );
  };
  return (
    <>
      <Front />
      <MainFront element={<SearchPanel />} />
      <FrontFooter />
    </>
  );
}

Search.propTypes = {
  articles: PropTypes.array,
};
