import { Button, Grid } from '@mui/material';
import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { postArticleImg } from './axios/axiosArticle';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
  body?: string;
};

function BlogEditor(props: Props) {
  const [markdown, setMarkdown] = useState('');
  const [emojiShow, setEmojiShow] = useState(false);
  const { body } = props;

  const handleChange = (event) => {
    setMarkdown(event.target.value);
  };
  const handleImageUpload = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      postArticleImg({ file: file }, (res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const imageUrl = res.data.url;
        setMarkdown(markdown + `![${file.name}](${imageUrl})\n`);
      });
    }
  };
  const onEmojiSelectHndl = (emoji) => {
    setMarkdown(markdown + emoji.native);
    setEmojiShow(false);
  };

  return (
    <div className="markdown-editor">
      {emojiShow && <Picker data={data} onEmojiSelect={onEmojiSelectHndl} />}
      <Button onClick={() => setEmojiShow(!emojiShow)}>
        {emojiShow ? 'Close' : 'Open'} Emoji
      </Button>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        onChange={handleImageUpload}
      >
        Upload file
        <VisuallyHiddenInput type="file" />
      </Button>

      <Grid container>
        <Grid item xs={6}>
          <textarea
            name="body"
            className="markdown-input"
            value={markdown}
            onChange={handleChange}
            style={{ width: '100%', height: '540px' }}
            defaultValue={body}
          />
        </Grid>
        <Grid item xs={6}>
          <pre className="markdown-preview">
            <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
          </pre>
        </Grid>
      </Grid>
    </div>
  );
}

export default BlogEditor;
