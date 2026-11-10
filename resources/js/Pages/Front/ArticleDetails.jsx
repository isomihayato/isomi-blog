/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef } from 'react';
import {
  Alert,
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Stack,
  Grid,
} from '@mui/material';
import Front from '@/Components/header/Front';
import ArticleDetailMain from '@/Components/main/ArticleDetailMain';
import FrontFooter from '@/Components/footer/FrontFooter';
import Markdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import CodeBlock from '@/Components/dataDispaly/CodeBlock';
import ArticleNeighborNav from '@/Components/navigations/ArticleNeighborNav';
import { isMobile } from 'react-device-detect';
import CommentCard from '@/Components/surface/CommentCard';
import CommentsCard from '@/Components/surface/CommentsCard';
import { postComments } from '@/Components/axios/axiosComment';
import { getStorage } from '@/Components/common/functions';
import { Head } from '@inertiajs/react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import RightSideBar from '@/Components/sidebar/RightSideBar';
import { postAdvertisement } from '@/Components/axios/axiosAdvertisement';
import HomeIcon from '@mui/icons-material/Home';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { styled } from '@mui/material/styles';
import LeftSideBar from '@/Components/sidebar/LeftSideBar';
import PreviewNotice from '@/Components/feedback/PreviewNotice';

export default function ArticleDetails({
  article,
  relative_articles,
  prev_article,
  next_article,
}) {
  const [action, setAction] = React.useState(''); // editやdeleteなどのアクション時、comments変数を再読み込み
  const [comments, setComments] = React.useState(article.comments ?? []);
  const [commentsError, setCommentsError] = React.useState(false); // コメントの取得に失敗したか
  const [advertisements, setAdvertisements] = React.useState([]);
  const [loginOpen, setLoginOpen] = React.useState(false); // ログインダイアログの表示
  const [chapters, setChapters] = React.useState([]); // 記事の章リスト
  const [codeHighlight, setCodeHighlight] = React.useState(null); // コードのハイライト用 rehype プラグイン(読み込み後にセット)
  const adElementRef = useRef(null);
  const isLoggedIn = () => {
    const t_user = getStorage('user');
    return t_user !== null && t_user !== undefined;
  };
  // ログイン状態をstateで保持し、ログイン成功時に再描画してコメントのオーバーレイを消す
  const [logged, setLogged] = React.useState(isLoggedIn);
  const funAdvertises = advertisements.filter((ad) =>
    ad.ad_arrangements.includes('おもしろエリア'),
  );
  const Item = styled('div')(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
  }));

  const ArticleContent = () => {
    return (
      <>
        <pre>
          <Markdown
            rehypePlugins={[
              rehypeSlug,
              rehypeAutolinkHeadings,
              ...(codeHighlight ? [codeHighlight] : []),
            ]}
            components={{ pre: CodeBlock }}
          >
            {article.body}
          </Markdown>
        </pre>
        <ArticleNeighborNav
          prevArticle={prev_article ?? null}
          nextArticle={next_article ?? null}
        />
      </>
    );
  };

  React.useEffect(() => {
    // コードブロックがある記事だけ、ハイライト処理を後から読み込む(初期表示の JS を増やさないため)
    if (!article.body?.includes('```')) return;
    import('@/Components/common/rehypeCodeHighlight')
      .then((module) => setCodeHighlight(() => module.default))
      .catch((e) => console.error(e));
  }, []);

  React.useEffect(() => {
    // article.bodyから章を抽出し、chaptersオブジェクトを作成
    // 絵文字,記号,空白を削除し、## で始まる行を抽出
    const cha = article.body?.split('\n').filter((b) => {
      if (b.startsWith('## ') || b.startsWith('### ')) {
        return b;
      }
    });
    setChapters(cha);
  }, []);

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
    // 初回表示時はサーバーから受け取ったコメントを使用し、重複リクエストを省略する
    if (action === '') return;
    postComments(
      { id: article.id },
      (res) => {
        setComments(res.data.comments ?? []);
        setCommentsError(false);
      },
      () => {
        // 取得に失敗しても画面が落ちないよう、一覧を空にしてメッセージを出す
        setComments([]);
        setCommentsError(true);
      },
    );
  }, [action]);

  const mainUnderElements = [
    <>
      {funAdvertises.length > 0 ? (
        <Box
          id="advertisement"
          sx={{
            minHeight: '500px',
            padding: isMobile ? '10px 15px' : '20px',
          }}
          ref={adElementRef}
        >
          <h2 style={{ marginTop: 0 }}>おもしろ広告エリア🔭👀</h2>
          <Typography variant="body1">
            広告は広告でも、管理者が「面白そうだな！」と感じたものをピックアップ！
          </Typography>
          <Typography variant="body1">
            お時間があれば、ぜひご覧ください😁
          </Typography>
          <Grid
            container
            spacing={1}
            mt={'20px'}
            justifyContent="center"
            alignItems="center"
          >
            {funAdvertises.map((advertisement, index) => {
              return (
                <Grid
                  key={index + 'advertise_omosiro'}
                  item
                  lg={4}
                  md={6}
                  xs={12}
                >
                  <span>{advertisement.article_ad.comment}</span>
                  <div
                    key={advertisement.article_ad.name}
                    dangerouslySetInnerHTML={{
                      __html: advertisement.article_ad.content,
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ) : null}
    </>,
    <>
      <Box id="comment">
        <Box p={2}>
          <h2 style={{ margin: 0 }}>コメント</h2>
          {commentsError ? (
            <Alert severity="error" sx={{ my: 1 }}>
              コメントを読み込めませんでした。時間をおいて、ページを再読み込みしてください。
            </Alert>
          ) : null}
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
          {/* 未ログイン時はフォームを無効にし、ログインダイアログを開くボタンを出す */}
          <CommentCard
            articleId={article.id}
            setAction={setAction}
            onLoginClick={() => setLoginOpen(true)}
          />
        </Box>
      </Box>
    </>,
  ];

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
        <meta name="twitter:image" content="/img/og_image.webp"></meta>
        <meta property="og:title" content={article.title} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="/img/og_image.webp" />
        <meta property="og:description" content={article.describe} />
        <meta property="og:site_name" content="INFO BOX" />
        <meta property="fb:app_id" content="1437461986868001" />
        <link
          rel="canonical"
          href={`https://info-space-box.net/articles/details/${article.id}`}
        />
      </Helmet>
      <Head title={article.title} />
      <Front
        loginOpen={loginOpen}
        setLoginOpen={setLoginOpen}
        onLoginSuccess={() => setLogged(isLoggedIn())}
      />
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
      <PreviewNotice article={article} />
      <Box margin={'0 auto'} className="font-style">
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="flex-start"
        >
          {isMobile ? null : (
            <Item>
              <LeftSideBar
                elementRef={adElementRef}
                advertisements={advertisements}
              />
            </Item>
          )}
          <Item>
            <ArticleDetailMain
              article={article}
              articleElements={[
                // eslint-disable-next-line react/jsx-key
                <ArticleContent />,
              ]}
              elements={
                advertisements.length > 0
                  ? mainUnderElements
                  : mainUnderElements.slice(1)
              }
              action={action}
              setAction={setAction}
            />
          </Item>
          {isMobile ? (
            <></>
          ) : (
            <Item>
              <RightSideBar
                chapters={chapters}
                relativeArticles={relative_articles}
              />
            </Item>
          )}
        </Stack>
      </Box>
      <FrontFooter />
    </>
  );
}

ArticleDetails.propTypes = {
  article: PropTypes.object.isRequired,
  relative_articles: PropTypes.array.isRequired,
  prev_article: PropTypes.object,
  next_article: PropTypes.object,
};
