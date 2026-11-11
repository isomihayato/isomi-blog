import React, { useState } from 'react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import imageCompression from 'browser-image-compression';
import { postArticleImg } from '@/Components/axios/axiosArticle';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

type Props = {
  /** 保存済みのアイキャッチ画像のパス(編集時) */
  defaultValue?: string | null;
};

/**
 * 記事のアイキャッチ画像(記事一覧のサムネイル・SNSでシェアされたときの画像)の入力欄。
 * 画像は本文の画像と同じ uploadImg で保存し、フォームの eyecatch_path にパス(/storage/upload/...)を入れる。
 */
export default function EyecatchInput(props: Props) {
  const { defaultValue } = props;
  const [path, setPath] = useState(defaultValue ?? '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // 同じファイルを選び直しても反応するようにする
    if (!file) return;

    setError('');
    setUploading(true);
    try {
      // SNS の推奨サイズ(1200×630px)より大きい画像は縮小してから送る
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });
      postArticleImg(
        { file: compressedFile },
        (res) => {
          // 返ってくるのは絶対URLのため、ドメインに依存しないパスだけを保存する
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setPath(new URL(res.data.url, window.location.origin).pathname);
          setUploading(false);
        },
        () => {
          setError('画像をアップロードできませんでした。');
          setUploading(false);
        },
      );
    } catch (e) {
      console.error(e);
      setError('画像を読み込めませんでした。');
      setUploading(false);
    }
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="subtitle2">アイキャッチ画像</Typography>
      <Typography variant="caption" color="text.secondary">
        記事一覧のサムネイルと、SNSでシェアされたときの画像に使います(推奨:1200×630px)。
        設定しない場合は共通の画像になります。
      </Typography>
      <input type="hidden" name="eyecatch_path" value={path} />
      {path ? (
        <Box sx={{ mt: 1 }}>
          <img
            src={path}
            alt="アイキャッチ画像のプレビュー"
            style={{
              maxWidth: '320px',
              maxHeight: '180px',
              objectFit: 'cover',
            }}
          />
        </Box>
      ) : null}
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          disabled={uploading}
        >
          {uploading ? 'アップロード中…' : path ? '画像を変更' : '画像を選ぶ'}
          <VisuallyHiddenInput
            type="file"
            accept="image/*"
            onChange={handleUpload}
          />
        </Button>
        {path ? (
          <Button color="error" onClick={() => setPath('')}>
            画像を外す
          </Button>
        ) : null}
      </Stack>
      {error ? (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      ) : null}
    </Box>
  );
}
