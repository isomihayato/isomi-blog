import { Avatar, IconButton, Skeleton, Stack, styled } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';
import { isMobile } from 'react-device-detect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import { getStorage } from '../common/functions';
import { ArticleType } from '../types/ArticleTypes';
import SPBottonAppBar from '../surface/SPBottonAppBar';
import PocketLink from '../sns/PocketLink';
import { HatenaIcon, HatenaShareButton, HatenaShareCount } from 'react-share';

/** SNSボタン:マウスを乗せたとき・キーボードで選んだときに分かるようにする */
const snsButtonSx = {
  '& .MuiAvatar-root': { transition: 'background-color .2s' },
  '&:hover .MuiAvatar-root, &:focus-visible .MuiAvatar-root': {
    bgcolor: 'primary.main',
  },
  '&:focus-visible': { outline: '2px solid', outlineOffset: '2px' },
};

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
  const articleUrl = `https://info-space-box.net/articles/details/${article.id}`;
  const xShareUrl =
    'https://twitter.com/intent/tweet?' +
    new URLSearchParams({
      url: articleUrl,
      text: `${article.title} | りっすん`,
      hashtags: 'infobox',
    }).toString();
  const facebookShareUrl =
    'https://www.facebook.com/sharer.php?' +
    new URLSearchParams({ u: articleUrl }).toString();
  const favoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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
                color: '#555', // ページ背景 #dddddd の上で 5.49:1
                fontWeight: 'bold',
                textAlign: 'center',
                // 数が読み込まれても、桁が変わっても、周りがずれないように幅と高さを固定する
                width: '40px',
                height: '24px',
                lineHeight: '24px',
                margin: '0 auto',
              }}
            >
              {favorites === undefined ? (
                <Skeleton variant="text" width={24} sx={{ mx: 'auto' }} />
              ) : (
                favorites
              )}
            </div>
            {/* 操作(いいね)はボタンにする。Tab キーで選べて、押せると分かる */}
            <IconButton
              aria-label="この記事にいいねする"
              onClick={favoriteClick}
              sx={{ p: 0, float: 'right', ...snsButtonSx }}
            >
              <Avatar>
                <FavoriteIcon id="favorite" />
              </Avatar>
            </IconButton>
          </Item>
          <Item>
            {/* 共有はリンクにする(新しいタブで開く) */}
            <IconButton
              component="a"
              href={xShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X(Twitter)で共有する"
              sx={{ p: 0, ...snsButtonSx }}
            >
              <Avatar>
                <XIcon />
              </Avatar>
            </IconButton>
          </Item>
          <Item>
            <IconButton
              component="a"
              href={facebookShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebookで共有する"
              sx={{ p: 0, ...snsButtonSx }}
            >
              <Avatar>
                <FacebookIcon />
              </Avatar>
            </IconButton>
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
