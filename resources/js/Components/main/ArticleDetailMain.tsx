import { Box, Chip, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import Tags from '@/Components/Tags';
import { Suspense } from 'react';
import { ArticleType } from '../types/ArticleTypes';
import SnsSideBar from '@/Components/sidebar/SnsSideBar';
import { getFavoritesCount } from '@/Components/axios/axiosFavorite';
import { useFavoriteClick } from '@/Components/common/favorite';
import { convertGenre, makeGenreColor } from '../filters/articleFilter';
import CachedIcon from '@mui/icons-material/Cached';
import ShareButtons from '@/Components/sns/ShareButtons';

type Props = {
  article: ArticleType;
  articleElements: JSX.Element[];
  elements: JSX.Element[];
  action: string;
  setAction: React.Dispatch<React.SetStateAction<string>>;
};
export default function ArticleDetailMain(props: Props) {
  const { action, article, articleElements, elements } = props;
  const [favorites, setFavorites] = React.useState<number | undefined>(
    undefined,
  ); // お気に入り数
  const onFavorite = useFavoriteClick(article.id, setFavorites);
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
              onFavorite={onFavorite}
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
                    {/* 共有ボタンは本文下と左の固定表示(スマホは下部バー)の2か所にそろえる */}
                    <Box sx={{ paddingBottom: '20px' }}>
                      <ShareButtons
                        url={`https://info-space-box.net/articles/details/${article.id}`}
                        title={article.title}
                      />
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
