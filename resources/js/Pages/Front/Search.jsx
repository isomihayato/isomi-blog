import { Button, Grid, TextField} from '@mui/material';
import { useState } from 'react';
import Front from '@/Components/header/Front';
import MainFront from '@/Components/main/Front';
import BlogEditor from '@/Components/BlogEditor';
import FrontFooter from '@/Components/footer/FrontFooter';
import ArticleStack from '@/Components/layout/ArticleStack';
import { postSearchArticle } from '@/Components/axios/axiosArticle';

export default function Welcome({ auth }) {
  const [articles, setArticles] = useState([]);
  const submitHndlr = (e) => {
    e.preventDefault();
    postSearchArticle({search: e.target.search.value},(res)=>{
      console.log(res.data);
      setArticles(res.data.articles);
    });
  }
    const SearchPanel = () => {
        return (
            <>
              <Grid container component={"form"} onSubmit={submitHndlr}>
                <Grid item xs={11}>
                  <TextField 
                    label="記事タイトル検索" 
                    size='small' 
                    name="search" 
                    fullWidth
                  />
                </Grid>
                <Grid item xs={1}>
                  <Button type="submit" variant='contained'>検索</Button>
                </Grid>
              </Grid>
              <div style={{margin: '30px 0 0'}}></div>
              <ArticleStack articles={articles}/>
            </>
        );
    }
    return (
        <>
          <Front />
          <MainFront element={<SearchPanel/>}/>
          <FrontFooter />
        </>
    );
}
