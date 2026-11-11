import React from 'react';
import { Stack } from '@mui/material';
import {
  FacebookIcon,
  FacebookShareButton,
  HatenaIcon,
  HatenaShareButton,
  LineIcon,
  LineShareButton,
  TwitterShareButton,
  XIcon,
} from 'react-share';
import CopyLinkButton from './CopyLinkButton';

type Props = {
  url: string;
  title: string;
};

const ICON_SIZE = 40;

/**
 * 記事の共有ボタン(X・はてなブックマーク・LINE・Facebook・リンクのコピー)。アイコンは同じ大きさ・丸型にそろえる
 */
export default function ShareButtons(props: Props) {
  const { url, title } = props;

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="center"
      flexWrap="wrap"
      useFlexGap
      sx={{
        // react-share のボタンもキーボードで選んだときに分かるようにする
        '& .react-share__ShareButton:focus-visible': {
          outline: '2px solid #1976d2',
          outlineOffset: '2px',
          borderRadius: '50%',
        },
      }}
    >
      <TwitterShareButton
        url={url}
        title={title}
        aria-label="X(Twitter)で共有する"
      >
        <XIcon size={ICON_SIZE} round />
      </TwitterShareButton>
      <HatenaShareButton
        url={url}
        title={title}
        windowWidth={660}
        windowHeight={460}
        aria-label="はてなブックマークに追加する"
      >
        <HatenaIcon size={ICON_SIZE} round />
      </HatenaShareButton>
      <LineShareButton url={url} title={title} aria-label="LINEで送る">
        <LineIcon size={ICON_SIZE} round />
      </LineShareButton>
      <FacebookShareButton url={url} aria-label="Facebookで共有する">
        <FacebookIcon size={ICON_SIZE} round />
      </FacebookShareButton>
      <CopyLinkButton url={url} size={ICON_SIZE} />
    </Stack>
  );
}
