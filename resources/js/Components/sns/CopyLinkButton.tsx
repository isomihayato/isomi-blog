import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';

type Props = {
  url: string;
  /** アイコンの大きさ(px) */
  size?: number;
};

/**
 * 記事のURLをクリップボードにコピーするボタン(Pocket は 2025年7月にサービスを終了したため、その代わり)
 */
export default function CopyLinkButton(props: Props) {
  const { url, size = 40 } = props;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // クリップボードを使えない環境(http など)では、選択してコピーしてもらう
      window.prompt('このURLをコピーしてください', url);
    }
  };

  return (
    <Tooltip title={copied ? 'コピーしました' : 'リンクをコピー'} arrow>
      <IconButton
        aria-label="記事のリンクをコピーする"
        onClick={copy}
        sx={{
          width: size,
          height: size,
          bgcolor: '#757575',
          color: '#fff',
          '&:hover, &:focus-visible': { bgcolor: '#424242' },
        }}
      >
        <LinkIcon />
      </IconButton>
    </Tooltip>
  );
}
