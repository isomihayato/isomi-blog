import React from 'react';
import { Alert, Button } from '@mui/material';
import { usePage } from '@inertiajs/react';

type Props = {
  article: {
    id: number;
    visible: boolean | number;
    published_at: string | null;
  };
};

// 管理者がログイン中に、非公開・公開前の記事を開いたときに「プレビュー中」と知らせる
export default function PreviewNotice(props: Props) {
  const { article } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { auth } = usePage().props as any;
  if (!auth?.user) return null;

  // published_at はサーバー(日本時間)の "YYYY-MM-DD HH:MM:SS"
  const publishedAt = article.published_at
    ? new Date(article.published_at.replace(' ', 'T'))
    : null;
  const reasons: string[] = [];
  if (!article.visible) reasons.push('非公開(表示がオフ)');
  if (!publishedAt || publishedAt.getTime() > Date.now()) {
    reasons.push(
      publishedAt
        ? `公開前(${article.published_at?.slice(0, 16)} に公開)`
        : '公開日時が未設定',
    );
  }
  if (reasons.length === 0) return null;

  return (
    <Alert
      severity="warning"
      sx={{ margin: '0 15px 10px' }}
      action={
        <Button
          color="inherit"
          size="small"
          href={`/articles/${article.id}/edit`}
        >
          編集に戻る
        </Button>
      }
    >
      プレビュー中です。この記事は{reasons.join('・')}
      のため、ログインしていない人には表示されません。
    </Alert>
  );
}
