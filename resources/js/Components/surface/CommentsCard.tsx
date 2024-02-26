import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { Menu, MenuItem } from '@mui/material';
import CommentCard from './CommentCard';
import { deleteComment } from '../axios/axiosComment';

type Props = {
  articleId: number;
  comment: any;
  setAction: any;
}
export default function CommentsCard(props: Props) {
  const { articleId, comment, setAction } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [edit, setEdit] = React.useState(false);
  

  const editHndlr = () => {
    setEdit(!edit);
    setAnchorEl(null);
  }
  const deleteHndlr = (commentId:number) => {
    deleteComment(commentId,(res)=>{
      console.log(res.data);
      setAction(`comments delete${commentId}`);
      setAnchorEl(null);
    })
  }
  const closeHndlr = () => {
    setAnchorEl(null);
  }
  return (
    <>
      {
         edit ? 
          <CommentCard 
            articleId={articleId} 
            setAction={setAction}
            editTime={true} 
            setEdit={setEdit} 
            defaultComment={comment}
          />
          :
          <Card sx={{ width: '100%', marginBottom: '20px' }}>
            <CardHeader
              avatar={
                <Avatar alt="メンバー画像" src={comment.member.photo_url} />
              }
              title={comment.member.name}
              subheader={comment.created_at.slice(0, 10) + ' ' + comment.created_at.slice(11, 19)}
              action={
                <>
                  <IconButton aria-label="settings" onClick={(e) => { setAnchorEl(e.currentTarget); }}>
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
              <MenuItem onClick={()=>deleteHndlr(comment.id)}>削除</MenuItem>
            </Menu>
            <CardContent>
              <pre className="markdown-preview">
                <Markdown remarkPlugins={[remarkGfm]}>{comment.body}</Markdown>
              </pre>
            </CardContent>
          </Card>
      }

    </>
  );
}


