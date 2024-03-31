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
  const { article, favorites, loginedMemberFavorite, user, setAction } = props;
  const goods = favorites ? favorites : '';
  const handleChange = (event, newValue) => {
    console.log('newValue', newValue);

    if (newValue === 'favorite') {
      postFavorite(
        { member_uid: user.uid, article_id: article.id },
        (res) => {
          console.log(res);
          setAction('favorite');
        },
        (err) => {
          console.log(err);
        },
      );
    } else if (newValue === 'unfavorite') {
      console.log('unfavorite');
      deleteFavorite(
        loginedMemberFavorite.id,
        (res) => {
          console.log(res);
          setAction('unfavorite');
        },
        (err) => {
          console.log(err);
        },
      );
    } else if (newValue === 1) {
      window.location.href = encodeURI(
        `https://twitter.com/intent/tweet?url=https://info-space-box.net/articles/details/${article.id}&text=${article.title} | 磯海隼人&hashtags=infobox`,
      );
    } else if (newValue === 2) {
      window.location.href = `http://www.facebook.com/sharer.php?u=https://info-space-box.net/articles/details/${article.id}`;
    }
    setValue(newValue);
  };

  return (
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
  );
}
