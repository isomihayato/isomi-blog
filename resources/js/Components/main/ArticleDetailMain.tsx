import { Box, Chip, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import Tags from '@/Components/Tags';
import { Suspense } from 'react';
import { ArticleType } from '../types/ArticleTypes';
import SnsSideBar from '@/Components/sidebar/SnsSideBar';
import { getFavoritesCount } from '@/Components/axios/axiosFavorite';
import { convertGenre, makeGenreColor } from '../filters/articleFilter';
import CachedIcon from '@mui/icons-material/Cached';
import {
  FacebookShareButton,
  FacebookIcon,
  HatenaShareButton,
  HatenaShareCount,
  HatenaIcon,
  LineShareButton,
  LineIcon,
  VKIcon,
  VKShareButton,
  VKShareCount,
  PocketIcon,
  PocketShareButton,
  TwitterShareButton,
  XIcon,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';

type Props = {
  article: ArticleType;
  articleElements: JSX.Element[];
  elements: JSX.Element[];
  action: string;
  setAction: React.Dispatch<React.SetStateAction<string>>;
};
export default function ArticleDetailMain(props: Props) {
  const { action, article, articleElements, elements } = props;
  const { setAction } = props;
  const [favorites, setFavorites] = React.useState(undefined); // お気に入り数
  React.useState(undefined); // お気に入り登録済みかどうか

  useEffect(() => {
    getFavoritesCount(
      String(article.id),
      (res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        console.log('favorites', res.data.favorites);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setFavorites(res.data.favorites);
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
      return { margin: '50px auto', width: '65vw', minHeight: '65vh' };
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
          <Grid md={2} xs={0}>
            <SnsSideBar
              article={article}
              favorites={favorites}
              setAction={setAction}
            />
          </Grid>
          <Grid md={10} xs={12}>
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
                        width: '70%',
                        margin: '0 auto',
                        paddingBottom: '20px',
                      }}
                    >
                      <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-end"
                        textAlign={'center'}
                      >
                        <Grid item xs={3}>
                          <LineShareButton
                            url={window.location.href}
                            title={article.title}
                            className="Demo__some-network__share-button"
                          >
                            <LineIcon size={32} round />
                          </LineShareButton>
                        </Grid>
                        <Grid item xs={3}>
                          <TwitterShareButton
                            url={window.location.href}
                            title={article.title}
                            className="Demo__some-network__share-button"
                          >
                            <XIcon size={32} round />
                          </TwitterShareButton>
                        </Grid>
                        <Grid item xs={3}>
                          <div className="Demo__some-network">
                            <div>
                              <HatenaShareCount
                                url={window.location.href}
                                className="Demo__some-network__share-count"
                              />
                            </div>
                            <HatenaShareButton
                              url={window.location.href}
                              title={article.title}
                              windowWidth={660}
                              windowHeight={460}
                              className="Demo__some-network__share-button"
                            >
                              <HatenaIcon size={32} round />
                            </HatenaShareButton>
                          </div>
                        </Grid>
                        <Grid item xs={3}>
                          <FacebookShareButton url={window.location.href}>
                            <FacebookIcon size={32} round />
                          </FacebookShareButton>
                        </Grid>
                        <Grid item xs={3}>
                          <PocketShareButton
                            url={window.location.href}
                            title={article.title}
                            className="Demo__some-network__share-button"
                          >
                            <PocketIcon size={32} round />
                          </PocketShareButton>
                        </Grid>
                        <Grid item xs={3}>
                          <div style={{ textAlign: 'center' }}>
                            <VKShareCount
                              url={window.location.href}
                              className="Demo__some-network__share-count"
                            />
                          </div>
                          <VKShareButton
                            url={window.location.href}
                            className="Demo__some-network__share-button"
                          >
                            <VKIcon size={32} round />
                          </VKShareButton>
                        </Grid>
                        <Grid item xs={3}>
                          <WhatsappShareButton
                            url={window.location.href}
                            title={article.title}
                            separator=":: "
                            className="Demo__some-network__share-button"
                          >
                            <WhatsappIcon size={32} round />
                          </WhatsappShareButton>
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
