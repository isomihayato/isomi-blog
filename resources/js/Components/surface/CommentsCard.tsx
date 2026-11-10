import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Markdown from 'react-markdown';
import { Alert, Box, Button, Menu, MenuItem } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import { getStorage } from '../common/functions';
import CommentCard from './CommentCard';
import { deleteComment } from '../axios/axiosComment';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { CommentType } from '../types/CommentTypes';

type Props = {
  articleId: number;
  comment: CommentType;
  setAction: React.Dispatch<React.SetStateAction<string>>;
  replies?: CommentType[]; // このコメントへの返信(返信は1段階まで)
  isReply?: boolean; // このコメント自体が返信か
};
export default function CommentsCard(props: Props) {
  const {
    articleId,
    comment,
    setAction,
    replies = [],
    isReply = false,
  } = props;
  const [replying, setReplying] = React.useState(false); // 返信フォームを開いているか
  const logged = Boolean(getStorage('user'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [edit, setEdit] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState(''); // 削除に失敗したときのメッセージ

  const editHndlr = () => {
    setEdit(!edit);
    setAnchorEl(null);
  };
  const deleteHndlr = (commentId: number) => {
    setDeleteError('');
    deleteComment(
      commentId,
      () => {
        setAction(`comments delete${commentId}`);
        setAnchorEl(null);
      },
      (err: { response?: { data?: { message?: string } } }) => {
        setAnchorEl(null);
        setDeleteError(
          err.response?.data?.message ??
            'コメントを削除できませんでした。時間をおいて、もう一度お試しください。',
        );
      },
    );
  };
  const closeHndlr = () => {
    setAnchorEl(null);
  };
  return (
    <Box sx={isReply ? { ml: { xs: 3, sm: 6 } } : undefined}>
      {edit ? (
        <CommentCard
          articleId={articleId}
          setAction={setAction}
          editTime={true}
          setEdit={setEdit}
          defaultComment={comment}
        />
      ) : (
        <Card sx={{ width: '100%', marginBottom: '8px' }}>
          <CardHeader
            avatar={
              <Avatar alt="メンバー画像" src={comment.member.photo_url} />
            }
            title={comment.member.name}
            subheader={
              comment.created_at.slice(0, 10) +
              ' ' +
              comment.created_at.slice(11, 19)
            }
            action={
              <>
                <IconButton
                  aria-label="settings"
                  onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </>
            }
          />
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
            <MenuItem onClick={() => deleteHndlr(comment.id)}>削除</MenuItem>
          </Menu>
          <CardContent>
            {deleteError ? (
              <Alert severity="error" sx={{ mb: 1 }}>
                {deleteError}
              </Alert>
            ) : null}
            <pre className="markdown-preview">
              <Markdown rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}>
                {comment.body}
              </Markdown>
            </pre>
          </CardContent>
        </Card>
      )}
      {isReply ? null : (
        <Box sx={{ mb: '20px' }}>
          {replies.map((reply) => (
            <CommentsCard
              key={reply.id}
              articleId={articleId}
              comment={reply}
              setAction={setAction}
              isReply
            />
          ))}
          {logged && !replying ? (
            <Box sx={{ textAlign: 'right' }}>
              <Button
                size="small"
                startIcon={<ReplyIcon />}
                onClick={() => setReplying(true)}
              >
                返信する
              </Button>
            </Box>
          ) : null}
          {replying ? (
            <Box sx={{ ml: { xs: 3, sm: 6 } }}>
              <CommentCard
                articleId={articleId}
                setAction={setAction}
                parentId={comment.id}
                onCancel={() => setReplying(false)}
              />
            </Box>
          ) : null}
        </Box>
      )}
    </Box>
  );
}
