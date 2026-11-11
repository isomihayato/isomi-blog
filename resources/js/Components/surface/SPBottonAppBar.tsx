import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import Paper from '@mui/material/Paper';
import { ArticleType } from '../types/ArticleTypes';

// 固定バーの高さ(BottomNavigation の 56px + iPhone などのホームバー部分)
const BAR_SPACE = 'calc(56px + env(safe-area-inset-bottom, 0px))';

type Props = {
  article: ArticleType;
  favorites: number | undefined;
  user: { uid: string };
  onFavorite: () => void;
};
export default function SPBottonAppBar(props: Props) {
  const [value, setValue] = React.useState(0);
  const [show, setShow] = React.useState(true);
  const { article, favorites, onFavorite } = props;
  const goods = favorites ? favorites : '';
  const handleScroll = () => {
    const element = document.getElementById('footer');
    const main = document.getElementById('main');
    const comment = document.getElementById('comment');
    if (element) {
      const targetY = main.clientHeight - comment.clientHeight + 300;
      if (window.scrollY >= targetY) {
        setShow(false);
      }
      if (window.scrollY < targetY) {
        setShow(true);
      }
    }
  };
  // バーを表示している間は、ページの下にバーの高さ分の余白を入れて、本文やフォームの最後が隠れないようにする
  React.useEffect(() => {
    if (!show) return;
    const previous = document.body.style.paddingBottom;
    document.body.style.paddingBottom = BAR_SPACE;
    return () => {
      document.body.style.paddingBottom = previous;
    };
  }, [show]);
  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const handleChange = (event, newValue) => {
    if (newValue === 'favorite') {
      onFavorite();
    } else if (newValue === 1) {
      window.location.href = encodeURI(
        `https://twitter.com/intent/tweet?url=https://info-space-box.net/articles/details/${article.id}&text=${article.title} | りっすん&hashtags=infobox`,
      );
    } else if (newValue === 2) {
      window.location.href = `http://www.facebook.com/sharer.php?u=https://info-space-box.net/articles/details/${article.id}`;
    }
    setValue(newValue);
  };

  return (
    <>
      {show ? (
        <Box>
          <Paper
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1,
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
            elevation={3}
          >
            <BottomNavigation showLabels value={value} onChange={handleChange}>
              <BottomNavigationAction
                label={`${goods} いいね！`}
                icon={<FavoriteIcon id="favorite" />}
                value={'favorite'}
              />
              <BottomNavigationAction label="に投稿" icon={<XIcon />} />
              <BottomNavigationAction label="に投稿" icon={<FacebookIcon />} />
            </BottomNavigation>
          </Paper>
        </Box>
      ) : null}
    </>
  );
}
