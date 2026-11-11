import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import { getStorage } from '../common/functions';
import Button from '@mui/material/Button';
import { Alert, TextareaAutosize } from '@mui/material';
import Markdown from 'react-markdown';
import postComment, { postUpdateComment } from '../axios/axiosComment';
import { CommentType } from '../types/CommentTypes';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';

type Props = {
  articleId: number;
  setAction: React.Dispatch<React.SetStateAction<string>>;
  editTime?: boolean;
  setEdit?: React.Dispatch<React.SetStateAction<boolean>>;
  defaultComment?: CommentType;
  onLoginClick?: () => void; // 未ログイン時の「ログインしてコメントする」ボタンを押したとき
};
export default function CommentCard(props: Props) {
  const {
    articleId,
    setAction,
    editTime,
    setEdit,
    defaultComment,
    onLoginClick,
  } = props;
  const [preview, setPreview] = React.useState(false);
  const [comment, setComment] = React.useState('');
  const [postError, setPostError] = React.useState(''); // 投稿に失敗したときのメッセージ
  const t_user = getStorage('user');
  const logged = t_user === null || t_user === undefined ? false : true;
  const photoURL = getStorage('photoUrl');
  React.useEffect(() => {
    if (editTime) {
      setComment(defaultComment.body);
    }
  }, [editTime, defaultComment]);
  // 失敗時は入力内容を残し、サーバーからのメッセージを表示する
  const showError = (err: { response?: { data?: { message?: string } } }) => {
    setPostError(
      err.response?.data?.message ??
        'コメントを送信できませんでした。時間をおいて、もう一度お試しください。',
    );
  };
  // 空白だけのコメントは送らない(サーバー側でも必須にしている)
  const isEmpty = comment.trim() === '';
  const submitHndlr = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEmpty) return;
    setPostError('');
    if (editTime) {
      const data = { body: comment, id: defaultComment.id };

      postUpdateComment(
        data,
        (res: { data: string }) => {
          setEdit(false);
          setAction(`comment update${res.data}`);
        },
        showError,
      );
    } else {
      // 投稿者はサーバーが IDトークンから特定するため、会員の識別子は送らない
      const data = { body: comment, article_id: articleId };

      postComment(
        data,
        (res: { data: string }) => {
          setComment('');
          setAction(`comment create${res.data}`);
        },
        showError,
      );
    }
  };

  return (
    <Card sx={{ width: '100%' }} component={'form'} onSubmit={submitHndlr}>
      <CardHeader
        avatar={<Avatar alt="メンバー画像" src={photoURL} />}
        action={
          <>
            <Button
              variant="contained"
              onClick={() => setPreview(!preview)}
              disabled={!logged}
            >
              プレビュー
            </Button>
          </>
        }
      />

      <CardContent>
        {postError ? (
          <Alert severity="error" sx={{ mb: 1 }}>
            {postError}
          </Alert>
        ) : null}
        {preview ? (
          <pre className="markdown-preview">
            <Markdown rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}>
              {isEmpty ? '*プレビューする内容がありません*' : comment}
            </Markdown>
          </pre>
        ) : (
          <TextareaAutosize
            name="comment_body"
            minRows={10}
            style={{ width: '100%' }}
            placeholder={
              logged ? 'コメントを入力' : 'コメントするにはログインしてください'
            }
            disabled={!logged}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        )}
      </CardContent>
      <CardActions disableSpacing sx={{ float: 'right' }}>
        {editTime ? (
          <Button
            variant="outlined"
            onClick={() => setEdit(false)}
            style={{ marginRight: '15px' }}
          >
            キャンセル
          </Button>
        ) : null}
        {logged ? (
          <Button type="submit" variant="contained" disabled={isEmpty}>
            投稿する
          </Button>
        ) : (
          <Button variant="contained" onClick={onLoginClick}>
            ログインしてコメントする
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

CommentCard.defaultProps = {
  editTime: false,
};
