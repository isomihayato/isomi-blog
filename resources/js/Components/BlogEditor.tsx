import { Button, Grid } from '@mui/material';
import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { postArticleImg } from './axios/axiosArticle';

function BlogEditor() {
  const [markdown, setMarkdown] = useState('');
  const [emojiShow, setEmojiShow] = useState(false);

  const handleChange = (event) => {
    setMarkdown(event.target.value);
  };
  const handleImageUpload = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      postArticleImg({file:file}, (res) => {
        const imageUrl = res.data.url;
        setMarkdown(markdown + `![${file.name}](${imageUrl})\n`);
      });
    }
  };
  const onEmojiSelectHndl = (emoji) => {
    setMarkdown(markdown + emoji.native);
    setEmojiShow(false);
  }

  return (
    <div className="markdown-editor">
      {
        emojiShow && <Picker data={data} onEmojiSelect={onEmojiSelectHndl} />
      }
      <Button onClick={() => setEmojiShow(!emojiShow)}>
        {emojiShow ? 'Close' : 'Open'} Emoji
      </Button>
        <button onClick={() => document.getElementById('image-upload').click()}>
        Insert Image
      </button>
      <input
        type="file"
        id="image-upload"
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleImageUpload}
      />

      <Grid container>
        <Grid item xs={6}>
          <textarea
            name="body"
            className="markdown-input"
            value={markdown}
            onChange={handleChange}
            style={{ width: '100%', height: '540px' }}
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