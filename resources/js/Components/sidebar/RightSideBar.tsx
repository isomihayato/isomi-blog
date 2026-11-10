import React, { useState, useEffect, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import VerticalStepper from '../navigations/VerticalSteper';
import { ArticleType } from '../types/ArticleTypes';
import RelativeArticleStack from '../layout/RelativeArticleStack';
import PopularArticles, { PopularArticleType } from '../layout/PopularArticles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: '25px 16px',
  color: theme.palette.text.secondary,
}));
type Props = {
  chapters: string[];
  relativeArticles: ArticleType[];
  popularArticles?: PopularArticleType[];
};
export default function RightSideBar(props: Props) {
  const { chapters, relativeArticles, popularArticles = [] } = props;
  const [isSticky, setIsSticky] = useState(false);
  const elementRef = useRef(null);
  // 目次を画面上部に固定し始めるスクロール位置。目次より上(プロフィール・人気記事)の高さで変わるので、
  // 固定していない間に目次の位置から計算する
  const stickyThresholdRef = useRef(456);
  const rightSideWidth = '300px';

  const handleScroll = () => {
    const scrolled = window.scrollY;
    const mokuji = elementRef.current as HTMLElement | null;
    if (mokuji && mokuji.style.position !== 'fixed') {
      stickyThresholdRef.current =
        mokuji.getBoundingClientRect().top + scrolled;
    }
    const stickyThreshold = stickyThresholdRef.current;
    const main = document.getElementById('main');
    if (main.clientHeight <= scrolled) {
      setIsSticky(false);
    } else if (scrolled >= stickyThreshold) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <>
      <Stack
        spacing={2}
        style={{ marginTop: '50px', width: rightSideWidth }}
        textAlign={'left'}
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
          <Item>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 'bold', color: 'black' }}
            >
              人気記事ランキング
            </Typography>
            <PopularArticles articles={popularArticles} />
          </Item>
        ) : null}
        <Item
          id="rightSideBar__mokuji"
          ref={elementRef}
          style={{
            position: isSticky ? 'fixed' : 'static',
            top: isSticky ? 0 : 'auto',
            width: rightSideWidth,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 'bold', color: 'black' }}
          >
            目次
          </Typography>
          <VerticalStepper chapters={chapters} />
        </Item>
        <Item
          style={{
            position: isSticky ? 'fixed' : 'static',
            width: rightSideWidth,
            top: isSticky
              ? document.getElementById('rightSideBar__mokuji').clientHeight +
                15
              : 'auto',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 'bold', color: 'black' }}
          >
            関連記事
            <RelativeArticleStack articles={relativeArticles} />
          </Typography>
        </Item>
      </Stack>
    </>
  );
}
