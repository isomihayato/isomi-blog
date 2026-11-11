import { Box, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import Tags from '@/Components/Tags';
import { Suspense } from 'react';
import { ArticleType } from '../types/ArticleTypes';
import SnsSideBar from '@/Components/sidebar/SnsSideBar';
import { useFavoriteClick } from '@/Components/common/favorite';
import GenreChip from '@/Components/GenreChip';
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
  const { article, articleElements, elements } = props;
  // お気に入り数はページ表示時に受け取る(以前はコメントの投稿・編集のたびにも API で取り直していた)
  const [favorites, setFavorites] = React.useState<number | undefined>(
    article.favorites_count,
  );
  const onFavorite = useFavoriteClick(article.id, setFavorites);

  const snsNavShow = window.location.href.includes('/articles/details/')
    ? true
    : false;
  const underTitleSpanStype = {
    fontSize: '.8rem',
    fontWeight: '600',
    color: '#666', // 白背景の上で 5.74:1
  };
  return (
    <>
      <Box
        id="main"
        className="font-style"
        sx={{
          display: 'flex',
          width: '100%',
          mx: 'auto',
          mt: { xs: '25px', md: '50px' },
          mb: { md: '50px' },
          minHeight: '65vh',
        }}
      >
        {/* SNSボタンの列。スマホ幅では画面下に固定したバーになるため、幅を取らない */}
        <Box sx={{ flexShrink: 0, width: { md: '100px' } }}>
          <SnsSideBar
            article={article}
            favorites={favorites}
            onFavorite={onFavorite}
          />
        </Box>
        {/* 本文は最大 800px にして、大きな画面でも1行が長くなりすぎないようにする */}
        <Box sx={{ flex: '1 1 auto', minWidth: 0, maxWidth: '800px' }}>
          {articleElements?.map((element, index) => (
            <Box key={index + 'main-content'} component={Paper}>
              <span
                style={{ margin: '15px 0 0 20px', display: 'inline-block' }}
              >
                <GenreChip genre={article.genre} size="medium" />
              </span>
              <Box
                sx={{
                  padding: { xs: '5px 20px', md: '0px 56px 0' },
                  fontSize: { xs: '1.65rem', md: '1.8rem' },
                  fontWeight: 'bold',
                }}
              >
                <h1> {article.title}</h1>
                <span style={underTitleSpanStype}>
                  {article.published_at.slice(0, 10)}に公開
                </span>
                <CachedIcon style={{ marginLeft: '10px', color: '#666' }} />
                <span style={underTitleSpanStype}>
                  {article.updated_at.slice(0, 10)}
                </span>
                <div>
                  <Tags tags={article.tags.split(',')} />
                </div>
              </Box>

              <Suspense fallback={<div>Loading...</div>}>
                <Box sx={{ padding: { xs: '10px 15px', md: '0 56px 32px' } }}>
                  {element}
                </Box>
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
                <Box
                  sx={{
                    padding: { xs: '1rem 0 0', md: '1.5rem 2rem' },
                  }}
                >
                  {element}
                </Box>
              </Suspense>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}
ArticleDetailMain.defaultProps = {};
