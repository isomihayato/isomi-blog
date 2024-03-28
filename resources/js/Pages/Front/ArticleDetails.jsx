import * as React from 'react';
import { Box, Paper, Grid } from '@mui/material';
import Front from '@/Components/header/Front';
import FrontSideBar from '@/Components/sidebar/FrontSideBar';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Tags from '@/Components/Tags';
import { isMobile } from 'react-device-detect';
import CommentCard from '@/Components/surface/CommentCard';
import CommentsCard from '@/Components/surface/CommentsCard';
import { postComments } from '@/Components/axios/axiosComment';
import { getStorage } from '@/Components/common/functions';
import { Head } from '@inertiajs/react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

export default function ArticleDetails({ article }) {
  const [action, setAction] = React.useState(''); // editやdeleteなどのアクション時、comments変数を再読み込み
  const [comments, setComments] = React.useState(article.comments);
  const t_user = getStorage('user');
  const logged = t_user === null || t_user === undefined ? false : true;

  const ArticleContent = () => {
    return (
      <>
        <h1>目次</h1>
        <pre>
          <Markdown remarkPlugins={[remarkGfm]}>{article.body}</Markdown>
        </pre>
      </>
    );
  };
  const makeTitleStyle = () => {
    if (isMobile) {
      return {
        padding: '0 20px',
        fontSize: '1.8rem',
        fontWeight: 'bold',
      };
    } else {
      return {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        marginBottom: '70px',
        marginTop: '25px',
        marginLeft: '6px',
      };
    }
  };
  React.useEffect(() => {
    console.log(action);
    postComments({ id: article.id }, (res) => {
      setComments(res.data.comments);
    });
  }, [action]);

  return (
    <>
      <Helmet>
        <meta name="keywords" content={article.tags} />
        <meta name="description" content={article.describe} />
        <meta property="og:type" content="article" />
      </Helmet>
      <Head title={article.title} />
      <Front />
      <Grid container spacing={3}>
        <Grid item md={3}>
          {isMobile ? <></> : <FrontSideBar />}
        </Grid>
        <Grid item md={6} xs={12}>
          <div style={makeTitleStyle()}>
            {article.title}
            <Tags tags={article.tags.split(',')} />
          </div>
          <MainFront
            element={
              <>
                <ArticleContent />
              </>
            }
          />
        </Grid>
        <Grid item md={3}>
          {isMobile ? <></> : <FrontSideBar />}
        </Grid>
      </Grid>
      <Box component={Paper} className="comment__outer">
        <Box p={2}>
          <h2>コメント</h2>
          {comments.map((comment, index) => {
            return (
              <CommentsCard
                key={index}
                articleId={article.id}
                comment={comment}
                action={action}
                setAction={setAction}
              />
            );
          })}
          {logged ? (
            <></>
          ) : (
            <div className="cover">ログインしてコメントする</div>
          )}
          <CommentCard articleId={article.id} setAction={setAction} />
        </Box>
      </Box>
      <FrontFooter />
    </>
  );
}

ArticleDetails.propTypes = {
  article: PropTypes.object.isRequired,
};
