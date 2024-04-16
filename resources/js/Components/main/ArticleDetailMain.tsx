import { Box, Chip, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import Tags from '@/Components/Tags';
import FacebookShareButton from '../sns/FacebookShareButton';
import PocketLinkVertical from '../sns/PocketLinkVertical';
import { Suspense } from 'react';
import { ArticleType } from '../types/ArticleTypes';
import SnsSideBar from '@/Components/sidebar/SnsSideBar';
import { getFavoritesCount } from '@/Components/axios/axiosFavorite';
import { getStorage } from '@/Components/common/functions';
import { convertGenre, makeGenreColor } from '../filters/articleFilter';
import CachedIcon from '@mui/icons-material/Cached';

type Props = {
  article: ArticleType;
  articleElements: JSX.Element[];
  elements: JSX.Element[];
  action: string;
  setLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAction: React.Dispatch<React.SetStateAction<string>>;
};
export default function ArticleDetailMain(props: Props) {
  const { action, article, articleElements, elements } = props;
  const { setLoginOpen, setAction } = props;
  const [favorites, setFavorites] = React.useState(undefined); // お気に入り数
  const [loginedMemberFavorite, setLoginedMemberFavorite] =
    React.useState(undefined); // お気に入り登録済みかどうか
  const t_user = getStorage('user');

  useEffect(() => {
    if (t_user === null || t_user === undefined) return;
    getFavoritesCount(
      String(article.id),
      t_user.uid,
      (res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setFavorites(res.data.favorites);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setLoginedMemberFavorite(res.data.logined_member_favorite);
      },
      (err) => {
        console.log(err);
      },
    );
  }, [action]);
  const snsNavShow = window.location.href.includes('/articles/details/')
    ? true
    : false;
  const makeOuterStyle = () => {
    if (isMobile) {
      return {
        width: '90vw',
        margin: '0 auto',
        minHeight: '66vh',
        marginTop: '25px',
      };
    } else {
      return { margin: '50px auto', width: '50vw', minHeight: '65vh' };
    }
  };
  const makeTitleStyle = () => {
    if (isMobile) {
      return {
        padding: '5px 20px',
        fontSize: '1.65rem',
        fontWeight: 'bold',
      };
    } else {
      return {
        padding: '0px 56px 0',
        fontSize: '1.8rem',
        fontWeight: 'bold',
      };
    }
  };
  const underTitleSpanStype = {
    fontSize: '.8rem',
    fontWeight: '600',
    color: '#787878',
  };
  return (
    <>
      <Box id="main" style={makeOuterStyle()} className="font-style">
        <Grid container>
          <Grid md={2}>
            <SnsSideBar
              article={article}
              favorites={favorites}
              loginedMemberFavorite={loginedMemberFavorite}
              setOpen={setLoginOpen}
              setAction={setAction}
            />
          </Grid>
          <Grid md={10}>
            {articleElements?.map((element, index) => (
              <Box key={index + 'main-content'} component={Paper}>
                <span
                  style={{ margin: '15px 0 0 20px', display: 'inline-block' }}
                >
                  <Chip
                    label={convertGenre(article.genre)}
                    style={{
                      backgroundColor: makeGenreColor(article.genre),
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                </span>
                <div style={makeTitleStyle()}>
                  <h1> {article.title}</h1>
                  <span style={underTitleSpanStype}>
                    {article.published_at.slice(0, 10)}に公開
                  </span>
                  <CachedIcon
                    style={{ marginLeft: '10px', color: '#787878' }}
                  />
                  <span style={underTitleSpanStype}>
                    {article.updated_at.slice(0, 10)}
                  </span>
                  <div>
                    <Tags tags={article.tags.split(',')} />
                  </div>
                </div>

                <Suspense fallback={<div>Loading...</div>}>
                  <div
                    style={
                      isMobile
                        ? { padding: '10px 15px' }
                        : { padding: '0 56px 32px' }
                    }
                  >
                    {element}
                  </div>
                </Suspense>

                {snsNavShow && (
                  <>
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{ mt: 2 }}
                      style={{
                        fontSize: '1.2rem',
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        fontWeight: 'bold',
                        padding: '10px',
                        marginBottom: '20px',
                      }}
                    >
                      励みになります！
                    </Typography>
                    <Box
                      sx={{
                        width: '340px',
                        margin: '0 auto',
                        paddingBottom: '20px',
                      }}
                    >
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="flex-end"
                      >
                        <Grid item xs={3}>
                          <a
                            href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                            className="twitter-share-button"
                            data-show-count="false"
                          >
                            Tweet
                          </a>
                        </Grid>
                        <Grid item xs={3}>
                          <a
                            href="https://b.hatena.ne.jp/entry/"
                            className="hatena-bookmark-button"
                            data-hatena-bookmark-layout="vertical-normal"
                            data-hatena-bookmark-lang="ja"
                            title="このエントリーをはてなブックマークに追加"
                          >
                            <img
                              src="https://b.st-hatena.com/images/v4/public/entry-button/button-only@2x.png"
                              alt="このエントリーをはてなブックマークに追加"
                              width="20"
                              height="20"
                              style={{ border: 'none' }}
                            />
                          </a>
                        </Grid>
                        <Grid item xs={3}>
                          <FacebookShareButton url={window.location.href} />
                        </Grid>
                        <Grid item xs={3}>
                          <PocketLinkVertical lang="ja" />
                        </Grid>
                      </Grid>
                    </Box>
                  </>
                )}
              </Box>
            ))}
            {elements.map((element, index) => (
              <Box
                key={index + 'main-content'}
                component={Paper}
                sx={{ marginTop: '30px' }}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <div
                    style={
                      isMobile
                        ? { paddingTop: '1rem' }
                        : { padding: '1.5rem 2rem' }
                    }
                  >
                    {element}
                  </div>
                </Suspense>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
ArticleDetailMain.defaultProps = {};
