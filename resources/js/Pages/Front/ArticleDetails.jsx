import { Grid } from '@mui/material';
import Front from '@/Components/header/Front';
import FrontSideBar from '@/Components/sidebar/FrontSideBar';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';

export default function ArticleDetails({ auth, article }) {
    console.log(article);
    const ArticleContent = () => {
        return (
            <>
                <h1>目次</h1>
                <p>{article.body}</p>
            </>
        );
    }

    return (
        <>
            <Front />
            <Grid container spacing={3}>
                <Grid item xs={3}>
                    <FrontSideBar />
                </Grid>
                <Grid item xs={6}>
                    <div style={{fontSize: '2.3rem',fontWeight: 'bold',marginBottom: '70px',marginLeft: '24px'}}>{article.title}</div>
                    <MainFront element={<ArticleContent/>} />
                </Grid>
                <Grid item xs={3}>
                    <FrontSideBar />
                </Grid>
            </Grid>

            <FrontFooter />
        </>
    );
}