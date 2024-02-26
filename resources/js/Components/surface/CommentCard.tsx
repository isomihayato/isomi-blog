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
import remarkGfm from 'remark-gfm'
import postComment from '../axios/axiosComment';

type Props = {
  articleId: number;
}
export default function CommentCard(props: Props) {
  const { articleId } = props;
  const [preview, setPreview] = React.useState(false);
  const [comment,setComment] = React.useState('');
  const photoURL = getStorage('photoUrl');
  const submitHndlr = (e:any) => {
    e.preventDefault();
    const user = getStorage('user');
    const data = {body: comment,fb_uid: user.uid,article_id: articleId};
    console.log(data);
    postComment(data, (res:any) => {
      console.log(res.data);
      if (res.dadta.status === 'success') {
        window.location.reload();
      }
    });
  }

  return (
    <Card sx={{ width: '100%' }} component={"form"} onSubmit={submitHndlr}>
      <CardHeader
        avatar={
            <Avatar alt="メンバー画像" src={photoURL}/>
        }
        action={
          <>
            <Button variant='contained' onClick={()=>setPreview(!preview)}>プレビュー</Button>
          </>
        }
      />
      <CardContent>
        {
          preview ? 
            <pre className="markdown-preview">
              <Markdown remarkPlugins={[remarkGfm]}>{comment}</Markdown>
            </pre>
          :
            <TextareaAutosize 
              name="comment_body" 
              minRows={10} 
              style={{width: '100%'}}
              placeholder='コメントを入力'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
        }
      </CardContent>
      <CardActions disableSpacing sx={{float: 'right'}}>
        <Button type="submit" variant='contained'>投稿する</Button>
      </CardActions>
    </Card>
  );
}


