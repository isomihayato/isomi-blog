import * as React from 'react';
import { Box, Paper, Grid, Breadcrumbs, Link, Typography } from '@mui/material';
import Front from '@/Components/header/Front';
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
import LeftSideBar from '@/Components/sidebar/LeftSideBar';
import RightSideBar from '@/Components/sidebar/RightSideBar';
import { postAdvertisement } from '@/Components/axios/axiosAdvertisement';
import HomeIcon from '@mui/icons-material/Home';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

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
  const [advertisements, setAdvertisements] = React.useState([]);
  const [loginedMemberFavorite, setLoginedMemberFavorite] =
    React.useState(undefined); // お気に入り登録済みかどうか
  const [loginOpen, setLoginOpen] = React.useState(false); // ログインダイアログの表示
  let count = 1;
  const t_user = getStorage('user');
  const logged = t_user === null || t_user === undefined ? false : true;

  const listItems = article.body?.split('\n').map((line, index) => {
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
    postAdvertisement(
      { article_id: article.id },
      (res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setAdvertisements(res.data.ad_templates);
      },
      (err) => {
        console.log(err);
      },
    );
  }, []);
  React.useEffect(() => {
    postComments({ id: article.id }, (res) => {
      setComments(res.data.comments);
    });
    if (t_user === null || t_user === undefined) return;
    getFavoritesCount(
      article.id,
      t_user.uid,
      (res) => {
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
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@info_space_box" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.describe} />
        <meta property="og:title" content={article.title} />
        <meta property="og:url" content={window.location.href} />
        {/* <meta property="og:image" content="画像のURL" /> */}
        <meta property="og:description" content={article.describe} />
        <meta property="og:site_name" content="INFO BOX" />
        <meta property="fb:app_id" content="1437461986868001" />
        {/* <meta name="twitter:image" content="画像のURL"></meta> */}
        <link
          rel="canonical"
          href={`https://info-space-box.net/articles/details/${article.id}`}
        />
      </Helmet>
      <Head title={article.title} />
      <Front loginOpen={loginOpen} setLoginOpen={setLoginOpen} />
      <Breadcrumbs aria-label="breadcrumb" style={{ margin: '10px 15px' }}>
        <Link underline="hover" color="inherit" href="/">
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Top 記事一覧
        </Link>
        <Typography color="text.primary">
          <AutoStoriesIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          記事詳細
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={3}>
        <Grid item md={2.5} xs={0}>
          {isMobile ? <></> : <LeftSideBar advertisements={advertisements} />}
        </Grid>
        <Grid item md={0.5} xs={0}>
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
        <Grid item md={3} xs={0}>
          {isMobile ? <></> : <RightSideBar advertisements={advertisements} />}
        </Grid>
      </Grid>
      {isMobile ? null : (
        <>
          {advertisements
            .filter((ad) => ad.arrangement_name.includes('中央'))
            .map((ad) => {
              return (
                <div
                  key={ad.arrangement_name}
                  dangerouslySetInnerHTML={{ __html: ad.content }}
                />
              );
            })}
        </>
      )}
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
          {isMobile ? null : (
            <>
              {advertisements
                .filter((ad) => ad.arrangement_name.includes('コメント下'))
                .map((ad) => {
                  return (
                    <div
                      key={ad.arrangement_name}
                      dangerouslySetInnerHTML={{ __html: ad.content }}
                    />
                  );
                })}
            </>
          )}
        </Box>
      </Box>
      <FrontFooter />
    </>
  );
}

ArticleDetails.propTypes = {
  article: PropTypes.object.isRequired,
};
