import { Avatar, Stack, styled } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';
import { isMobile } from 'react-device-detect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import { getStorage } from '../common/functions';
import { ArticleType } from '../types/ArticleTypes';
import SPBottonAppBar from '../surface/SPBottonAppBar';
import CopyLinkButton from '../sns/CopyLinkButton';
import { HatenaIcon, HatenaShareButton, HatenaShareCount } from 'react-share';

type Props = {
  article: ArticleType;
  favorites: number | undefined;
  onFavorite: () => void;
};
export default React.memo(function SnsSideBar(props: Props) {
  const { article, favorites, onFavorite } = props;
  const user = getStorage('user');
  const Item = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff0',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
  }));
  const favoriteClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onFavorite();
  };

  return (
    <>
      {isMobile ? (
        <SPBottonAppBar
          article={article}
          favorites={favorites}
          user={user}
          onFavorite={onFavorite}
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
            <Avatar onClick={favoriteClick} style={{ float: 'right' }}>
              <FavoriteIcon id="favorite" />
            </Avatar>
          </Item>
          <Item>
            <Avatar
              onClick={() =>
                (window.location.href =
                  encodeURI(`https://twitter.com/intent/tweet?url=https://info-space-box.net/articles/details/${article.id}&text=${article.title} | りっすん&hashtags=infobox
  `))
              }
            >
              <XIcon />
            </Avatar>
          </Item>
          <Item>
            <Avatar
              onClick={() =>
                (window.location.href = `http://www.facebook.com/sharer.php?u=https://info-space-box.net/articles/details/${article.id}`)
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
              <HatenaIcon size={40} round />
            </HatenaShareButton>
            <div style={{ textAlign: 'center' }}>
              <HatenaShareCount
                url={window.location.href}
                className="Demo__some-network__share-count"
              />
            </div>
          </Item>
          <Item>
            {/* Pocket は 2025年7月にサービスを終了したため、リンクのコピーに置き換え */}
            <CopyLinkButton
              url={`https://info-space-box.net/articles/details/${article.id}`}
            />
          </Item>
        </Stack>
      )}
    </>
  );
});
