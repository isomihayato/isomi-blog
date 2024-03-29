import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import { getStorage } from '../common/functions';
import Button from '@mui/material/Button';
import { TextareaAutosize } from '@mui/material';
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
};
export default function CommentCard(props: Props) {
  const { articleId, setAction, editTime, setEdit, defaultComment } = props;
  const [preview, setPreview] = React.useState(false);
  const [comment, setComment] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const t_user = getStorage('user');
  const logged = t_user === null || t_user === undefined ? false : true;
  const photoURL = getStorage('photoUrl');
  React.useEffect(() => {
    if (editTime) {
      setComment(defaultComment.body);
    }
  }, [editTime, defaultComment]);
  const submitHndlr = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editTime) {
      const data = { body: comment, id: defaultComment.id };
      console.log(data);
      postUpdateComment(data, (res: { data: string }) => {
        console.log(res.data);
        setEdit(false);
        setAction(`comment update${res.data}`);
      });
    } else {
      const user = getStorage('user');
      const data = { body: comment, fb_uid: user.uid, article_id: articleId };
      console.log(data);
      postComment(data, (res: { data: string }) => {
        console.log(res.data);
        setComment('');
        setAction(`comment create${res.data}`);
      });
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
        {preview ? (
          <pre className="markdown-preview">
            <Markdown rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}>
              {comment == '' ? defaultComment?.body + comment : comment}
            </Markdown>
          </pre>
        ) : (
          <TextareaAutosize
            name="comment_body"
            minRows={10}
            style={{ width: '100%' }}
            placeholder="コメントを入力"
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
        <Button type="submit" variant="contained" disabled={!logged}>
          投稿する
        </Button>
      </CardActions>
    </Card>
  );
}

CommentCard.defaultProps = {
  editTime: false,
};
