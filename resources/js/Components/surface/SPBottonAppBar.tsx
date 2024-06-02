import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import Paper from '@mui/material/Paper';
import { postFavorite } from '../axios/axiosFavorite';
import { ArticleType } from '../types/ArticleTypes';

type Props = {
  article: ArticleType;
  favorites: number | undefined;
  user: { uid: string };
  setAction: React.Dispatch<React.SetStateAction<string>>;
};
export default function SPBottonAppBar(props: Props) {
  const [value, setValue] = React.useState(0);
  const [show, setShow] = React.useState(true);
  const { article, favorites, setAction } = props;
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
  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const handleChange = (event, newValue) => {
    if (newValue === 'favorite') {
      postFavorite(
        { article_id: article.id },
        (res) => {
          console.log(res.data);
          document.getElementById('favorite').classList.add('jump-animation');
          setTimeout(() => {
            setAction(`favorites-${Math.random().toString(32).substring(2)}`);
          }, 900);
        },
        (err) => {
          console.log(err);
        },
      );
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
            sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1 }}
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
