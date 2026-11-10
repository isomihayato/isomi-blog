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
import { Menu, MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CommentType } from '../types/CommentTypes';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';

type Props = {
  articleId: number;
  setAction: React.Dispatch<React.SetStateAction<string>>;
  editTime?: boolean;
  setEdit?: React.Dispatch<React.SetStateAction<boolean>>;
  defaultComment?: CommentType;
  parentId?: number; // 返信するときの返信先コメントID
  onCancel?: () => void; // 返信フォームを閉じる
};
export default function CommentCard(props: Props) {
  const {
    articleId,
    setAction,
    editTime,
    setEdit,
    defaultComment,
    parentId,
    onCancel,
  } = props;
  const [preview, setPreview] = React.useState(false);
  const [comment, setComment] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
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
  const submitHndlr = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      const data = parentId
        ? { body: comment, article_id: articleId, parent_id: parentId }
        : { body: comment, article_id: articleId };

      postComment(
        data,
        (res: { data: string }) => {
          setComment('');
          setAction(`comment create${res.data}`);
          onCancel?.();
        },
        showError,
      );
    }
  };
  const editHndlr = () => {
    setAnchorEl(null);
    setEdit(false);
  };
  const closeHndlr = () => {
    setAnchorEl(null);
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
            {editTime ? (
              <IconButton
                aria-label="settings"
                onClick={(e) => {
                  setAnchorEl(e.currentTarget);
                }}
              >
                <MoreVertIcon />
              </IconButton>
            ) : null}
          </>
        }
      />
      {editTime ? (
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeHndlr}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={editHndlr}>編集</MenuItem>
          <MenuItem onClick={closeHndlr}>削除</MenuItem>
        </Menu>
      ) : null}

      <CardContent>
        {postError ? (
          <Alert severity="error" sx={{ mb: 1 }}>
            {postError}
          </Alert>
        ) : null}
        {preview ? (
          <pre className="markdown-preview">
            <Markdown rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}>
              {comment == '' ? defaultComment?.body + comment : comment}
            </Markdown>
          </pre>
        ) : (
          <TextareaAutosize
            name="comment_body"
            minRows={parentId ? 4 : 10}
            style={{ width: '100%' }}
            placeholder={parentId ? '返信を入力' : 'コメントを入力'}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        )}
      </CardContent>
      <CardActions disableSpacing sx={{ float: 'right' }}>
        {editTime || onCancel ? (
          <Button
            variant="outlined"
            onClick={() => (editTime ? setEdit(false) : onCancel?.())}
            style={{ marginRight: '15px' }}
          >
            キャンセル
          </Button>
        ) : null}
        <Button type="submit" variant="contained" disabled={!logged}>
          {parentId ? '返信する' : '投稿する'}
        </Button>
      </CardActions>
    </Card>
  );
}

CommentCard.defaultProps = {
  editTime: false,
};
