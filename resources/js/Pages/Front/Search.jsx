import React from 'react';
import {
  Typography,
  Button,
  Grid,
  TextField,
  Breadcrumbs,
  Link,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import ArticleStack from '@/Components/layout/ArticleStack';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Head } from '@inertiajs/react';
import ResponsibleHeader from '@/Components/header/ResponsibleHeader';

export default function Search(articles) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const searchWord = urlParams.get('search');
  console.log(searchWord);
  const title = searchWord ? `「${searchWord}」の検索結果` : '';
  const submitHndlr = (e) => {
    e.preventDefault();
    window.location.href = `/articles/search?search=${e.target.search.value}`;
  };
  const SearchPanel = () => {
    return (
      <>
        <Helmet>
          <meta property="og:type" content="article" />
          <meta
            name="keywords"
            content={'MIE Fishing,MIE Fishing 記事検索,記事検索'}
          />
          <meta name="description" content={`記事検索${title} | MIE Fishing`} />
          <link
            rel="canonical"
            href="https://mie-fishing.info/articles/search"
          />
        </Helmet>
        <Head title={`記事検索${title}`} />
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
      <Head title={`釣り記事検索`} />
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
                <FindInPageIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                記事検索
              </Typography>
            </Breadcrumbs>
          </>
        }
      />
      <MainFront element={<SearchPanel />} />
      <FrontFooter />
    </>
  );
}

Search.propTypes = {
  articles: PropTypes.array,
};
