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
import Front from '@/Components/header/Front';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import ArticleStack from '@/Components/layout/ArticleStack';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Head, router } from '@inertiajs/react';
import BlogPagination from '@/Components/navigations/BlogPagination';

export default function Search({ articles_pagenation, search }) {
  const searchWord = search ?? '';
  const title = searchWord ? `「${searchWord}」の検索結果` : '';
  const submitHndlr = (e) => {
    e.preventDefault();
    const word = e.target.search.value.trim();
    // 検索語は Inertia にクエリとして渡す(& や # などもエンコードされる)
    router.get('/articles/search', word ? { search: word } : {});
  };
  const SearchPanel = () => {
    return (
      <>
        <Helmet>
          <meta property="og:type" content="article" />
          <meta
            name="keywords"
            content={'INFO BOX,INFO BOX 記事検索,記事検索'}
          />
          <meta name="description" content={`記事検索${title} | INFO BOX`} />
          <link
            rel="canonical"
            href="https://info-space-box.net/articles/search"
          />
        </Helmet>
        <Head title={`記事検索${title}`} />
        <Grid container component={'form'} onSubmit={submitHndlr}>
          <Grid item md={11} xs={10}>
            <TextField
              label="記事検索(タイトル・本文)"
              size="small"
              name="search"
              defaultValue={searchWord}
              inputProps={{ maxLength: 100 }}
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
        <ArticleStack articles={articles_pagenation.data} />
        <BlogPagination paginator={articles_pagenation} />
      </>
    );
  };
  return (
    <>
      <Front />
      <Breadcrumbs aria-label="breadcrumb" style={{ margin: '10px 15px' }}>
        <Link underline="hover" color="inherit" href="/">
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Top 記事一覧
        </Link>
        <Typography color="text.primary">
          <FindInPageIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          記事検索
        </Typography>
      </Breadcrumbs>
      <MainFront element={<SearchPanel />} />
      <FrontFooter />
    </>
  );
}

Search.propTypes = {
  articles_pagenation: PropTypes.object.isRequired,
  search: PropTypes.string,
};
