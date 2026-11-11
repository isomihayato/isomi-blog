import React from 'react';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

type Props = React.ComponentPropsWithoutRef<'pre'> & {
  node?: unknown; // react-markdown から渡される構文木(DOM には渡さない)
};

// Markdown のコードブロック(```)用の pre。右上にコピーボタンを付ける
export default function CodeBlock(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { node, children, className, ...rest } = props;
  const preRef = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);

  const copyHndlr = async () => {
    const text = preRef.current?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="code-block">
      <IconButton
        className="code-block__copy"
        aria-label={copied ? 'コピーしました' : 'コードをコピー'}
        title={copied ? 'コピーしました' : 'コードをコピー'}
        size="small"
        onClick={copyHndlr}
      >
        {copied ? (
          <CheckIcon fontSize="inherit" />
        ) : (
          <ContentCopyIcon fontSize="inherit" />
        )}
      </IconButton>
      <pre
        ref={preRef}
        className={['code-block__pre', className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </pre>
    </div>
  );
}
