import {Grid} from '@mui/material';
import Front from '@/Components/header/Front';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import ArticleStack from '@/Components/layout/ArticleStack';

export default function Welcome({ auth, articles }) {
    return (
        <>
          <Front />
          <MainFront element={<></>}/>
          <FrontFooter />
        </>
    );
}
