import { Alert, Button, Grid } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { postArticleImg } from './axios/axiosArticle';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import imageCompression from 'browser-image-compression';
import { Draft, clearDraft, loadDraft, saveDraft } from './common/draftStorage';

// 入力が止まってから自動保存するまでの時間(ミリ秒)
const AUTOSAVE_DELAY = 1000;

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
  // 下書きを自動保存するときのキー(例: article:new, article:12)。指定しないと自動保存しない
  draftKey?: string;
};

function BlogEditor(props: Props) {
  const { body, draftKey } = props;
  // 編集画面では、保存済みの本文を初期値にする
  const [markdown, setMarkdown] = useState(body ?? '');
  const [emojiShow, setEmojiShow] = useState(false);
  // 前回の書きかけ(保存済みの本文と違うときだけ、復元するかを聞く)
  const [pendingDraft, setPendingDraft] = useState<Draft | null>(() => {
    if (!draftKey) return null;
    const draft = loadDraft(draftKey);
    return draft && draft.body !== (body ?? '') ? draft : null;
  });
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // 開いた直後(まだ何も入力していない)と、復元するかを聞いている間は保存しない
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!draftKey || pendingDraft) return;
    const timer = setTimeout(() => {
      saveDraft(draftKey, markdown);
      setSavedAt(new Date().toLocaleTimeString('ja-JP'));
    }, AUTOSAVE_DELAY);
    return () => clearTimeout(timer);
  }, [markdown, draftKey, pendingDraft]);

  const restoreDraft = () => {
    if (!pendingDraft) return;
    setMarkdown(pendingDraft.body);
    setPendingDraft(null);
  };
  const discardDraft = () => {
    if (draftKey) clearDraft(draftKey);
    setPendingDraft(null);
  };

  const handleChange = (event) => {
    setMarkdown(event.target.value);
  };
  const handleImageUpload = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      if (compressedFile) {
        postArticleImg({ file: compressedFile }, (res) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          const imageUrl = res.data.url;
          setMarkdown((current) => current + `![${file.name}](${imageUrl})\n`);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const onEmojiSelectHndl = (emoji) => {
    setMarkdown((current) => current + emoji.native);
    setEmojiShow(false);
  };

  return (
    <div className="markdown-editor">
      {pendingDraft ? (
        <Alert
          severity="warning"
          sx={{ mb: 1 }}
          action={
            <>
              <Button color="inherit" size="small" onClick={restoreDraft}>
                復元する
              </Button>
              <Button color="inherit" size="small" onClick={discardDraft}>
                破棄する
              </Button>
            </>
          }
        >
          {new Date(pendingDraft.savedAt).toLocaleString('ja-JP')}
          に自動保存した書きかけの本文があります。復元しますか?
        </Alert>
      ) : null}
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
          />
          {draftKey ? (
            <div style={{ fontSize: '.8rem', color: '#616161' }}>
              {savedAt
                ? `${savedAt} に下書きを自動保存しました(このブラウザだけに保存されます)`
                : '入力内容は、このブラウザに自動保存されます'}
            </div>
          ) : null}
        </Grid>
        <Grid item xs={6}>
          <pre className="markdown-preview">
            <Markdown rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}>
              {markdown}
            </Markdown>
          </pre>
        </Grid>
      </Grid>
    </div>
  );
}

export default BlogEditor;
