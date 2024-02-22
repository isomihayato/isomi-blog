import {Grid} from '@mui/material';
import Front from '@/Components/header/Front';
import FrontSideBar from '@/Components/sidebar/FrontSideBar';
import MainFront from '@/Components/main/Front';
import BlogEditor from '@/Components/BlogEditor';
import FrontFooter from '@/Components/footer/FrontFooter';
import ArticleStack from '@/Components/layout/ArticleStack';

export default function Welcome({ auth, articles }) {
    return (
        <>
          <Front />
          <MainFront element={<ArticleStack articles={articles}/>}/>
          <FrontFooter />
        </>
    );
}
