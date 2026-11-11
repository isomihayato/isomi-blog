import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Markdown from 'react-markdown';
import { Alert, Menu, MenuItem } from '@mui/material';
import CommentCard from './CommentCard';
import { deleteComment } from '../axios/axiosComment';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { CommentType } from '../types/CommentTypes';
import PersonIcon from '@mui/icons-material/Person';
import { formatJstDateTime } from '../common/formatJstDateTime';
import { useMyMemberId } from '../common/useMyMemberId';

type Props = {
  articleId: number;
  comment: CommentType;
  setAction: React.Dispatch<React.SetStateAction<string>>;
};
export default function CommentsCard(props: Props) {
  const { articleId, comment, setAction } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [edit, setEdit] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState(''); // 削除に失敗したときのメッセージ
  // 編集・削除のメニューは、自分のコメントにだけ出す(サーバー側でも本人以外は 403 にしている)
  const myMemberId = useMyMemberId();
  const isMine = myMemberId !== null && comment.member_id === myMemberId;

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
    <>
      {edit ? (
        <CommentCard
          articleId={articleId}
          setAction={setAction}
          editTime={true}
          setEdit={setEdit}
          defaultComment={comment}
        />
      ) : (
        <Card sx={{ width: '100%', marginBottom: '20px' }}>
          <CardHeader
            avatar={
              // プロフィール画像がない会員は、空の丸ではなく人のアイコンを出す
              <Avatar
                alt="メンバー画像"
                src={comment.member.photo_url || undefined}
              >
                <PersonIcon />
              </Avatar>
            }
            title={comment.member.name}
            // 投稿日時は日本時間で分まで
            subheader={formatJstDateTime(comment.created_at)}
            action={
              isMine ? (
                <IconButton
                  aria-label="コメントの操作"
                  onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              ) : null
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
    </>
  );
}
