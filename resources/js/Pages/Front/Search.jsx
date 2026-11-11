import React from 'react';
import {
  Typography,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Breadcrumbs,
  Link,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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
  const total = articles_pagenation.total ?? 0;
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
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          記事検索
        </Typography>
        <Box component="form" role="search" onSubmit={submitHndlr}>
          {/* Enter キーでも、右端の虫眼鏡ボタンでも検索できる */}
          <TextField
            label="記事を検索"
            placeholder="タイトルや本文に含まれる言葉"
            name="search"
            defaultValue={searchWord}
            inputProps={{ maxLength: 100 }}
            fullWidth
            sx={{ bgcolor: 'background.paper' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" aria-label="検索する" edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {/* 検索結果の件数(検索語があるときだけ) */}
        {searchWord ? (
          <Typography sx={{ mt: 3, mb: 1 }} role="status" aria-live="polite">
            「{searchWord}」の検索結果 {total}件
          </Typography>
        ) : (
          <div style={{ margin: '24px 0 0' }}></div>
        )}
        {total === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
              {searchWord
                ? `「${searchWord}」に一致する記事は見つかりませんでした。`
                : '公開中の記事はまだありません。'}
            </Typography>
            {searchWord ? (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                別のキーワードや、短い言葉で試してください。
              </Typography>
            ) : null}
            <Button variant="outlined" href="/">
              最新の記事を見る
            </Button>
          </Paper>
        ) : (
          <>
            <ArticleStack articles={articles_pagenation.data} />
            <BlogPagination paginator={articles_pagenation} />
          </>
        )}
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
      {/* トップと同じく、白い枠を付けずに表示する */}
      <MainFront element={<SearchPanel />} paper={false} />
      <FrontFooter />
    </>
  );
}

Search.propTypes = {
  articles_pagenation: PropTypes.object.isRequired,
  search: PropTypes.string,
};
