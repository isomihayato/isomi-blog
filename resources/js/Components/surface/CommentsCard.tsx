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

type Props = {
  comment: any;
}
export default function CommentCard(props: Props) {
  const { comment } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const closeHndlr = () => {
    setAnchorEl(null);
  }
  return (
    <Card sx={{ width: '100%', marginBottom: '20px' }}>
      <CardHeader
        avatar={
          <Avatar alt="メンバー画像" src={comment.member.photo_url} />
        }
        title={comment.member.name}
        subheader={comment.created_at}
        action={
          <>
            <IconButton aria-label="settings" onClick={(e)=>{setAnchorEl(e.currentTarget);}}>
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
        <MenuItem onClick={closeHndlr}>編集</MenuItem>
        <MenuItem onClick={closeHndlr}>削除</MenuItem>
      </Menu>
      <CardContent>
        <pre className="markdown-preview">
          <Markdown remarkPlugins={[remarkGfm]}>{comment.body}</Markdown>
        </pre>
      </CardContent>
    </Card>
  );
}


