import { Box, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import { isMobile } from 'react-device-detect';
import Tags from '@/Components/Tags';
import { Suspense } from 'react';
import { ArticleType } from '../types/ArticleTypes';
import SnsSideBar from '@/Components/sidebar/SnsSideBar';
import { useFavoriteClick } from '@/Components/common/favorite';
import GenreChip from '@/Components/GenreChip';
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
  const { article, articleElements, elements } = props;
  // お気に入り数はページ表示時に受け取る(以前はコメントの投稿・編集のたびにも API で取り直していた)
  const [favorites, setFavorites] = React.useState<number | undefined>(
    article.favorites_count,
  );
  const onFavorite = useFavoriteClick(article.id, setFavorites);

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
    color: '#666', // 白背景の上で 5.74:1
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
                  <GenreChip genre={article.genre} size="medium" />
                </span>
                <div style={makeTitleStyle()}>
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
