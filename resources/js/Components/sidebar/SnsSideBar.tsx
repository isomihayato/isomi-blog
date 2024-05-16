import { Avatar, Stack, styled } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';
import { isMobile } from 'react-device-detect';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // お気に入り登録前アイコン
import FavoriteIcon from '@mui/icons-material/Favorite'; // お気に入り登録後アイコン
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import { deleteFavorite, postFavorite } from '../axios/axiosFavorite';
import { getStorage } from '../common/functions';
import { ArticleType } from '../types/ArticleTypes';
import { FavoriteType } from '../types/FavoriteType';
import SPBottonAppBar from '../surface/SPBottonAppBar';
import PocketLink from '../sns/PocketLink';
import { HatenaIcon, HatenaShareButton, HatenaShareCount } from 'react-share';

type Props = {
  article: ArticleType;
  favorites: number | undefined;
  loginedMemberFavorite: FavoriteType;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAction: React.Dispatch<React.SetStateAction<string>>;
};
export default React.memo(function SnsSideBar(props: Props) {
  const { article, favorites, loginedMemberFavorite, setOpen, setAction } =
    props;
  const user = getStorage('user');
  const Item = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff0',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
  }));
  const favoriteClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!user) {
      setOpen(true);
      return;
    }
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
  };

  const loginedMemberFavoriteClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!user) {
      setOpen(true);
      return;
    }
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
  };

  return (
    <>
      {isMobile ? (
        <SPBottonAppBar
          article={article}
          favorites={favorites}
          loginedMemberFavorite={loginedMemberFavorite}
          user={user}
          setAction={setAction}
        />
      ) : (
        <Stack
          spacing={2}
          padding={'10px 30px'}
          justifyContent="flex-end"
          alignItems="center"
          style={isMobile ? {} : { marginTop: '0px', marginRight: '0px' }}
        >
          <Item>
            <div
              style={{
                color: '#9a9a9a',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {favorites}
            </div>
            {loginedMemberFavorite ? (
              <Avatar
                onClick={loginedMemberFavoriteClick}
                style={{ float: 'right' }}
              >
                <FavoriteIcon />
              </Avatar>
            ) : (
              <Avatar onClick={favoriteClick} style={{ float: 'right' }}>
                <FavoriteBorderIcon />
              </Avatar>
            )}
          </Item>
          <Item>
            <Avatar
              onClick={() =>
                (window.location.href =
                  encodeURI(`https://twitter.com/intent/tweet?url=https://mie-fishing.info/articles/details/${article.id}&text=${article.title} | コモ&トモ&hashtags=infobox
  `))
              }
            >
              <XIcon />
            </Avatar>
          </Item>
          <Item>
            <Avatar
              onClick={() =>
                (window.location.href = `http://www.facebook.com/sharer.php?u=https://mie-fishing.info/articles/details/${article.id}`)
              }
            >
              <FacebookIcon />
            </Avatar>
          </Item>
          <Item>
            <HatenaShareButton
              url={window.location.href}
              title={article.title}
              windowWidth={660}
              windowHeight={460}
              className="Demo__some-network__share-button"
            >
              <HatenaIcon size={32} />
            </HatenaShareButton>
            <div style={{ textAlign: 'center' }}>
              <HatenaShareCount
                url={window.location.href}
                className="Demo__some-network__share-count"
              />
            </div>
          </Item>
          <Item>
            <PocketLink url={window.location.href} title={article.title} />
          </Item>
        </Stack>
      )}
    </>
  );
});
