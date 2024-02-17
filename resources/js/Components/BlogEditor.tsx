import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

function BlogEditor() {
  const [markdown, setMarkdown] = useState('');

  const handleChange = (event) => {
    setMarkdown(event.target.value);
  };

  return (
    <div className="markdown-editor">
      <textarea
        className="markdown-input"
        value={markdown}
        onChange={handleChange}
      />
      <div className="markdown-preview">
      <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
      </div>
    </div>
  );
}

export default BlogEditor;