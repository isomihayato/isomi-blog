import React, { useState, useEffect, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import VerticalStepper from '../navigations/VerticalSteper';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: '25px 16px',
  color: theme.palette.text.secondary,
}));
type Props = {
  chapters: string[];
};
export default function RightSideBar(props: Props) {
  const { chapters } = props;
  const [isSticky, setIsSticky] = useState(false);
  const elementRef = useRef(null);
  const stickyThreshold = 456; // positionをstaticに戻すY軸の値

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
    console.log(chapters);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <>
      <Stack
        spacing={2}
        style={{ marginTop: '75px', width: '321px' }}
        textAlign={'left'}
      >
        <Item>
          <Box>
            <Box>
              <Box id="introduce__header" style={{ marginBottom: '15px' }}>
                <Grid container alignItems="center">
                  <Grid item md={2.2} textAlign={'right'}>
                    <Avatar
                      alt="磯海 隼人"
                      src="/static/images/avatar/1.jpg"
                      sx={{ float: 'right', width: '60px', height: '60px' }}
                    />
                  </Grid>
                  <Grid item md={9.8} textAlign={'left'}>
                    <span>Written by</span>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      磯海隼人（いそみ はやと）
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
          ref={elementRef}
          style={{
            position: isSticky ? 'fixed' : 'static',
            top: isSticky ? 0 : 'auto',
            width: '321px',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            目次
          </Typography>
          <VerticalStepper chapters={chapters} />
        </Item>
      </Stack>
    </>
  );
}
