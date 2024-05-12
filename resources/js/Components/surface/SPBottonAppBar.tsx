import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // お気に入り登録前アイコン
import FavoriteIcon from '@mui/icons-material/Favorite'; // お気に入り登録後アイコン
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import Paper from '@mui/material/Paper';
import { deleteFavorite, postFavorite } from '../axios/axiosFavorite';
import { FavoriteType } from '../types/FavoriteType';
import { ArticleType } from '../types/ArticleTypes';

type Props = {
  article: ArticleType;
  favorites: number | undefined;
  loginedMemberFavorite: FavoriteType;
  user: { uid: string };
  setAction: React.Dispatch<React.SetStateAction<string>>;
};
export default function SPBottonAppBar(props: Props) {
  const [value, setValue] = React.useState(0);
  const [show, setShow] = React.useState(true);
  const { article, favorites, loginedMemberFavorite, user, setAction } = props;
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
        { member_uid: user.uid, article_id: article.id },
        (res) => {
          console.log(res.data);

          setAction('favorite');
        },
        (err) => {
          console.log(err);
        },
      );
    } else if (newValue === 'unfavorite') {
      deleteFavorite(
        loginedMemberFavorite.id,
        (res) => {
          console.log(res.data);
          setAction('unfavorite');
        },
        (err) => {
          console.log(err);
        },
      );
    } else if (newValue === 1) {
      window.location.href = encodeURI(
        `https://twitter.com/intent/tweet?url=https://mie-fishing.info/articles/details/${article.id}&text=${article.title} | コモ&トモ&hashtags=infobox`,
      );
    } else if (newValue === 2) {
      window.location.href = `http://www.facebook.com/sharer.php?u=https://mie-fishing.info/articles/details/${article.id}`;
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
              {loginedMemberFavorite ? (
                <BottomNavigationAction
                  label={`${goods} いいね！`}
                  icon={<FavoriteIcon />}
                  value={'unfavorite'}
                />
              ) : (
                <BottomNavigationAction
                  label={`${goods} いいね！`}
                  icon={<FavoriteBorderIcon />}
                  value={'favorite'}
                />
              )}
              <BottomNavigationAction label="に投稿" icon={<XIcon />} />
              <BottomNavigationAction label="に投稿" icon={<FacebookIcon />} />
            </BottomNavigation>
          </Paper>
        </Box>
      ) : null}
    </>
  );
}
