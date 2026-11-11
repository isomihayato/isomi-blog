import { Box, Grid, Paper, Skeleton, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { loadScriptOnce } from '../common/loadScript';
import FacebookShareButton from '../sns/FacebookShareButton';
import PocketLinkVertical from '../sns/PocketLinkVertical';
import { Suspense } from 'react';

type Props = {
  element: JSX.Element;
  paper?: boolean;
};
export default function Front(props: Props) {
  const { element } = props;
  const { paper } = props;
  const snsNavShow = window.location.href.includes('/articles/details/')
    ? true
    : false;
  useEffect(() => {
    // X・はてなブックマークのボタンを出すページだけ、スクリプトを後から読み込む
    if (!snsNavShow) return;
    loadScriptOnce('https://platform.twitter.com/widgets.js');
    loadScriptOnce('https://b.st-hatena.com/js/bookmark_button.js');
  }, [snsNavShow]);
  return (
    <>
      <Box
        id="main"
        // 本文は最大 800px で中央寄せ(大きな画面で1行が長くなりすぎないようにする)
        sx={{
          width: { xs: 'calc(100% - 32px)', md: 'calc(100% - 64px)' },
          maxWidth: '800px',
          mx: 'auto',
          mt: { xs: '25px', md: '50px' },
          mb: { md: '50px' },
          minHeight: '65vh',
        }}
        component={paper ? Paper : 'div'}
      >
        <Suspense fallback={<Skeleton variant="rounded" height={400} />}>
          <Box sx={{ padding: { xs: '10px 15px', md: '32px 56px' } }}>
            {element}
          </Box>{' '}
        </Suspense>
        {snsNavShow && (
          <>
            <Typography
              variant="h6"
              align="center"
              sx={{ mt: 2 }}
              style={{
                fontSize: '1.2rem',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                fontWeight: 'bold',
                padding: '10px',
                marginBottom: '20px',
              }}
            >
              励みになります！
            </Typography>
            <Box
              sx={{ width: '340px', margin: '0 auto', paddingBottom: '20px' }}
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
    </>
  );
}
Front.defaultProps = {
  paper: true,
};
