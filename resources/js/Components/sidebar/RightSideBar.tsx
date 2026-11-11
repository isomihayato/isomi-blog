import React from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';
import VerticalStepper from '../navigations/VerticalSteper';
import { ArticleType } from '../types/ArticleTypes';
import RelativeArticleStack from '../layout/RelativeArticleStack';
import type { ArticleHeading } from '../common/articleHeadings';
import PopularArticles, { PopularArticleType } from '../layout/PopularArticles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: '25px 16px',
  color: theme.palette.text.secondary,
}));
type Props = {
  headings: ArticleHeading[];
  relativeArticles: ArticleType[];
  popularArticles?: PopularArticleType[];
};
export default function RightSideBar(props: Props) {
  const { headings, relativeArticles, popularArticles = [] } = props;
  const rightSideWidth = '300px';

  // 目次と関連記事は CSS の position: sticky で画面に追従させる。
  // (以前は JS で static と fixed を切り替えていたため、切り替えのときに表示位置が飛んでいた)
  // sticky が効くよう、親の列(ArticleDetails の右側の Item)は本文と同じ高さまで伸ばしている。
  return (
    <Box
      sx={{
        width: rightSideWidth,
        height: 'calc(100% - 50px)',
        marginTop: '50px',
        textAlign: 'left',
      }}
    >
      <Item>
        <Box>
          <Box>
            <Box id="introduce__header" style={{ marginBottom: '15px' }}>
              <Grid container alignItems="center">
                <Grid item md={3} textAlign={'right'}>
                  <img
                    src="/img/risu.webp"
                    style={{ width: '80px' }}
                    alt="ブログ管理人アイコン"
                  />
                </Grid>
                <Grid item md={9} textAlign={'left'} pl={'10px'}>
                  <span>Written by</span>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', color: 'black' }}
                  >
                    りっすん
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box id="introduce__content">
              3年目のWeb開発エンジニアリス🐿️
              <br />
              フロント・バックエンド開発を行っています。
              <br />
              様々な技術をほっぺに蓄え、時には発信していきます。
            </Box>
          </Box>
        </Box>
      </Item>
      {popularArticles.length > 0 ? (
        <Item sx={{ mt: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 'bold', color: 'black' }}
          >
            人気記事ランキング
          </Typography>
          <PopularArticles articles={popularArticles} />
        </Item>
      ) : null}
      <Box
        sx={{
          position: 'sticky',
          top: '16px',
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          // 画面より高いときは、この中だけをスクロールできるようにする
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
        }}
      >
        <Item id="rightSideBar__mokuji">
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 'bold', color: 'black' }}
          >
            目次
          </Typography>
          <VerticalStepper headings={headings} />
        </Item>
        <Item>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 'bold', color: 'black' }}
          >
            関連記事
          </Typography>
          <RelativeArticleStack articles={relativeArticles} />
        </Item>
      </Box>
    </Box>
  );
}
