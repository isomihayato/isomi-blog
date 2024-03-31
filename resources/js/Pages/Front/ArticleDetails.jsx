import * as React from 'react';
import { Box, Paper, Grid } from '@mui/material';
import Front from '@/Components/header/Front';
import FrontSideBar from '@/Components/sidebar/FrontSideBar';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import Markdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import Tags from '@/Components/Tags';
import { isMobile } from 'react-device-detect';
import CommentCard from '@/Components/surface/CommentCard';
import CommentsCard from '@/Components/surface/CommentsCard';
import { postComments } from '@/Components/axios/axiosComment';
import { getStorage } from '@/Components/common/functions';
import { Head } from '@inertiajs/react';
import { Helmet } from 'react-helmet';
import SnsSideBar from '@/Components/sidebar/SnsSideBar';
import PropTypes from 'prop-types';
import { getFavoritesCount } from '@/Components/axios/axiosFavorite';
const TocStyle = {
  width: isMobile ? '75%' : '60%',
  margin: '0 auto',
  border: 'solid 1px #aaaaaa',
  backgroundColor: '#32be1630',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
};

export default function ArticleDetails({ article }) {
  const [action, setAction] = React.useState(''); // editやdeleteなどのアクション時、comments変数を再読み込み
  const [comments, setComments] = React.useState(article.comments);
  const [favorites, setFavorites] = React.useState(undefined); // お気に入り数
  const [loginedMemberFavorite, setLoginedMemberFavorite] =
    React.useState(undefined); // お気に入り登録済みかどうか
  const [loginOpen, setLoginOpen] = React.useState(false); // ログインダイアログの表示
  let count = 1;
  const t_user = getStorage('user');
  const logged = t_user === null || t_user === undefined ? false : true;

  const listItems = article.body.split('\n').map((line, index) => {
    if (line.startsWith('# ')) {
      const item = (
        <li
          key={index}
          onClick={() =>
            (window.location.href = `/articles/details/${article.id}#${line.replace('# ', '').replaceAll('.', '-').replaceAll(' ', '').toLowerCase()}`)
          }
        >
          {line.replace('# ', `${count}. `)}
        </li>
      );
      count++;
      return item;
    }
    if (line.startsWith('## ')) {
      const item = (
        <li
          key={index}
          onClick={() =>
            (window.location.href = `/articles/details/${article.id}#${line.replace('## ', '').replaceAll('.', '-').replaceAll(' ', '').toLowerCase()}`)
          }
        >
          &nbsp;&nbsp;&nbsp;&nbsp;
          {line.replace('## ', `${count}. `)}
        </li>
      );
      count++;
      return item;
    }
    return null;
  });
  const ArticleContent = () => {
    return (
      <>
        <Box
          id="toc__outer"
          border={'solid 1px #aaaaaa'}
          bgcolor={'#32be1630'}
          style={TocStyle}
        >
          <Box
            id="toc__header"
            textAlign={'center'}
            style={{ fontSize: '1.4rem', fontWeight: 'bold', padding: '15px' }}
          >
            目次
          </Box>
          <Box id="toc__content" style={{ padding: '0 20px 15px' }}>
            <ul>{listItems}</ul>
          </Box>
        </Box>
        <pre>
          <Markdown rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}>
            {article.body}
          </Markdown>
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
    getFavoritesCount(
      article.id,
      t_user.uid,
      (res) => {
        console.log(res);
        setFavorites(res.data.favorites);
        setLoginedMemberFavorite(res.data.logined_member_favorite);
      },
      (err) => {
        console.log(err);
      },
    );
  }, [action]);

  return (
    <>
      <Helmet>
        <meta name="keywords" content={article.tags} />
        <meta name="description" content={article.describe} />
        <meta property="og:type" content="article" />
      </Helmet>
      <Head title={article.title} />
      <Front loginOpen={loginOpen} setLoginOpen={setLoginOpen} />
      <Grid container spacing={3}>
        <Grid item md={2.5}>
          {isMobile ? <></> : <FrontSideBar />}
        </Grid>
        <Grid item md={0.5}>
          <SnsSideBar
            article={article}
            favorites={favorites}
            loginedMemberFavorite={loginedMemberFavorite}
            setOpen={setLoginOpen}
            setAction={setAction}
          />
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
