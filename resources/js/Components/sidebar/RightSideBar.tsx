import React, { useState, useEffect, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import VerticalStepper from '../navigations/VerticalSteper';
import { ArticleType } from '../types/ArticleTypes';
import RelativeArticleStack from '../layout/RelativeArticleStack';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: '25px 16px',
  color: theme.palette.text.secondary,
}));
type Props = {
  chapters: string[];
  relativeArticles: ArticleType[];
};
export default function RightSideBar(props: Props) {
  const { chapters, relativeArticles } = props;
  const [isSticky, setIsSticky] = useState(false);
  const elementRef = useRef(null);
  const stickyThreshold = 456; // positionをstaticに戻すY軸の値
  const rightSideWidth = '300px';

  const handleScroll = () => {
    const scrolled = window.scrollY;
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
                      src="/img/manager_logo.webp"
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
                      コモ&トモ
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box id="introduce__content">
                開発エンジニア（Webエンジニア）
                <br />
                3年目のエンジニアです。フロント・バックエンド開発を行っています。
                現場で学んだことを深掘りしたり、新しい技術を学んだりしたことをアウトプットしていきます。
              </Box>
            </Box>
          </Box>
        </Item>
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
